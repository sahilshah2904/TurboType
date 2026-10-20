import { SoloRace } from "../core/solo-race";
import { CPU_TIERS, type CpuTier } from "../core/cpu-schedule";
import { PRACTICE_PASSAGES } from "../content/practice-passages";
import { connectRaceInput, type RaceInputController } from "./race-input";
import { mountRaceTrack } from "../game/race-track";

export interface QuickRaceSession {
  race: SoloRace;
  passageIndex: number;
  tier: CpuTier;
  seed: number;
  timed: boolean;
}
function buildRace(session: Omit<QuickRaceSession, "race">): SoloRace {
  return new SoloRace({
    passage: PRACTICE_PASSAGES[session.passageIndex].text,
    tier: session.tier,
    seed: session.seed,
    now: () => performance.now(),
    ...(session.timed ? { timeLimitMs: 60000 } : {}),
  });
}
export function createQuickRaceSession(): QuickRaceSession {
  const setup = {
    passageIndex: 0,
    tier: "easy",
    seed: Math.floor(Math.random() * 0x100000000),
    timed: false,
  } as const;
  return { ...setup, race: buildRace(setup) };
}
export function quickRaceScreen(): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">FIVE LANES. YOUR NEXT CHALLENGE.</p><h1>Words into <span>motion.</span></h1><p>Race four computer opponents. Finish at your own pace, even if they get there first.</p></section>
  <section class="quick-race input-panel reveal" aria-label="Quick Race">
    <div class="section-top"><h2>Quick Race</h2><span class="pill">YOU + FOUR CPUs</span></div>
    <div class="race-setup practice-options">
      <div><label for="race-passage-select">Passage</label><select id="race-passage-select">${PRACTICE_PASSAGES.map((p, i) => `<option value="${i}">${p.name}</option>`).join("")}</select></div>
      <div><label for="cpu-tier">Opponent pace</label><select id="cpu-tier">${Object.entries(
        CPU_TIERS,
      )
        .map(
          ([key, band]) =>
            `<option value="${key}">${key} · ${band.minWpm}–${band.maxWpm} target WPM</option>`,
        )
        .join("")}</select></div>
      <div><label for="race-mode">Mode</label><select id="race-mode"><option value="untimed">Complete the passage · untimed</option><option value="timed">Time trial · 60 active seconds</option></select></div>
      <div><label for="race-seed">Race seed</label><input id="race-seed" type="number" min="0" max="4294967295" step="1" inputmode="numeric" required aria-describedby="setup-help" /></div>
    </div>
    <p id="setup-help" class="help race-setup">Targets are before reaction, hesitation and correction delays. This is Quick Race, not campaign levels. The same passage, pace and seed replay the same CPU schedules. Pauses or assisted input make a run practice-only. No rewards or results are saved yet.</p>
    <div class="race-visual"><div id="race-track" role="img" aria-label="Five-lane race track; exact positions are listed below"></div><div class="track-bottom"><span id="race-track-status" role="status">Loading race track…</span><button id="retry-race-track" class="text-button" hidden>Retry artwork</button><button id="text-race" class="text-button" hidden>Race with text standings</button></div></div>
    <div class="run-banner"><div><p id="race-state" class="eyebrow" role="status">Ready</p><p id="race-instruction">Wait for the track, then start the countdown.</p></div><span id="race-countdown" class="countdown" aria-hidden="true">—</span></div>
    <div class="race-hud metrics-grid">${[
      ["place", "POSITION"],
      ["wpm", "WPM"],
      ["accuracy", "ACCURACY"],
      ["time", "ACTIVE TIME"],
    ]
      .map(
        ([id, label]) =>
          `<div><span class="micro">${label}</span><strong id="race-${id}">—</strong></div>`,
      )
      .join("")}</div>
    <label id="race-passage-label" class="micro">MATCH CASE, SPACES AND PUNCTUATION</label><p id="race-passage" class="race-passage" aria-labelledby="race-passage-label"></p>
    <label for="race-input">Your typing</label><textarea id="race-input" rows="2" readonly autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="race-notice race-controls-help" placeholder="Start the race, then type after GO…"></textarea>
    <p id="race-notice" class="help" role="status">One mistake stops progress. Backspace corrects it.</p>
    <div class="practice-actions"><button id="start-race" class="button button--primary" disabled>Start race →</button><button id="pause-race" class="button button--secondary" disabled>Pause</button><button id="retry-race" class="text-button">Retry same race</button><button id="new-race" class="text-button">New seed</button></div>
    <p id="race-controls-help" class="help">Esc or leaving this screen pauses everyone. Resume has a fresh countdown. Retry resets the run; refresh discards this unsaved session.</p>
    <div class="run-details"><span id="race-errors">0 errors · 0 corrected</span><span id="race-eligibility">Session only · not saved</span><span id="race-streak">0 clean streak</span></div>
    <details class="live-standings" open><summary>Live standings · all opponents are CPUs</summary><ol id="race-standings"></ol></details>
    <section id="race-results" class="run-results" aria-labelledby="race-result-title" hidden><p class="eyebrow">RACE RESULT · SESSION ONLY</p><h2 id="race-result-title"></h2><p id="race-result-summary"></p><p id="race-coaching"></p><div class="race-table-wrap"><table><caption>Final standings. Later CPU outcomes are simulated from fixed schedules; they are not live players.</caption><thead><tr><th scope="col">Place</th><th scope="col">Driver</th><th scope="col">Time</th><th scope="col">Status</th></tr></thead><tbody id="race-result-rows"></tbody></table></div><p class="help">No XP, credits, stars, unlocks or personal records are saved. Modern cars, scenery, effects and audio are planned for the polish phase.</p></section>
  </section>`;
}

export function connectQuickRace(
  main: HTMLElement,
  session: QuickRaceSession,
  reducedMotion: () => boolean,
): () => void {
  const abort = new AbortController();
  const eventOptions = { signal: abort.signal };
  const find = <T extends HTMLElement = HTMLElement>(selector: string) =>
    main.querySelector<T>(selector)!;
  const input = find<HTMLTextAreaElement>("#race-input");
  const start = find<HTMLButtonElement>("#start-race");
  const pause = find<HTMLButtonElement>("#pause-race");
  const passage = find<HTMLSelectElement>("#race-passage-select");
  const tier = find<HTMLSelectElement>("#cpu-tier");
  const mode = find<HTMLSelectElement>("#race-mode");
  const seed = find<HTMLInputElement>("#race-seed");
  const track = find("#race-track");
  let adapter: RaceInputController;
  let disposeTrack: (() => void) | undefined;
  let generation = 0;
  let disposed = false;
  let trackReady = false;
  let loadTimeout: number | undefined;
  let lastState = "";
  const text = (selector: string, value: string) => {
    const el = find(selector);
    if (el.textContent !== value) el.textContent = value;
  };
  const notice = (message: string) => text("#race-notice", message);

  function update(): void {
    const { player: s, standings, results } = session.race.snapshot();
    const active = ["countdown", "racing", "paused"].includes(s.state);
    main.classList.toggle("quick-race-active", active);
    input.readOnly = !["countdown", "racing"].includes(s.state);
    input.setAttribute("aria-invalid", String(s.errorCharacter !== null));
    start.disabled = !trackReady || !["ready", "paused"].includes(s.state);
    start.textContent = s.state === "paused" ? "Resume race →" : "Start race →";
    pause.disabled = !["countdown", "racing"].includes(s.state);
    for (const field of [passage, tier, mode, seed]) field.disabled = active;
    const playerPlace = standings.find((row) => row.id === "player")!.place;
    text(
      "#race-state",
      s.state === "timed-out"
        ? "Time limit reached"
        : s.state.charAt(0).toUpperCase() + s.state.slice(1),
    );
    text(
      "#race-countdown",
      s.countdown !== null
        ? String(s.countdown)
        : s.state === "racing"
          ? "GO"
          : "—",
    );
    text(
      "#race-instruction",
      s.state === "paused"
        ? "Everyone is paused. Your text is safe."
        : results
          ? "Race ended. Results are frozen."
          : s.state === "racing"
            ? "Type to move. Backspace to correct."
            : s.state === "countdown"
              ? "Get ready. Type after GO."
              : "Start when ready. Four CPUs are waiting.",
    );
    text("#race-place", `${playerPlace}/5`);
    text("#race-wpm", s.wpm.toFixed(1));
    text(
      "#race-accuracy",
      s.accuracyPercent === null ? "—" : `${s.accuracyPercent.toFixed(1)}%`,
    );
    text("#race-time", `${(s.elapsedMs / 1000).toFixed(1)}s`);
    text(
      "#race-errors",
      `${s.errorCount} errors · ${s.correctedErrors} corrected`,
    );
    text(
      "#race-eligibility",
      s.practiceReasons.length
        ? `Practice only: ${s.practiceReasons.map((reason) => ({ paused: "paused", "blocked-assistance": "replacement or bulk input", "composed-input": "composed input", "uncertain-input": "uncertain input" })[reason]).join(", ")}`
        : "Direct input · session only · not saved",
    );
    text(
      "#race-streak",
      `${s.cleanStreak} clean streak · ${s.nitroBursts} nitro bursts`,
    );
    find(".quick-race").classList.toggle(
      "practice-panel--nitro",
      s.nitroActive,
    );
    main
      .querySelectorAll<HTMLElement>("#race-passage span")
      .forEach((el, i) => {
        el.className =
          i < s.validatedLength
            ? "character--correct"
            : i === s.validatedLength
              ? s.errorCharacter === null
                ? "character--current"
                : "character--error"
              : "";
      });
    // Fixed-size list, canonical text only; no per-keystroke reconstruction of the input.
    text("#race-standings", "");
    for (const row of standings) {
      const li = document.createElement("li");
      li.dataset.racer = row.id;
      li.dataset.progress = String(row.progress);
      li.textContent = `${row.place}. ${row.name}${row.cpu ? " · CPU" : ""} — ${Math.floor(row.progress * 100)}%${row.finishTimeMs !== null ? " · finished" : ""}`;
      find("#race-standings").append(li);
    }
    find("#race-results").hidden = results === null;
    if (results && s.state !== lastState) {
      const place = results.find((row) => row.id === "player")!.place;
      text(
        "#race-result-title",
        s.state === "finished"
          ? `Passage complete · place ${place} of 5`
          : s.state === "timed-out"
            ? "Time is up · unfinished"
            : "Race abandoned",
      );
      text(
        "#race-result-summary",
        `${s.wpm.toFixed(1)} WPM · ${s.accuracyPercent === null ? "No attempts" : `${s.accuracyPercent.toFixed(1)}% accuracy`} · ${(s.elapsedMs / 1000).toFixed(1)}s · ${Math.floor(s.progress * 100)}% complete.`,
      );
      text(
        "#race-coaching",
        s.accuracyPercent !== null && s.accuracyPercent < 95
          ? "Ease your pace slightly and build clean words first."
          : "Keep a steady rhythm. Try a longer passage when ready.",
      );
      const rows = find("#race-result-rows");
      rows.replaceChildren();
      for (const row of results) {
        const tr = document.createElement("tr");
        tr.dataset.racer = row.id;
        const status =
          row.status === "simulated"
            ? "Simulated after your finish"
            : row.status === "projected-dnf"
              ? "Simulated DNF · deadline"
              : row.status === "dnf"
                ? "DNF · time limit"
                : row.status === "stopped"
                  ? "Stopped"
                  : "Finished";
        for (const value of [
          row.finishTimeMs === null ? "—" : String(row.place),
          `${row.name}${row.cpu ? " · CPU" : ""}`,
          row.finishTimeMs === null
            ? "—"
            : `${(row.finishTimeMs / 1000).toFixed(2)}s`,
          status,
        ]) {
          const td = document.createElement("td");
          td.textContent = value;
          tr.append(td);
        }
        rows.append(tr);
      }
    }
    adapter?.sync();
    if (s.state !== lastState) {
      notice(
        s.state === "paused"
          ? "Paused. Resume when ready; this run is practice-only."
          : s.state === "countdown"
            ? "Get ready. Type after GO."
            : s.state === "racing"
              ? "GO. Match the passage; Backspace corrects mistakes."
              : results
                ? "Race ended. Your result is frozen; retry when ready."
                : "One mistake stops progress. Backspace corrects it.",
      );
      if (results) find("#race-results").scrollIntoView({ block: "nearest" });
    }
    lastState = s.state;
  }
  function bindInput(): void {
    adapter?.dispose();
    const target = find("#race-passage");
    target.replaceChildren();
    for (const char of session.race.snapshot().player.passage) {
      const span = document.createElement("span");
      span.textContent = char;
      target.append(span);
    }
    adapter = connectRaceInput(input, session.race.typing, update, notice);
    update();
  }
  function reset(newSeed = false): void {
    session.race.abandon();
    if (newSeed) session.seed = (session.seed + 1) >>> 0;
    seed.value = String(session.seed);
    session.race = buildRace(session);
    lastState = "";
    bindInput();
  }
  function graphicsFailed(): void {
    if (disposed) return;
    window.clearTimeout(loadTimeout);
    track.removeAttribute("data-ready");
    trackReady = false;
    session.race.pause();
    text(
      "#race-track-status",
      "Track unavailable. Retry artwork or explicitly continue with text standings.",
    );
    find("#retry-race-track").hidden = false;
    find("#text-race").hidden = false;
    update();
  }
  function mountTrack(): void {
    const token = ++generation;
    disposeTrack?.();
    disposeTrack = undefined;
    track.replaceChildren();
    track.removeAttribute("data-ready");
    trackReady = false;
    window.clearTimeout(loadTimeout);
    session.race.pause();
    update();
    text("#race-track-status", "Loading race track…");
    find("#retry-race-track").hidden = true;
    find("#text-race").hidden = true;
    loadTimeout = window.setTimeout(() => {
      if (token === generation) graphicsFailed();
    }, 12000);
    mountRaceTrack(track, {
      read: () => session.race.snapshot(),
      reducedMotion,
      onReady: () => {
        if (token !== generation || disposed) return;
        window.clearTimeout(loadTimeout);
        trackReady = true;
        find("#retry-race-track").hidden = true;
        find("#text-race").hidden = true;
        text(
          "#race-track-status",
          "Race track ready · positions from actual progress",
        );
        update();
      },
      onError: () => {
        if (token === generation) graphicsFailed();
      },
    })
      .then((dispose) => {
        if (token !== generation || disposed) dispose();
        else disposeTrack = dispose;
      })
      .catch(() => {
        if (token === generation) graphicsFailed();
      });
  }
  passage.value = String(session.passageIndex);
  tier.value = session.tier;
  mode.value = session.timed ? "timed" : "untimed";
  seed.value = String(session.seed);
  for (const field of [passage, tier, mode, seed])
    field.addEventListener(
      "change",
      () => {
        if (!seed.reportValidity()) return;
        session.passageIndex = Number(passage.value);
        session.tier = tier.value as CpuTier;
        session.timed = mode.value === "timed";
        session.seed = Number(seed.value);
        reset();
      },
      eventOptions,
    );
  start.addEventListener(
    "click",
    () => {
      if (!trackReady || !seed.reportValidity()) return;
      session.race.start();
      update();
      input.focus();
      input.scrollIntoView({ block: "nearest" });
    },
    eventOptions,
  );
  const pauseRace = () => {
    session.race.pause();
    update();
  };
  pause.addEventListener("click", pauseRace, eventOptions);
  find("#retry-race").addEventListener("click", () => reset(), eventOptions);
  find("#new-race").addEventListener("click", () => reset(true), eventOptions);
  find("#retry-race-track").addEventListener("click", mountTrack, eventOptions);
  find("#text-race").addEventListener(
    "click",
    () => {
      ++generation;
      window.clearTimeout(loadTimeout);
      disposeTrack?.();
      disposeTrack = undefined;
      track.replaceChildren();
      track.removeAttribute("data-ready");
      trackReady = true;
      text(
        "#race-track-status",
        "Text standings mode · same rules and CPU schedules",
      );
      find("#text-race").hidden = true;
      update();
    },
    eventOptions,
  );
  window.addEventListener("blur", pauseRace, eventOptions);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) pauseRace();
    },
    eventOptions,
  );
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && !event.repeat) {
        event.preventDefault();
        pauseRace();
      }
    },
    eventOptions,
  );
  bindInput();
  mountTrack();
  const interval = window.setInterval(update, 100);
  return () => {
    disposed = true;
    generation++;
    window.clearTimeout(loadTimeout);
    session.race.pause();
    adapter.dispose();
    disposeTrack?.();
    abort.abort();
    window.clearInterval(interval);
    main.classList.remove("quick-race-active");
  };
}
