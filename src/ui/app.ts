import { animate, createScope } from "animejs";
import { APP_VERSION } from "../config/versions";
import {
  LocalSettingsRepository,
  type UserSettings,
} from "../storage/settings";
import { parseRoute } from "./router";
import { mountTrackPreview } from "../game/track-preview";
import {
  createPracticeSession,
  practiceScreen,
  connectTypingPractice,
} from "./typing-practice";
import {
  createQuickRaceSession,
  quickRaceScreen,
  connectQuickRace,
} from "./quick-race";

const SAMPLE = "Every great run starts with a single keystroke.";
const ARROW = '<span aria-hidden="true">↗</span>';

export function mountApp(root: HTMLElement): () => void {
  const repository = new LocalSettingsRepository(() => localStorage);
  let settings = repository.load();
  const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let scope: ReturnType<typeof createScope> | undefined;
  let unmountPreview: (() => void) | undefined;
  let clearScreen: (() => void) | undefined;
  let generation = 0;
  const practiceSession = createPracticeSession();
  const quickRaceSession = createQuickRaceSession();
  const reducedMotion = () =>
    settings.motion === "reduced" ||
    (settings.motion === "system" && systemMotion.matches);

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="#/hub" aria-label="TurboType home"><img src="${import.meta.env.BASE_URL}assets/brand-mark.svg" width="34" height="34" alt="" />TURBO<span>TYPE</span></a>
        <nav aria-label="Main navigation"><a href="#/hub" data-route="hub">The hub</a><a href="#/race" data-route="race">Race</a><a href="#/practice" data-route="practice">Practice</a><a href="#/keyboard" data-route="keyboard">Keyboard check</a><a href="#/settings" data-route="settings">Settings</a></nav>
        <span class="guest"><span class="status-dot"></span> GUEST DRIVER</span>
      </header>
      <main id="main" tabindex="-1"></main>
      <footer class="footer"><span><b>TURBOTYPE</b> / BUILT FOR THE LONG RUN</span><span>Single-player race preview · ${APP_VERSION}</span><a href="https://github.com/sahilshah2904/TurboType" target="_blank" rel="noopener noreferrer">Follow development ${ARROW}</a></footer>
    </div>`;
  const main = root.querySelector<HTMLElement>("main")!;

  function applyPreferences(): void {
    document.documentElement.dataset.motion = reducedMotion()
      ? "reduced"
      : "full";
    document.documentElement.dataset.textSize = settings.largeText
      ? "large"
      : "standard";
  }

  function render(): void {
    const currentGeneration = ++generation;
    clearScreen?.();
    clearScreen = undefined;
    scope?.revert();
    unmountPreview?.();
    unmountPreview = undefined;
    const route = parseRoute(location.hash);
    applyPreferences();
    root.querySelectorAll<HTMLElement>("[data-route]").forEach((link) => {
      if (link.dataset.route === route)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = `TurboType — ${route === "hub" ? "Your words. Full throttle." : route === "race" ? "Quick Race" : route === "practice" ? "Typing practice" : route === "keyboard" ? "Keyboard check" : "Settings"}`;
    main.innerHTML =
      route === "hub"
        ? hubScreen()
        : route === "race"
          ? quickRaceScreen()
          : route === "practice"
            ? practiceScreen()
            : route === "keyboard"
              ? keyboardScreen()
              : settingsScreen(settings);
    scope = createScope({ root: main }).add(() => {
      if (!reducedMotion())
        animate(".reveal", {
          opacity: [0, 1],
          y: [14, 0],
          duration: 550,
          delay: (_el, i) => (i ?? 0) * 65,
          ease: "out(3)",
        });
    });
    if (route === "hub") {
      const track = main.querySelector<HTMLElement>("#track-preview")!;
      const message = main.querySelector<HTMLElement>("#track-status")!;
      const mount = () => {
        track.removeAttribute("data-ready");
        main.querySelector("#retry-preview")?.setAttribute("hidden", "");
        message.textContent = "Loading track preview…";
        mountTrackPreview(track, {
          reducedMotion: reducedMotion(),
          effects: settings.effects,
          onReady: (text) => {
            if (currentGeneration === generation) {
              message.textContent = text;
              main.querySelector("#retry-preview")?.setAttribute("hidden", "");
            }
          },
          onError: (text) => {
            if (currentGeneration === generation) {
              message.textContent = text;
              main.querySelector("#retry-preview")?.removeAttribute("hidden");
            }
          },
        })
          .then((dispose) => {
            if (currentGeneration !== generation) dispose();
            else unmountPreview = dispose;
          })
          .catch(() => {
            if (currentGeneration === generation) {
              message.textContent =
                "The track could not start. You can still check your keyboard or change settings.";
              main.querySelector("#retry-preview")?.removeAttribute("hidden");
            }
          });
      };
      mount();
      main.querySelector("#retry-preview")?.addEventListener("click", () => {
        unmountPreview?.();
        track.replaceChildren();
        mount();
      });
    }
    if (route === "keyboard") clearScreen = connectKeyboard(main);
    if (route === "practice")
      clearScreen = connectTypingPractice(main, practiceSession);
    if (route === "race")
      clearScreen = connectQuickRace(main, quickRaceSession, reducedMotion);
    if (route === "settings") {
      main.querySelector("form")!.addEventListener("change", () => {
        const form = new FormData(main.querySelector("form")!);
        settings = {
          motion: form.get("motion") as UserSettings["motion"],
          effects: form.get("effects") as UserSettings["effects"],
          largeText: form.get("largeText") === "on",
        };
        const saved = repository.save(settings);
        applyPreferences();
        if (reducedMotion()) scope?.revert();
        main.querySelector("#save-status")!.textContent = saved
          ? "Preferences saved on this browser."
          : "Preferences applied for this visit. Browser storage is unavailable.";
      });
    }
  }

  const onNavigate = () => {
    render();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  };
  const onMotion = () => {
    if (settings.motion === "system") {
      if (parseRoute(location.hash) === "hub") render();
      else applyPreferences();
    }
  };
  window.addEventListener("hashchange", onNavigate);
  systemMotion.addEventListener("change", onMotion);
  const skipLink = document.querySelector<HTMLAnchorElement>(".skip-link");
  const skip = (event: Event) => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
  };
  skipLink?.addEventListener("click", skip);
  render();
  return () => {
    generation++;
    clearScreen?.();
    scope?.revert();
    unmountPreview?.();
    window.removeEventListener("hashchange", onNavigate);
    systemMotion.removeEventListener("change", onMotion);
    skipLink?.removeEventListener("click", skip);
    root.replaceChildren();
  };
}

function hubScreen(): string {
  return `
    <section class="hero reveal" aria-labelledby="hero-title">
      <div><p class="eyebrow"><span class="status-dot"></span> FIND YOUR RHYTHM. OWN THE ROAD.</p><h1 id="hero-title">YOUR WORDS.<br /><span>FULL THROTTLE.</span></h1><p class="hero-copy">Turn every keystroke into momentum.<br />Take on four CPUs. Build clean speed.</p><a class="button button--primary" href="#/race">Start a race ${ARROW}</a></div>
      <aside class="hero-note"><span class="outline-number">01</span><p>THE ROAD STARTS HERE</p><span>Four opponents. One passage.<br />Your pace sets your progress.</span></aside>
    </section>
    <section class="track-card reveal" aria-label="Animated track preview">
      <div class="section-top"><span class="eyebrow"><span class="status-dot"></span> TRACK PREVIEW</span><span class="micro">CITY CIRCUIT <span class="divider">/</span> NIGHT RUN</span></div>
      <div id="track-preview" class="track-preview" role="img" aria-label="A lime coupe on an illustrated city road, with two decorative rival cars"></div>
      <div class="track-bottom"><span id="track-status" role="status">Loading track preview…</span><span>Scene preview · no race in progress</span><button id="retry-preview" class="text-button" hidden>Retry preview</button></div>
    </section>
    <section class="campaign-section reveal" aria-labelledby="campaign-heading"><div class="section-heading"><div><p class="eyebrow">THREE GEARS. ONE JOURNEY.</p><h2 id="campaign-heading">Find your starting line.</h2></div><span class="pill">CAMPAIGNS IN DEVELOPMENT</span></div><div class="campaign-grid">
      ${[
        [
          "01",
          "Easy",
          "Build your rhythm",
          "Common words. Clean corrections. A confident start.",
          "green",
        ],
        [
          "02",
          "Medium",
          "Find your flow",
          "Longer words, capitals, and a little more pressure.",
          "orange",
        ],
        [
          "03",
          "Hard",
          "Push your limits",
          "Dense passages. Sharp precision. Sustained speed.",
          "purple",
        ],
      ]
        .map(
          ([number, title, subtitle, description, color]) =>
            `<article class="campaign-card campaign-card--${color}"><div class="card-top"><span class="micro">GEAR ${number}</span><span class="gear-icon" aria-hidden="true">${title === "Easy" ? "Ⅰ" : title === "Medium" ? "Ⅱ" : "Ⅲ"}</span></div><h3>${title}</h3><p class="card-subtitle">${subtitle}</p><p class="card-copy">${description}</p><div class="node-path" aria-hidden="true"><span class="node node--current">1</span><i></i><span class="node">2</span><i></i><span class="node">3</span><i></i><span class="node">···</span></div><div class="card-bottom"><span>100 planned levels</span><span>Coming next ${ARROW}</span></div></article>`,
        )
        .join("")}
    </div></section>
    <div class="development-note reveal"><span class="note-icon" aria-hidden="true">↳</span><p><strong>A strong start, built one lap at a time.</strong> Quick Race is ready. Campaign progression, rewards, cloud saves and visual polish are still being built.</p><a href="#/keyboard">Try the input check →</a></div>`;
}

function keyboardScreen(): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">GET COMFORTABLE AT THE KEYS</p><h1>Check your <span>connection.</span></h1><p>Check how your keyboard enters and edits text.</p></section>
    <section class="input-panel reveal"><div class="section-top"><h2>Keyboard check</h2><span class="pill">NO TIMER · NO SCORE</span></div><p id="sample-label" class="micro">TYPE THIS SENTENCE</p><p id="sample" class="sample">${SAMPLE}</p><label for="keyboard-input">Your text</label><textarea id="keyboard-input" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="input-help input-status" placeholder="Tap here or start typing…"></textarea><div class="input-meta"><p id="input-status" role="status">Ready when you are.</p><button id="reset-input" class="text-button">Clear text</button></div><p id="input-help" class="help">Use your phone keyboard or a physical keyboard. Backspace works normally. This check accepts editing and paste; choose Practice for correction-required typing.</p><div class="keyboard-visual" aria-hidden="true">${["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) => `<div>${[...row].map((key) => `<span data-key="${key}">${key.toUpperCase()}</span>`).join("")}</div>`).join("")}</div><details class="diagnostics"><summary>Input diagnostics</summary><p>For checking keyboard and viewport behavior. Nothing here is uploaded.</p><dl><div><dt>Last input</dt><dd id="event-type">None</dd></div><div><dt>Composition</dt><dd id="composition">Idle</dd></div><div><dt>Visible viewport</dt><dd id="viewport-size">Checking…</dd></div></dl></details></section>`;
}

