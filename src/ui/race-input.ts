import { TypingEngine } from "../core/typing-engine";

export interface RaceInputController {
  sync(): void;
  dispose(): void;
}

/** Normalize DOM edits at the boundary; never count composing updates as committed keys. */
export function connectRaceInput(
  input: HTMLTextAreaElement,
  engine: TypingEngine,
  changed: () => void,
  notice: (message: string) => void,
): RaceInputController {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let composing = false;
  let pendingCommit = false;
  let compositionBase = "";
  let generation = 0;

  function sync(): void {
    const snapshot = engine.snapshot();
    if (snapshot.state !== "racing" && snapshot.state !== "countdown") {
      composing = false;
      pendingCommit = false;
      generation++;
    }
    if (!composing && !pendingCommit) {
      // Do not rewrite an identical value on HUD ticks: that steals selection
      // and can interfere with native keyboard state even when text is unchanged.
      if (input.value !== snapshot.typedText) {
        input.value = snapshot.typedText;
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  function reject(message: string, assisted = false): void {
    if (assisted) engine.markPractice("blocked-assistance");
    composing = false;
    pendingCommit = false;
    generation++;
    notice(message);
    sync();
    input.setSelectionRange(input.value.length, input.value.length);
    changed();
  }

  input.addEventListener(
    "beforeinput",
    (event) => {
      const e = event as InputEvent;
      const snapshot = engine.snapshot();
      if (snapshot.state !== "racing") {
        if (e.cancelable) e.preventDefault();
        sync();
        return;
      }
      if (composing || pendingCommit || e.isComposing) return;
      if (
        [
          "insertReplacementText",
          "insertFromPaste",
          "insertFromDrop",
          "insertFromYank",
        ].includes(e.inputType)
      ) {
        if (e.cancelable) e.preventDefault();
        reject(
          "Word replacement or bulk entry was blocked. This run is practice-only.",
          true,
        );
        return;
      }
      if (
        ![
          "insertText",
          "insertLineBreak",
          "insertParagraph",
          "deleteContentBackward",
        ].includes(e.inputType) ||
        input.selectionStart !== snapshot.typedText.length ||
        input.selectionEnd !== snapshot.typedText.length
      ) {
        if (e.cancelable) e.preventDefault();
        reject(
          "Type at the end and use Backspace to correct the latest character.",
        );
      }
    },
    options,
  );

  input.addEventListener(
    "input",
    (event) => {
      const e = event as InputEvent;
      if (composing || pendingCommit || e.isComposing) return;
      const snapshot = engine.snapshot();
      if (snapshot.state !== "racing") {
        sync();
        changed();
        return;
      }
      const previous = snapshot.typedText;
      if (input.value === previous) return; // A trailing composition input must not count twice.
      if (
        e.inputType === "deleteContentBackward" &&
        input.value === [...previous].slice(0, -1).join("")
      ) {
        engine.backspace();
      } else if (input.value.startsWith(previous)) {
        const inserted = input.value.slice(previous.length);
        if (
          [...inserted].length !== 1 ||
          !["insertText", "insertLineBreak", "insertParagraph"].includes(
            e.inputType,
          )
        ) {
          reject(
            "Word completion or uncertain bulk input was blocked. Type characters individually; this run is practice-only.",
            true,
          );
          return;
        }
        engine.insert(inserted);
        notice(
          engine.snapshot().errorCharacter === null
            ? "Keep your rhythm."
            : "Backspace to correct the highlighted mistake.",
        );
      } else {
        reject(
          "Text replacement was blocked. Correct from the end with Backspace. This run is practice-only.",
          true,
        );
        return;
      }
      sync();
      changed();
    },
    options,
  );

  input.addEventListener(
    "compositionstart",
    () => {
      if (engine.snapshot().state !== "racing") {
        sync();
        return;
      }
      composing = true;
      compositionBase = engine.snapshot().typedText;
    },
    options,
  );
  input.addEventListener(
    "compositionend",
    () => {
      if (!composing) {
        sync();
        return;
      }
      composing = false;
      pendingCommit = true;
      const token = ++generation;
      queueMicrotask(() => {
        if (token !== generation) return;
        pendingCommit = false;
        if (engine.snapshot().state !== "racing") {
          sync();
          changed();
          return;
        }
        if (!input.value.startsWith(compositionBase)) {
          reject(
            "The keyboard replaced earlier text. This run is practice-only.",
            true,
          );
          return;
        }
        const committed = input.value.slice(compositionBase.length);
        if (committed) {
          engine.markPractice("composed-input");
          engine.insert(committed);
          notice(
            "Composed input counted once. This run is practice-only so records stay comparable.",
          );
        }
        sync();
        changed();
      });
    },
    options,
  );

  for (const type of ["paste", "drop"] as const)
    input.addEventListener(
      type,
      (event) => {
        event.preventDefault();
        reject(
          "Paste and drop are blocked in this exercise. This run is practice-only.",
          true,
        );
      },
      options,
    );
  sync();
  return {
    sync,
    dispose: () => {
      generation++;
      abort.abort();
    },
  };
}
