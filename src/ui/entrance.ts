import { type KartId } from "../content/kart-catalog";
import type { OnboardingPreferences } from "../storage/onboarding";
import { prepareEntrance } from "./entrance-assets";

export function entranceScreen(_kartId: KartId): string {
  return `<section class="entrance-screen" aria-labelledby="entrance-title">
    <div class="entrance-art" aria-hidden="true"><div class="intro-halo"></div><div class="intro-light intro-light--cyan"></div><div class="intro-light intro-light--red"></div><div class="intro-road"></div></div>
    <div class="entrance-copy"><img class="intro-emblem" src="${import.meta.env.BASE_URL}assets/brand-mark.svg" width="100" height="100" alt=""/><p class="intro-kicker">IGNITION / PRECISION / MOMENTUM</p><h1 id="entrance-title" aria-label="TurboType"><span>TURBO</span><span>TYPE</span></h1><p class="intro-tagline">YOUR WORDS. FULL THROTTLE.</p>
    <div class="entrance-actions"><button id="enter-turbotype" class="button button--primary">Enter TurboType →</button></div>
    <div id="entrance-loading" hidden><label for="entrance-progress">Preparing your starting line</label><progress id="entrance-progress" max="5" value="0"></progress><p id="entrance-status" role="status">Waiting to prepare essential artwork.</p></div>
    <div id="entrance-error" hidden><p id="entrance-error-message" role="alert"></p><button id="retry-entrance" class="button button--primary">Retry loading</button><a href="#/rules">Read the rules</a><a href="#/keyboard">Open keyboard check</a></div></div>
    <button id="skip-entrance" class="text-button intro-skip">Skip opening</button></section>`;
}

