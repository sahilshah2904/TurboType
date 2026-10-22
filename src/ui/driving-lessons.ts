import { TypingEngine, type TypingSnapshot } from "../core/typing-engine";
import { calibrationPace } from "../core/calibration";
import type { CpuTier } from "../core/cpu-schedule";
import { connectRaceInput, type RaceInputController } from "./race-input";
const LESSONS = [
  {
    title: "Match the passage",
    passage: "Go",
    instruction: "After GO, type Go exactly: uppercase G, then lowercase o.",
  },
  {
    title: "Make a mistake. Then correct it.",
    passage: "cat",
    instruction:
      "Type cx on purpose. See how progress stops? Press Backspace, then finish with at. Correcting the mistake keeps it in your accuracy history.",
  },
  {
    title: "Find a clean rhythm",
    passage: "Keep a steady clean rhythm.",
    instruction:
      "Type at least 20 new characters cleanly in a row. Nitro celebrates your streak; it never changes your speed or progress.",
  },
];
const CALIBRATION =
  "Keep a steady pace and let each correct word carry you forward. "
    .repeat(12)
    .trim();
export function learningScreen(kind: "tutorial" | "calibration"): string {
  return `<section class="guide-page learning-page" data-lesson="${kind}"><a href="#/hub" class="back-link">← Back to the hub</a><p class="eyebrow">${kind === "tutorial" ? "YOUR FIRST LAP" : "OPTIONAL / 30 ACTIVE SECONDS"}</p><h1>${kind === "tutorial" ? "Learn the rhythm." : "Find your starting pace."}</h1><p>${kind === "tutorial" ? "Three small lessons using the same correction and streak rules as a race." : "A low-pressure sample suggests a Quick Race opponent pace. It does not unlock levels or award a record. You can skip or choose manually."}</p><div id="lesson-stage"></div><p id="learning-save-status" class="help" role="status">Learning setup stays on this browser. Race results are not saved.</p></section>`;
}
interface LearningOptions {
  kind: "tutorial" | "calibration";
  preferred: CpuTier;
  completed: () => boolean;
  applyPace: (
    tier: CpuTier,
    sample: { wpm: number; accuracy: number } | null,
  ) => { saved: boolean; applied: boolean };
}
export function connectLearning(
  main: HTMLElement,
  options: LearningOptions,
): () => void {
  const abort = new AbortController(),
    events = { signal: abort.signal };
  let stage = 0,
    engine: TypingEngine,
    adapter: RaceInputController | undefined,
    awardRecorded = false;
  let timer: number | undefined,
    lastState = "";
  const find = <T extends HTMLElement = HTMLElement>(id: string) =>
    main.querySelector<T>(id)!;
  const status = (message: string) => {
    const el = main.querySelector("#lesson-notice");
    if (el && el.textContent !== message) el.textContent = message;
  };
  const finished = (s: TypingSnapshot) =>
    ["finished", "timed-out"].includes(s.state);
  const passed = (s: TypingSnapshot) =>
    s.state === "finished" &&
    (stage !== 1 || s.correctedErrors > 0) &&
    (stage !== 2 || s.nitroBursts > 0);
  function result(): void {
    const s = engine.snapshot(),
      panel = find("#lesson-result");
    panel.hidden = !finished(s);
    if (!finished(s)) return;
    if (options.kind === "tutorial") {
      const success = passed(s);
      find("#lesson-result-copy").textContent = success
        ? stage === 2
          ? "Tutorial complete. You matched the passage, corrected a mistake and earned a clean streak."
          : stage === 1
            ? `Corrected! Accuracy is ${s.accuracyPercent?.toFixed(1)}% because the mistake still counts.`
            : "Nice start. Correct typing moves you forward."
        : stage === 1
          ? "That was a clean run. Try again with one deliberate wrong character, then Backspace to correct it."
          : "Try again for a 20-character clean streak. One mistake breaks the streak.";
      find<HTMLButtonElement>("#lesson-next").hidden = !success || stage === 2;
      find("#tutorial-finish").hidden = !success || stage !== 2;
      if (success && stage === 2 && !awardRecorded) {
        awardRecorded = true;
        const saved = options.completed();
        find("#learning-save-status").textContent = saved
          ? "Tutorial completion saved on this browser. Replay anytime from Settings."
          : "Tutorial complete for this visit; browser storage is unavailable.";
      }
    } else {
      const tier = calibrationPace(s);
      find("#lesson-result-copy").textContent = tier
        ? `${s.wpm.toFixed(1)} average WPM · ${s.accuracyPercent!.toFixed(1)}% accuracy. Suggested starting pace: ${tier}.`
        : "No reliable suggestion yet. Try at least 20 correct characters over 10 active seconds without pauses or assisted input, or choose your own pace below.";
      if (s.state !== lastState && tier)
        find<HTMLSelectElement>("#calibration-pace").value = tier;
    }
  }
  function update(): void {
    const s = engine.snapshot();
    main.classList.toggle(
      "learning-active",
      ["countdown", "racing", "paused"].includes(s.state),
    );
    const stateMessage =
      s.state === "countdown"
        ? `Get ready · ${s.countdown}`
        : s.state === "racing"
          ? "GO · type the passage"
          : s.state === "timed-out"
            ? "Sample complete"
            : s.state === "paused"
              ? "Paused · resume when ready"
              : s.state === "finished"
                ? "Passage complete"
                : "Ready · start when you are";
    if (find("#lesson-state").textContent !== stateMessage)
      find("#lesson-state").textContent = stateMessage;
    const input = find<HTMLTextAreaElement>("#race-input");
    input.readOnly = !["racing", "countdown"].includes(s.state);
    input.setAttribute("aria-invalid", String(s.errorCharacter !== null));
    const start = find<HTMLButtonElement>("#lesson-start");
    start.disabled = !["ready", "paused"].includes(s.state);
    start.textContent =
      s.state === "paused"
        ? "Resume lesson"
        : options.kind === "calibration"
          ? "Start sample"
          : "Start lesson";
    find<HTMLButtonElement>("#lesson-pause").disabled = ![
      "racing",
      "countdown",
    ].includes(s.state);
    find("#lesson-wpm").textContent = s.wpm.toFixed(1);
    find("#lesson-accuracy").textContent =
      s.accuracyPercent === null ? "—" : `${s.accuracyPercent.toFixed(1)}%`;
    find("#lesson-time").textContent =
      options.kind === "calibration"
        ? `${Math.max(0, Math.ceil((30000 - s.elapsedMs) / 1000))}s left`
        : `${(s.elapsedMs / 1000).toFixed(1)}s`;
    find("#lesson-streak").textContent =
      `${s.cleanStreak} clean · ${s.nitroBursts} ${s.nitroBursts === 1 ? "burst" : "bursts"}`;
    find<HTMLProgressElement>("#lesson-progress").value = s.progress;
    const spans = main.querySelectorAll<HTMLElement>("#race-passage span");
    spans.forEach((span, index) => {
      span.className =
        index < s.validatedLength
          ? "character--correct"
          : index === s.validatedLength
            ? s.errorCharacter === null
              ? "character--current"
              : "character--error"
            : "";
    });
    const target = find("#race-passage"),
      caret = target.querySelector<HTMLElement>(
        ".character--current,.character--error",
      );
    if (caret) {
      target.scrollLeft =
        document.documentElement.dataset.textSize === "large"
          ? 0
          : Math.max(0, caret.offsetLeft - target.clientWidth * 0.26);
      target.scrollTop = Math.max(0, caret.offsetTop - target.clientHeight / 2);
    }
    if (s.errorCharacter !== null)
      status(
        "Mistake stops progress. Press Backspace, then type the expected character.",
      );
    else if (s.state !== lastState)
      status(
        s.state === "racing"
          ? "Type now. Match case, spaces and punctuation."
          : s.state === "paused"
            ? "Your text is safe. Resume uses a fresh countdown."
            : s.state === "countdown"
              ? "Wait for GO; early keys are ignored."
              : "Use Backspace to correct the latest character.",
      );
    result();
    adapter?.sync();
    lastState = s.state;
  }
  function mountStage(): void {
    adapter?.dispose();
    clearInterval(timer);
    engine?.abandon();
    lastState = "";
    const lesson = LESSONS[stage];
    engine = new TypingEngine({
      passage: options.kind === "tutorial" ? lesson.passage : CALIBRATION,
      now: () => performance.now(),
      ...(options.kind === "calibration" ? { timeLimitMs: 30000 } : {}),
    });
    find("#lesson-stage").innerHTML =
      `<section class="lesson-panel"><p class="eyebrow">${options.kind === "tutorial" ? `LESSON ${stage + 1} OF 3` : "QUICK RACE PACE / OPTIONAL"}</p><h2 id="lesson-title">${options.kind === "tutorial" ? lesson.title : "Keep it comfortable."}</h2><p>${options.kind === "tutorial" ? lesson.instruction : "Type after GO. Steady, accurate typing gives a more useful estimate than a quick burst."}</p><p id="lesson-state" role="status"></p><div class="metrics-grid"><div><span class="micro">AVERAGE WPM</span><strong id="lesson-wpm">0</strong></div><div><span class="micro">ACCURACY</span><strong id="lesson-accuracy">—</strong></div><div><span class="micro">${options.kind === "tutorial" ? "ACTIVE TIME" : "TIME REMAINING"}</span><strong id="lesson-time">0</strong></div></div>
    <div class="typing-surface"><p id="race-passage" aria-label="Passage to type"></p><label class="sr-only" for="race-input">Your typing</label><textarea id="race-input" rows="2" readonly autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="lesson-title race-passage lesson-notice"></textarea></div><p id="lesson-notice" class="help" role="status"></p><p id="lesson-streak" class="help"></p><progress id="lesson-progress" max="1" value="0" aria-label="Passage progress"></progress>
    <div class="practice-actions"><button id="lesson-start" class="button button--primary">Start lesson</button><button id="lesson-pause" class="button button--secondary" disabled>Pause lesson</button><button id="lesson-retry" class="text-button">Retry lesson</button><a href="#/hub">Skip to hub</a></div>
    <div id="lesson-result" hidden><p id="lesson-result-copy"></p>${options.kind === "tutorial" ? '<button id="lesson-next" class="button button--primary" hidden>Next lesson →</button><div id="tutorial-finish" class="practice-actions" hidden><a class="button button--primary" href="#/calibration">Find my starting pace →</a><a href="#/hub">Finish & open hub</a></div>' : ""}</div>
    ${options.kind === "calibration" ? `<div class="pace-choice"><label for="calibration-pace">Choose opponent pace</label><select id="calibration-pace"><option value="easy">Easy · 18–30 target WPM</option><option value="medium">Medium · 35–50 target WPM</option><option value="hard">Hard · 65–85 target WPM</option></select><button id="use-calibration" class="button button--secondary">Use this pace</button><a href="#/race">Skip & open Quick Race</a><p class="help">This is a starting suggestion for CPU opponents, not a campaign category. You can always change it in Quick Race setup.</p></div>` : ""}</section>`;
    if (options.kind === "calibration")
      find<HTMLSelectElement>("#calibration-pace").value = options.preferred;
    const target = find("#race-passage");
    for (const char of engine.snapshot().passage) {
      const span = document.createElement("span");
      span.textContent = char;
      target.append(span);
    }
    adapter = connectRaceInput(
      find<HTMLTextAreaElement>("#race-input"),
      engine,
      update,
      status,
    );
    timer = window.setInterval(update, 100);
    update();
  }
  const pause = () => {
    engine.pause();
    update();
  };
  main.addEventListener(
    "click",
    (event) => {
      const id = (event.target as HTMLElement).closest("button")?.id;
      if (id === "lesson-start") {
        engine.start();
        update();
        find<HTMLTextAreaElement>("#race-input").focus();
      }
      if (id === "lesson-pause") pause();
      if (id === "lesson-retry") mountStage();
      if (id === "lesson-next" && passed(engine.snapshot()) && stage < 2) {
        stage++;
        mountStage();
        find("#lesson-title").setAttribute("tabindex", "-1");
        find("#lesson-title").focus();
      }
      if (id === "use-calibration" && options.kind === "calibration") {
        const tier = find<HTMLSelectElement>("#calibration-pace").value;
        if (tier !== "easy" && tier !== "medium" && tier !== "hard") return;
        const s = engine.snapshot(),
          recommendation = calibrationPace(s);
        const saved = options.applyPace(
          tier,
          recommendation ? { wpm: s.wpm, accuracy: s.accuracyPercent! } : null,
        );
        find("#learning-save-status").textContent =
          `${tier} pace ${saved.applied ? "applied to ready Quick Race setup" : "saved for retry or a new session; your existing race is unchanged"}. ${saved.saved ? "Saved on this browser." : "Applied for this visit; browser storage is unavailable."}`;
      }
    },
    events,
  );
  window.addEventListener("blur", pause, events);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) pause();
    },
    events,
  );
  main.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        pause();
      }
    },
    events,
  );
  mountStage();
  return () => {
    abort.abort();
    clearInterval(timer);
    adapter?.dispose();
    engine.pause();
    main.classList.remove("learning-active");
  };
}