function connectKeyboard(main: HTMLElement): () => void {
  const input = main.querySelector<HTMLTextAreaElement>("textarea")!;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  function update(): void {
    const value = input.value;
    const status = main.querySelector("#input-status")!;
    status.textContent = !value
      ? "Ready when you are."
      : value === SAMPLE
        ? "All set. Your sentence matches."
        : SAMPLE.startsWith(value)
          ? `${value.length} characters entered. Keep going.`
          : "Your text differs from the sentence. You can edit it or try again.";
    main
      .querySelectorAll<HTMLElement>("[data-key]")
      .forEach((key) =>
        key.classList.toggle(
          "key--next",
          key.dataset.key === SAMPLE[value.length]?.toLowerCase(),
        ),
      );
  }
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
  const viewport = window.visualViewport;
  const updateViewport = () => {
    main.querySelector("#viewport-size")!.textContent =
      `${Math.round(viewport?.width ?? innerWidth)} × ${Math.round(viewport?.height ?? innerHeight)}`;
  };
  viewport?.addEventListener("resize", updateViewport, options);
  window.addEventListener("resize", updateViewport, options);
  updateViewport();
  update();
  return () => controller.abort();
}

function settingsScreen(settings: UserSettings): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">MAKE IT YOUR OWN</p><h1>Your ride.<br /><span>Your settings.</span></h1><p>Comfort first. Find the setup that works for you.</p></section><section class="settings-panel reveal"><form><div class="setting-row"><div><label for="motion">Motion</label><p>Choose how much the track and interface move.</p></div><select name="motion" id="motion">${[
    ["system", "Follow device"],
    ["reduced", "Reduced motion"],
    ["full", "Full motion"],
  ]
    .map(
      ([value, text]) =>
        `<option value="${value}" ${settings.motion === value ? "selected" : ""}>${text}</option>`,
    )
    .join(
      "",
    )}</select></div><div class="setting-row"><div><label for="effects">Track effects</label><p>Use fewer particles for a lighter ride.</p></div><select name="effects" id="effects"><option value="high" ${settings.effects === "high" ? "selected" : ""}>High</option><option value="low" ${settings.effects === "low" ? "selected" : ""}>Low</option></select></div><div class="setting-row"><div><label for="large-text">Larger typing text</label><p>Make passages and typing easier to read.</p></div><input type="checkbox" name="largeText" id="large-text" ${settings.largeText ? "checked" : ""} /></div></form><p id="save-status" class="help" role="status">Preferences are stored on this browser. Cloud saves and game audio are not available in this preview.</p></section>`;
}