export function connectEntrance(
  main: HTMLElement,
  kart: KartId,
  prefs: () => OnboardingPreferences,
  unlock: () => void,
): () => void {
  const abort = new AbortController();
  let attempt: AbortController | undefined;
  const screen = main.querySelector<HTMLElement>(".entrance-screen")!;
  const enter = main.querySelector<HTMLButtonElement>("#enter-turbotype")!;
  const still =
    document.documentElement.dataset.motion === "reduced" ||
    document.documentElement.dataset.effects === "low";
  const finishTitle = () => {
    screen.dataset.ended = "true";
    enter.hidden = false;
  };
  enter.hidden = !still;
  let titleTimer: number | undefined;
  if (still) finishTitle();
  else titleTimer = window.setTimeout(finishTitle, 5600);
  let skip = false,
    loading = false;
  const find = <T extends HTMLElement>(id: string) =>
    main.querySelector<T>(id)!;
  const load = async () => {
    attempt?.abort();
    attempt = new AbortController();
    const current = attempt;
    loading = true;
    find<HTMLButtonElement>("#enter-turbotype").disabled = true;
    find("#entrance-loading").hidden = false;
    find("#entrance-error").hidden = true;
    try {
      await prepareEntrance(
        kart,
        current.signal,
        ({ completed, total, label }) => {
          const progress = find<HTMLProgressElement>("#entrance-progress");
          progress.max = total;
          progress.value = completed;
          find("#entrance-status").textContent =
            `${completed} of ${total} essentials ready · ${label}`;
        },
      );
      if (!abort.signal.aborted && !current.signal.aborted)
        location.hash = skip || prefs().welcomeSeen ? "#/hub" : "#/welcome";
    } catch (error) {
      if (abort.signal.aborted || current.signal.aborted) return;
      current.abort();
      loading = false;
      find("#entrance-error").hidden = false;
      find("#entrance-error-message").textContent =
        `${error instanceof Error ? error.message : "Loading could not finish."} Retry, or use the text-based help screens.`;
      find("#entrance-status").textContent =
        "Loading stopped. Your controls are ready below.";
      find<HTMLButtonElement>("#retry-entrance").focus();
    }
  };
  find("#enter-turbotype").addEventListener(
    "click",
    () => {
      unlock();
      void load();
    },
    { signal: abort.signal },
  );
  find("#skip-entrance").addEventListener(
    "click",
    () => {
      skip = true;
      clearTimeout(titleTimer);
      finishTitle();
      main.querySelector(".entrance-art")!.setAttribute("hidden", "");
      find("#skip-entrance").textContent =
        "Opening skipped · preparing essentials";
      if (!loading) {
        unlock();
        void load();
      }
    },
    { signal: abort.signal },
  );
  find("#retry-entrance").addEventListener(
    "click",
    () => {
      void load();
    },
    { signal: abort.signal },
  );
  return () => {
    clearTimeout(titleTimer);
    abort.abort();
    attempt?.abort();
  };
}
export function welcomeScreen(prefs: OnboardingPreferences): string {
  return `<section class="guide-page welcome-page"><p class="eyebrow">WELCOME TO YOUR STARTING LINE</p><h1>Your typing<br/><span>drives the car.</span></h1><p>Match the passage, correct mistakes and build a clean rhythm. Your car moves with correct typing—every model has the same performance.</p><div class="guide-cards"><article><b>01 / Learn the rhythm</b><p>Try three short, interactive lessons. You can skip or replay them anytime.</p></article><article><b>02 / Find your pace</b><p>Optional calibration suggests a CPU pace. You can choose it yourself instead.</p></article><article><b>03 / Take the grid</b><p>Quick Race puts you against four seeded CPUs. Campaigns and friend rooms are still in development.</p></article></div><label class="guide-check"><input id="welcome-skip-intro" type="checkbox" ${prefs.skipIntro ? "checked" : ""}/>Go straight to the hub next time</label><div class="practice-actions"><a id="welcome-rules" class="button button--primary" href="#/rules">Show me how to play →</a><a id="welcome-hub" href="#/hub">Skip to hub</a></div><p id="welcome-save-status" class="help" role="status">Only preferences and learning setup are saved here; race results are session-only.</p></section>`;
}
export function rulesScreen(): string {
  const rules = [
    [
      "Type to move",
      "Wait for 3–2–1–GO, then match every letter, space and punctuation mark. Correct typing moves your car; choosing another model or track never makes it faster.",
    ],
    [
      "Correct the latest mistake",
      "A wrong character stops progress. Press Backspace to remove it, then type the right character. Moving the cursor or pasting a passage cannot bypass the typing rule.",
    ],
    [
      "Build a clean streak",
      "Twenty new correct characters in a row trigger a visual nitro burst. Deleting and retyping cannot farm it; nitro does not skip words or change your score.",
    ],
    [
      "Know your pace",
      "Live WPM shows recent typing speed. Result WPM averages the full run; accuracy counts attempts, including corrected mistakes. Later CPU finishes are labeled as simulated.",
    ],
    [
      "Pause and retry",
      "Escape or leaving a solo race pauses everyone. Resume has a new countdown. Paused/assisted runs are practice-only; retry starts a fresh race. Space types a space inside the passage.",
    ],
    [
      "Your setup, your choice",
      "Choose a car and track before countdown; they stay locked during that race. Quick Race has optional pace/mode choices. Sound, motion, effects and typing size live in Settings. Current races/results are not saved; campaign progress and cloud accounts come later.",
    ],
  ];
  return `<section class="guide-page"><a href="#/hub" class="back-link">← Back to the hub</a><p class="eyebrow">HOW TO PLAY</p><h1>Precision first.<br/><span>Speed follows.</span></h1><div class="guide-cards">${rules.map(([title, body]) => `<article><h2>${title}</h2><p>${body}</p></article>`).join("")}</div><div class="practice-actions"><a class="button button--primary" href="#/tutorial">Start guided tutorial →</a><a href="#/calibration">Find my starting pace</a><a href="#/settings">Comfort & sound settings</a><a href="#/hub">Back to hub</a></div></section>`;
}
