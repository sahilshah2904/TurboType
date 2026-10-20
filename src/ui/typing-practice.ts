import {
  TypingEngine,
  type TypingSnapshot,
  type PracticeReason,
} from "../core/typing-engine";
import { PRACTICE_PASSAGES } from "../content/practice-passages";
import { connectRaceInput, type RaceInputController } from "./race-input";

export interface PracticeSession {
  engine: TypingEngine;
  passageIndex: number;
  mode: "sprint" | "time-trial";
}

function buildEngine(
  session: Pick<PracticeSession, "mode" | "passageIndex">,
): TypingEngine {
  return new TypingEngine({
    passage: PRACTICE_PASSAGES[session.passageIndex].text,
    now: () => performance.now(),
    ...(session.mode === "time-trial" ? { timeLimitMs: 60000 } : {}),
  });
}

export function createPracticeSession(): PracticeSession {
  const defaults = { mode: "sprint", passageIndex: 0 } as const;
  return { ...defaults, engine: buildEngine(defaults) };
}

export function practiceScreen(): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">PRECISION BEFORE HORSEPOWER</p><h1>Find your <span>rhythm.</span></h1><p>Practice the rules. Build clean speed. The race starts with you.</p></section>
  <section class="practice-panel input-panel reveal" aria-label="Typing practice">
    <div class="section-top"><h2>Typing sprint</h2><span class="pill">SOLO PRACTICE · NO REWARDS</span></div>
    <div class="practice-options"><div><label for="practice-passage">Passage</label><select id="practice-passage">${PRACTICE_PASSAGES.map((passage, index) => `<option value="${index}">${passage.name}</option>`).join("")}</select></div><div><label for="practice-mode">Mode</label><select id="practice-mode"><option value="sprint">Finish the passage · untimed</option><option value="time-trial">Time trial · 60 second limit</option></select></div></div>
    <div class="run-banner"><div><p id="run-state" class="eyebrow" role="status" aria-live="polite">Ready</p><p id="run-instruction">Select Start run. The timer begins after 3–2–1.</p></div><span id="countdown" class="countdown" aria-hidden="true">—</span></div>
    <div class="metrics-grid" aria-label="Current run metrics">${[
      ["wpm", "WPM"],
      ["accuracy", "ACCURACY"],
      ["elapsed", "ACTIVE TIME"],
      ["streak", "CLEAN STREAK"],
    ]
      .map(
        ([id, label]) =>
          `<div><span class="micro">${label}</span><strong id="metric-${id}">—</strong></div>`,
      )
      .join("")}</div>
    <label class="micro" id="passage-label">YOUR PASSAGE · MATCH CASE, SPACES AND PUNCTUATION</label><p id="race-passage" class="race-passage" aria-labelledby="passage-label"></p>
    <label for="race-input">Your typing</label><textarea id="race-input" rows="2" readonly autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="race-help race-notice" placeholder="Select Start run, then type after GO…"></textarea>
    <p id="race-notice" class="help" role="status">Use Backspace to correct a mistake before continuing.</p>
    <div class="run-progress"><progress id="typing-progress" max="1" value="0" aria-label="Passage progress"></progress><span id="progress-label">0%</span></div>
    <div class="practice-actions"><button id="start-run" class="button button--primary">Start run <span aria-hidden="true">→</span></button><button id="pause-run" class="button button--secondary" disabled>Pause</button><button id="restart-run" class="text-button">Restart</button></div>
    <p id="race-help" class="help">One mistake stops progress. Backspace removes it. Esc pauses. Leaving this screen pauses and preserves your run for this visit. Pauses or assisted input make a run practice-only. Refresh starts a fresh session.</p>
    <div class="run-details"><span id="error-summary">0 errors · 0 corrected</span><span id="run-eligibility">Session only · not saved</span><span id="nitro-status">20 clean characters → nitro</span></div>
    <section id="run-results" class="run-results" aria-labelledby="result-title" hidden><p class="eyebrow">YOUR SESSION RESULT</p><h2 id="result-title">Run complete.</h2><p id="result-summary"></p><p id="result-coaching"></p><p class="help">No XP, credits, campaign progress or personal records are saved by this practice screen. Choose Race to compete with four computer opponents.</p></section>
  </section>`;
}

const REASON_LABELS: Record<PracticeReason, string> = {
  paused: "paused",
  "blocked-assistance": "replacement or bulk input",
  "composed-input": "composed input",
  "uncertain-input": "uncertain input",
};

export function connectTypingPractice(
  main: HTMLElement,
  session: PracticeSession,
): () => void {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const input = main.querySelector<HTMLTextAreaElement>("#race-input")!;
  const start = main.querySelector<HTMLButtonElement>("#start-run")!;
  const pause = main.querySelector<HTMLButtonElement>("#pause-run")!;
  const passageSelect =
    main.querySelector<HTMLSelectElement>("#practice-passage")!;
  const modeSelect = main.querySelector<HTMLSelectElement>("#practice-mode")!;
  let adapter: RaceInputController | undefined;
  let lastState = "";

  function text(selector: string, value: string): void {
    const element = main.querySelector(selector)!;
    if (element.textContent !== value) element.textContent = value;
  }
  const notice = (message: string) => text("#race-notice", message);

  function createPassage(): void {
    const passage = main.querySelector("#race-passage")!;
    passage.replaceChildren(
      ...[...session.engine.snapshot().passage].map((character) => {
        const span = document.createElement("span");
        span.textContent = character;
        return span;
      }),
    );
  }

  function update(): void {
    const s = session.engine.snapshot();
    const ending = ["finished", "timed-out", "abandoned"].includes(s.state);
    main.classList.toggle(
      "practice-active",
      ["countdown", "racing", "paused"].includes(s.state),
    );
    const stateChanged = s.state !== lastState;
    text("#metric-wpm", s.wpm.toFixed(1));
    text(
      "#metric-accuracy",
      s.accuracyPercent === null ? "—" : `${s.accuracyPercent.toFixed(1)}%`,
    );
    text("#metric-elapsed", `${(s.elapsedMs / 1000).toFixed(1)}s`);
    text("#metric-streak", String(s.cleanStreak));
    text(
      "#countdown",
      s.countdown !== null
        ? String(s.countdown)
        : s.state === "racing"
          ? "GO"
          : "—",
    );
    text(
      "#run-state",
      s.state === "timed-out"
        ? "Time limit reached"
        : s.state === "countdown"
          ? `Get ready · ${s.countdown}`
          : s.state.charAt(0).toUpperCase() + s.state.slice(1),
    );
    text(
      "#run-instruction",
      s.state === "ready"
        ? "Select Start run. The timer begins after 3–2–1."
        : s.state === "countdown"
          ? "Keep the input focused. Typing before GO is ignored."
          : s.state === "racing"
            ? s.errorCharacter === null
              ? "Steady hands. Keep moving forward."
              : "Backspace to correct the highlighted mistake."
            : s.state === "paused"
              ? "Your text is safe. Resume with a fresh countdown."
              : "Your result is frozen. Restart to practice again.",
    );
    input.readOnly = !["racing", "countdown"].includes(s.state);
    input.setAttribute("aria-invalid", String(s.errorCharacter !== null));
    start.disabled = !["ready", "paused"].includes(s.state);
    start.textContent = s.state === "paused" ? "Resume run →" : "Start run →";
    pause.disabled = !["racing", "countdown"].includes(s.state);
    passageSelect.disabled = modeSelect.disabled = ![
      "ready",
      "finished",
      "timed-out",
      "abandoned",
    ].includes(s.state);
    (main.querySelector("#typing-progress") as HTMLProgressElement).value =
      s.progress;
    text("#progress-label", `${Math.floor(s.progress * 100)}%`);
    text(
      "#error-summary",
      `${s.errorCount} errors · ${s.correctedErrors} corrected`,
    );
    text(
      "#run-eligibility",
      s.practiceReasons.length
        ? `Practice only: ${s.practiceReasons.map((reason) => REASON_LABELS[reason]).join(", ")}`
        : "Direct input · session only · not saved",
    );
    text(
      "#nitro-status",
      s.nitroActive
        ? "NITRO · clean typing!"
        : `${s.nitroBursts} nitro bursts · best streak ${s.longestStreak}`,
    );
    main
      .querySelector(".practice-panel")!
      .classList.toggle("practice-panel--nitro", s.nitroActive);
    main
      .querySelectorAll<HTMLElement>("#race-passage span")
      .forEach((span, index) => {
        span.className =
          index < s.validatedLength
            ? "character--correct"
            : index === s.validatedLength
              ? s.errorCharacter === null
                ? "character--current"
                : "character--error"
              : "";
      });
    main.querySelector("#run-results")!.toggleAttribute("hidden", !ending);
    if (ending) showResult(s);
    adapter?.sync();
    if (stateChanged && s.state === "paused")
      notice("Paused. Resume when ready; this run is now practice-only.");
    if (stateChanged && s.state === "countdown")
      notice("Get ready. Type after GO.");
    if (stateChanged && s.state === "racing")
      notice(
        s.errorCharacter === null
          ? "GO. Match the passage and keep your rhythm."
          : "Backspace to correct the highlighted mistake.",
      );
    if (stateChanged && ending) {
      notice(
        s.state === "timed-out"
          ? "Time limit reached. Your result is frozen; restart to try again."
          : "This run has ended. Your result is frozen; restart to try again.",
      );
      main.querySelector("#run-results")!.scrollIntoView({ block: "nearest" });
    }
    lastState = s.state;
  }

  function showResult(s: TypingSnapshot): void {
    text(
      "#result-title",
      s.state === "finished"
        ? "Passage complete."
        : s.state === "timed-out"
          ? "Time is up. Keep building."
          : "Run abandoned.",
    );
    text(
      "#result-summary",
      `${s.wpm.toFixed(1)} WPM · ${s.accuracyPercent === null ? "No attempts" : `${s.accuracyPercent.toFixed(1)}% accuracy`} · ${(s.elapsedMs / 1000).toFixed(1)}s active time · ${Math.floor(s.progress * 100)}% complete.`,
    );
    text(
      "#result-coaching",
      s.practiceReasons.some((reason) => reason !== "paused")
        ? "This run includes composed input or a blocked replacement. Try predictive text off for a more comparable direct-input pace."
        : s.accuracyPercent !== null && s.accuracyPercent < 95
          ? "Ease the pace slightly. Aim for clean words before adding speed."
          : "Clean work. Try the longer passage and keep the same steady rhythm.",
    );
  }

  function mountAdapter(): void {
    adapter?.dispose();
    createPassage();
    adapter = connectRaceInput(input, session.engine, update, notice);
    update();
  }
  function reset(): void {
    session.engine.abandon();
    session.engine = buildEngine(session);
    lastState = "";
    notice("Fresh run. Select Start run when ready.");
    mountAdapter();
  }

  passageSelect.value = String(session.passageIndex);
  modeSelect.value = session.mode;
  passageSelect.addEventListener(
    "change",
    () => {
      session.passageIndex = Number(passageSelect.value);
      reset();
    },
    options,
  );
  modeSelect.addEventListener(
    "change",
    () => {
      session.mode = modeSelect.value as PracticeSession["mode"];
      reset();
    },
    options,
  );
  start.addEventListener(
    "click",
    () => {
      session.engine.start();
      update();
      input.focus();
      input.scrollIntoView({ block: "nearest" });
    },
    options,
  );
  pause.addEventListener(
    "click",
    () => {
      session.engine.pause();
      update();
    },
    options,
  );
  main.querySelector("#restart-run")!.addEventListener("click", reset, options);
  const pauseOnBlur = () => {
    session.engine.pause();
    update();
  };
  window.addEventListener("blur", pauseOnBlur, options);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) pauseOnBlur();
    },
    options,
  );
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && !event.repeat) {
        event.preventDefault();
        pauseOnBlur();
      }
    },
    options,
  );
  mountAdapter();
  const interval = window.setInterval(update, 100);
  return () => {
    session.engine.pause();
    adapter?.dispose();
    window.clearInterval(interval);
    abort.abort();
    main.classList.remove("practice-active");
  };
}
