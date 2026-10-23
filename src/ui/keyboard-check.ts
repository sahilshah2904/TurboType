export const KEYBOARD_SAMPLE =
  "the quick brown fox jumps over a lazy dog. THE QUICK BROWN FOX JUMPS OVER A LAZY DOG. Numbers: 0123456789. Symbols: !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
export const KEY_ROWS = [
  [
    { code: "Backquote", label: "` ~", chars: "`~" },
    { code: "Digit1", label: "1 !", chars: "1!" },
    { code: "Digit2", label: "2 @", chars: "2@" },
    { code: "Digit3", label: "3 #", chars: "3#" },
    { code: "Digit4", label: "4 $", chars: "4$" },
    { code: "Digit5", label: "5 %", chars: "5%" },
    { code: "Digit6", label: "6 ^", chars: "6^" },
    { code: "Digit7", label: "7 &", chars: "7&" },
    { code: "Digit8", label: "8 *", chars: "8*" },
    { code: "Digit9", label: "9 (", chars: "9(" },
    { code: "Digit0", label: "0 )", chars: "0)" },
    { code: "Minus", label: "- _", chars: "-_" },
    { code: "Equal", label: "= +", chars: "=+" },
  ],
  [
    { code: "KeyQ", label: "Q", chars: "qQ" },
    { code: "KeyW", label: "W", chars: "wW" },
    { code: "KeyE", label: "E", chars: "eE" },
    { code: "KeyR", label: "R", chars: "rR" },
    { code: "KeyT", label: "T", chars: "tT" },
    { code: "KeyY", label: "Y", chars: "yY" },
    { code: "KeyU", label: "U", chars: "uU" },
    { code: "KeyI", label: "I", chars: "iI" },
    { code: "KeyO", label: "O", chars: "oO" },
    { code: "KeyP", label: "P", chars: "pP" },
    { code: "BracketLeft", label: "[ {", chars: "[{" },
    { code: "BracketRight", label: "] }", chars: "]}" },
    { code: "Backslash", label: "\\ |", chars: "\\|" },
  ],
  [
    { code: "KeyA", label: "A", chars: "aA" },
    { code: "KeyS", label: "S", chars: "sS" },
    { code: "KeyD", label: "D", chars: "dD" },
    { code: "KeyF", label: "F", chars: "fF" },
    { code: "KeyG", label: "G", chars: "gG" },
    { code: "KeyH", label: "H", chars: "hH" },
    { code: "KeyJ", label: "J", chars: "jJ" },
    { code: "KeyK", label: "K", chars: "kK" },
    { code: "KeyL", label: "L", chars: "lL" },
    { code: "Semicolon", label: "; :", chars: ";:" },
    { code: "Quote", label: "' \"", chars: "'\"" },
  ],
  [
    { code: "KeyZ", label: "Z", chars: "zZ" },
    { code: "KeyX", label: "X", chars: "xX" },
    { code: "KeyC", label: "C", chars: "cC" },
    { code: "KeyV", label: "V", chars: "vV" },
    { code: "KeyB", label: "B", chars: "bB" },
    { code: "KeyN", label: "N", chars: "nN" },
    { code: "KeyM", label: "M", chars: "mM" },
    { code: "Comma", label: ", <", chars: ",<" },
    { code: "Period", label: ". >", chars: ".>" },
    { code: "Slash", label: "/ ?", chars: "/?" },
  ],
  [
    { code: "Space", label: "Space", chars: " " },
    { code: "Enter", label: "Enter", chars: "" },
    { code: "Backspace", label: "Backspace", chars: "" },
    { code: "Tab", label: "Tab", chars: "" },
    { code: "CapsLock", label: "Caps Lock", chars: "" },
    { code: "ShiftLeft", label: "Left Shift", chars: "" },
    { code: "ShiftRight", label: "Right Shift", chars: "" },
  ],
  [
    { code: "ControlLeft", label: "Left Ctrl", chars: "" },
    { code: "ControlRight", label: "Right Ctrl", chars: "" },
    { code: "AltLeft", label: "Left Alt", chars: "" },
    { code: "AltRight", label: "Right Alt", chars: "" },
    { code: "Escape", label: "Esc", chars: "" },
    { code: "Delete", label: "Delete", chars: "" },
    { code: "ArrowLeft", label: "\u2190", chars: "" },
    { code: "ArrowUp", label: "\u2191", chars: "" },
    { code: "ArrowDown", label: "\u2193", chars: "" },
    { code: "ArrowRight", label: "\u2192", chars: "" },
    { code: "Home", label: "Home", chars: "" },
    { code: "End", label: "End", chars: "" },
    { code: "PageUp", label: "Page Up", chars: "" },
    { code: "PageDown", label: "Page Down", chars: "" },
  ],
] as const;
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function keyboardScreen(): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">CHECK YOUR TYPING KEYS</p><h1>Every key.<br/><span>A clear signal.</span></h1><p>Try every letter, both cases, numbers and symbols, then your editing and modifier keys.</p></section><section class="input-panel reveal"><div class="section-top"><h2>Keyboard check</h2><span class="pill">NO TIMER · NO SCORE</span></div><p id="sample-label" class="micro">TYPE THIS KEYBOARD SAMPLE</p><p id="sample" class="sample keyboard-sample">${escapeHtml(KEYBOARD_SAMPLE)}</p><label for="keyboard-input">Your text</label><textarea id="keyboard-input" rows="4" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="input-help input-status" placeholder="Click here and start typing…"></textarea><div class="input-meta"><p id="input-status" role="status">Ready when you are.</p><button id="reset-input" class="text-button">Clear text</button><button id="reset-keys" class="text-button">Reset key check</button></div><p id="input-help" class="help">Typing and editing are unrestricted here. Paste can match the sample but does not test keys. Press editing/modifier keys with this text box focused; Tab moves focus normally. Browser or system shortcuts may be intercepted.</p><p id="key-coverage" role="status"></p><div class="keyboard-visual keyboard-check-keys">${KEY_ROWS.map((row, index) => `<ul aria-label="Keyboard row ${index + 1}">${row.map((key) => `<li data-code="${key.code}" data-key="${escapeHtml(key.chars)}" aria-label="${escapeHtml(key.label)}, not yet detected">${escapeHtml(key.label)}</li>`).join("")}</ul>`).join("")}</div><p class="help">Highlighted = next sample key. Green = a key press received on this visit. This is a browser input check; nothing is uploaded.</p><details class="diagnostics"><summary>Input diagnostics</summary><dl><div><dt>Last input</dt><dd id="event-type">None</dd></div><div><dt>Last physical key</dt><dd id="physical-key">None</dd></div><div><dt>Composition</dt><dd id="composition">Idle</dd></div><div><dt>Visible viewport</dt><dd id="viewport-size">Checking…</dd></div></dl></details></section>`;
}
export function connectKeyboard(main: HTMLElement): () => void {
  const input = main.querySelector<HTMLTextAreaElement>("#keyboard-input")!;
  const controller = new AbortController(),
    options = { signal: controller.signal };
  const seen = new Set<string>();
  const keys = Array.from(main.querySelectorAll<HTMLElement>("[data-code]"));
  function update() {
    const value = input.value;
    main.querySelector("#input-status")!.textContent = !value
      ? "Ready when you are."
      : value === KEYBOARD_SAMPLE
        ? "Sample matches. Check the key indicators for actual key presses."
        : KEYBOARD_SAMPLE.startsWith(value)
          ? `${value.length} characters entered. Keep going.`
          : "Your text differs from the sample. Edit it or try again.";
    keys.forEach((key) => {
      const tested = seen.has(key.dataset.code!);
      key.classList.toggle("key--tested", tested);
      key.classList.toggle(
        "key--next",
        !!KEYBOARD_SAMPLE[value.length] &&
          key.dataset.key!.includes(KEYBOARD_SAMPLE[value.length]),
      );
      key.setAttribute(
        "aria-label",
        `${key.textContent}, ${tested ? "detected" : "not yet detected"}`,
      );
    });
    main.querySelector("#key-coverage")!.textContent =
      `${keys.filter((key) => seen.has(key.dataset.code!)).length} / ${keys.length} common physical keys detected`;
  }
  input.addEventListener(
    "keydown",
    (event) => {
      if (event.isComposing) return;
      seen.add(event.code);
      main.querySelector("#physical-key")!.textContent =
        `${event.code || "Unidentified"} · ${event.key}`;
      update();
    },
    options,
  );
  input.addEventListener(
    "input",
    (event) => {
      main.querySelector("#event-type")!.textContent =
        (event as InputEvent).inputType || "input";
      update();
    },
    options,
  );
  input.addEventListener(
    "compositionstart",
    () => {
      main.querySelector("#composition")!.textContent = "Composing";
    },
    options,
  );
  input.addEventListener(
    "compositionend",
    () => {
      main.querySelector("#composition")!.textContent = "Committed";
      update();
    },
    options,
  );
  main.querySelector("#reset-input")!.addEventListener(
    "click",
    () => {
      input.value = "";
      update();
      input.focus();
    },
    options,
  );
  main.querySelector("#reset-keys")!.addEventListener(
    "click",
    () => {
      seen.clear();
      input.value = "";
      main.querySelector("#physical-key")!.textContent = "None";
      update();
      input.focus();
    },
    options,
  );
  const viewport = () => {
    main.querySelector("#viewport-size")!.textContent =
      `${innerWidth} × ${innerHeight}`;
  };
  window.addEventListener("resize", viewport, options);
  viewport();
  update();
  return () => controller.abort();
}
