import { followPassageCaret } from "./passage-scroll";
import type { CampaignLevel } from "../content/campaign";
import type { TypingSnapshot } from "../core/typing-engine";
import { trackChoices } from "./track-selector";
import { isTrackId, type TrackId } from "../content/track-catalog";
import { speedometer, updateSpeedometer } from "./speedometer";
import { animate } from "animejs";
import { RaceFeedback } from "../game/race-view";
import type { RaceAudio } from "../audio/race-audio";
import { isKartId, STARTER_KARTS, type KartId } from "../content/kart-catalog";
import { SoloRace } from "../core/solo-race";
import { CPU_TIERS, type CpuTier } from "../core/cpu-schedule";
import { PRACTICE_PASSAGES } from "../content/practice-passages";
import { connectRaceInput, type RaceInputController } from "./race-input";
import { mountRaceTrack } from "../game/race-track";

export interface QuickRaceSession {
  kartId?: KartId;
  trackId: TrackId;
  race: SoloRace;
  passageIndex: number;
  tier: CpuTier;
  seed: number;
  timed: boolean;
  campaign?: {
    level: CampaignLevel;
    finish: (result: TypingSnapshot) => string;
  };
}
function buildRace(session: Omit<QuickRaceSession, "race">): SoloRace {
  return new SoloRace({
    passage:
      session.campaign?.level.passage ??
      PRACTICE_PASSAGES[session.passageIndex].text,
    cpuBand: session.campaign?.level.cpuBand,
    tier: session.tier,
    seed: session.seed,
    now: () => performance.now(),
    ...(session.timed ? { timeLimitMs: 60000 } : {}),
  });
}
export function createQuickRaceSession(
  tier: CpuTier = "easy",
): QuickRaceSession {
  const setup = {
    trackId: "neon-harbor",
    passageIndex: 0,
    tier,
    seed: Math.floor(Math.random() * 0x100000000),
    timed: false,
  } as const;
  return { ...setup, race: buildRace(setup) };
}
export function createCampaignRaceSession(
  level: CampaignLevel,
  trackId: TrackId,
  finish: (result: TypingSnapshot) => string,
): QuickRaceSession {
  if (!level.passage)
    throw new RangeError("Campaign passage is not authored yet.");
  const setup = {
    trackId,
    passageIndex: 0,
    tier: level.tier,
    seed: level.seed,
    timed: false,
    campaign: { level, finish },
  };
  return { ...setup, race: buildRace(setup) };
}
/** Apply an explicit learning suggestion only to a ready setup; never replace a paused run. */
export function applyQuickRacePace(
  session: QuickRaceSession,
  tier: CpuTier,
): boolean {
  if (session.race.snapshot().player.state !== "ready") return false;
  session.tier = tier;
  session.race = buildRace(session);
  return true;
}
export function quickRaceScreen(
  selectedKart: KartId = "volt-kart",
  selectedTrack: TrackId = "neon-harbor",
  level?: CampaignLevel,
): string {
  return `<section class="quick-race immersive-race ${level ? "campaign-race" : ""}" aria-label="${level ? `${level.category} ${level.kind === "bonus" ? `bonus ${level.chapter}` : `level ${level.number}`}` : "Quick Race"}">
    <div class="race-visual"><p id="race-callout" class="race-callout" role="status" hidden></p><div id="race-track" role="img" aria-label="Five-lane race track; exact positions are listed below"></div></div>
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
<button id="pause-race" class="race-pause button button--secondary" disabled>Pause</button>    <div class="run-banner"><div><p id="race-state" class="eyebrow" role="status">Ready</p><p id="race-instruction">Wait for the track, then start the countdown.</p></div><span id="race-lights" class="race-lights" aria-hidden="true"><i></i><i></i><i></i></span><span id="race-countdown" class="countdown" aria-hidden="true">—</span></div>
<div class="race-console">${speedometer()}
    <label id="race-passage-label" class="sr-only">MATCH CASE, SPACES AND PUNCTUATION</label><div class="typing-surface"><p id="race-passage" class="race-passage" aria-labelledby="race-passage-label"></p>
    <label class="sr-only" for="race-input">Your typing</label><textarea id="race-input" rows="2" readonly autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="race-passage race-notice race-controls-help" placeholder="Start the race, then type after GO…"></textarea></div>
    <p id="race-notice" class="help" role="status">One mistake stops progress. Backspace corrects it.</p>
</div><section class="race-deck" aria-label="Race setup and controls"><h1 class="race-deck-title">${level ? `${level.category.toUpperCase()} · ${level.kind === "bonus" ? `BONUS ${level.chapter}` : `LEVEL ${level.number}`}` : "Quick <span>Race.</span>"}</h1>${level ? `<p class="campaign-race-help help">Untimed · Finish unpaused to clear. ${level.kind === "bonus" ? "Optional bonus: no main-level or reward unlocks. " : ""}Stars: completion / ${level.accuracyGoal}% accuracy / ${level.paceGoal} WPM. Pause or assisted input makes this practice-only.</p>` : ""}<div class="track-bottom"><span id="race-track-status" role="status">Loading race track…</span><button id="retry-race-track" class="text-button" hidden>Retry artwork</button><button id="text-race" class="text-button" hidden>Race with text standings</button></div>
    <section id="race-results" class="run-results" aria-labelledby="race-result-title" hidden>
      <p id="race-result-label" class="eyebrow">${level ? "CAMPAIGN RESULT" : "SESSION RESULT · NOT SAVED"}</p>
      <div class="result-heading"><h2 id="race-result-title"></h2><strong id="race-result-place"></strong></div>
      <dl id="race-result-summary" class="result-metrics"><div><dt>Average WPM</dt><dd id="race-result-wpm"></dd></div><div><dt>Accuracy</dt><dd id="race-result-accuracy"></dd></div><div><dt>Time</dt><dd id="race-result-time"></dd></div></dl>
      <p id="campaign-result-status" role="status" ${level ? "" : "hidden"}></p><p id="race-result-progress" hidden></p>
      <details id="race-result-details" open><summary>Final standings</summary><div class="race-table-wrap"><table><caption>CPU opponents · later finishes are simulated.</caption><thead><tr><th scope="col">Place</th><th scope="col">Driver</th><th scope="col">Time</th><th scope="col">Status</th></tr></thead><tbody id="race-result-rows"></tbody></table></div></details>
    </section>    <div class="race-setup practice-options">
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
      <details class="race-advanced"><summary>Advanced / Replay</summary><label for="race-seed">Race seed</label><input id="race-seed" type="number" min="0" max="4294967295" step="1" inputmode="numeric" required aria-describedby="setup-help" /><p id="setup-help" class="help">The same passage, pace and seed reproduce CPU schedules. Your own typing is always live. A seed is chosen automatically for normal play.</p></details>
    </div>
    <p class="help race-setup">A standalone race for warm-ups and trying cars or tracks. Choose a passage and CPU pace; it does not change campaign progress. Results stay in this session.</p>
    <div class="race-setup">${trackChoices(selectedTrack, "race-track-select")}</div>
    <fieldset id="kart-picker" class="kart-picker"><legend>Choose your car</legend><div class="kart-picker__grid">${STARTER_KARTS.map((kart) => `<label class="kart-choice"><input type="radio" name="player-kart" value="${kart.id}" ${kart.id === selectedKart ? "checked" : ""} /><img class="${kart.id === "volt-kart" ? "kart-art--starter" : ""}" src="${import.meta.env.BASE_URL}assets/karts/${kart.file}" alt="" width="200" height="100" /><strong>${kart.name}</strong><span>${kart.style}</span></label>`).join("")}</div><p id="kart-save-status" class="help" role="status">Choose before starting. Your car stays locked through pauses until retry. All cars have the same performance.</p></fieldset>
    <div class="practice-actions"><button id="start-race" class="button button--primary" disabled>Start race →</button><button id="retry-race" class="text-button">Retry same race</button><button id="new-race" class="text-button" ${level ? "hidden" : ""}>New race</button>${level && level.kind === "main" && level.number < 100 ? `<a id="campaign-next" class="button button--secondary" href="#/level/${level.category}/${level.number + 1}" hidden>Next level →</a>` : ""}${level ? `<a class="campaign-race-back button button--secondary" href="#/campaign/${level.category}">← Return to map</a>` : ""}</div>
    <p id="race-controls-help" class="help">Esc or leaving this screen pauses everyone. Resume has a fresh countdown. Retry resets the run; refresh discards this unsaved session.</p>
    <div class="run-details"><span id="race-errors">0 errors · 0 corrected</span><span id="race-eligibility">Session only · not saved</span><span id="race-streak">0 clean streak</span></div>
    <details class="live-standings" open><summary>Live standings · all opponents are CPUs</summary><ol id="race-standings"></ol></details>
</section></section>`;
}

export function connectQuickRace(
  main: HTMLElement,
  session: QuickRaceSession,
  reducedMotion: () => boolean,
  effects: () => "high" | "low",
  audio: RaceAudio,
  garage: { read: () => KartId; choose: (id: KartId) => boolean },
  tracks: { read: () => TrackId; choose: (id: TrackId) => boolean },
  takePendingPace?: () => CpuTier | undefined,
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
  const trackSelect = find<HTMLSelectElement>("#race-track-select");
  if (session.race.snapshot().player.state === "ready") {
    session.trackId = tracks.read();
    session.kartId = garage.read();
  }
  trackSelect.value = session.trackId;
  const feedback = new RaceFeedback();
  const kartPicker = find<HTMLFieldSetElement>("#kart-picker");
  let calloutAnimation: ReturnType<typeof animate> | undefined;
  let calloutUntil = 0;
  let revealResults: number | undefined;
  let adapter: RaceInputController;
  let disposeTrack: (() => void) | undefined;
  let generation = 0;
  let disposed = false;
  let trackReady = false;
  let loadTimeout: number | undefined;
  let lastState = "";
  const standingsRows = new Map<string, HTMLLIElement>();
  let passageSpans: HTMLSpanElement[] = [];
  let renderedLength = 0;
  const text = (selector: string, value: string) => {
    const el = find(selector);
    if (el.textContent !== value) el.textContent = value;
  };
  const notice = (message: string) => text("#race-notice", message);

  function update(): void {
    const snapshot = session.race.snapshot();
    const { player: s, standings, results } = snapshot;
    audio.updateRace(s);
    find("#race-lights").dataset.state = s.state;
    find("#race-lights").dataset.countdown = String(s.countdown ?? 0);
    const message = feedback.update(snapshot);
    const callout = find("#race-callout");
    if (message) {
      calloutAnimation?.revert();
      callout.hidden = false;
      callout.textContent = message;
      calloutUntil = s.elapsedMs + 1600;
      if (!message.startsWith("CLEAN")) audio.cue("overtake");
      if (!reducedMotion())
        calloutAnimation = animate(callout, {
          opacity: [0, 1, 1, 0],
          y: [6, 0, 0, -5],
          duration: 1600,
          ease: "out(3)",
        });
    }
    if (s.elapsedMs >= calloutUntil || s.state !== "racing") {
      calloutAnimation?.revert();
      callout.hidden = true;
    }
    find(".immersive-race").dataset.state = s.state;
    updateSpeedometer(main, s.recentWpm, s.state === "racing");
    const active = ["countdown", "racing", "paused"].includes(s.state);
    kartPicker.disabled = s.state !== "ready";
    trackSelect.disabled = s.state !== "ready";
    main.classList.toggle("quick-race-active", active);
    input.readOnly = !["countdown", "racing"].includes(s.state);
    input.setAttribute("aria-invalid", String(s.errorCharacter !== null));
    start.disabled = !trackReady || !["ready", "paused"].includes(s.state);
    start.textContent = s.state === "paused" ? "Resume race →" : "Start race →";
    pause.disabled = !["countdown", "racing"].includes(s.state);
    for (const field of [passage, tier, mode, seed])
      field.disabled = active || !!session.campaign;
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
        : session.campaign
          ? "Direct input · eligible for campaign progress"
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
    // Only the changed prefix boundary needs repainting, even in long paragraphs.
    const from = Math.min(renderedLength, s.validatedLength);
    const to = Math.min(
      passageSpans.length - 1,
      Math.max(renderedLength, s.validatedLength),
    );
    for (let i = from; i <= to; i++) {
      const el = passageSpans[i];
      const className =
        i < s.validatedLength
          ? "character--correct"
          : i === s.validatedLength
            ? s.errorCharacter === null
              ? "character--current"
              : "character--error"
            : "";
      if (el.className !== className) el.className = className;
    }
    renderedLength = s.validatedLength;
    const passageView = find("#race-passage");
    followPassageCaret(
      passageView,
      passageSpans[Math.min(s.validatedLength, passageSpans.length - 1)],
      document.documentElement.dataset.textSize === "large",
    );
    // Keep the five nodes alive; update only changed content/order at the HUD cadence.
    const standingsList = find("#race-standings");
    standings.forEach((row, index) => {
      let li = standingsRows.get(row.id);
      if (!li) {
        li = document.createElement("li");
        li.dataset.racer = row.id;
        standingsRows.set(row.id, li);
      }
      const progress = String(row.progress);
      if (li.dataset.progress !== progress) li.dataset.progress = progress;
      const value = `${row.place}. ${row.name}${row.cpu ? " · CPU" : ""} — ${Math.floor(row.progress * 100)}%${row.finishTimeMs !== null ? " · finished" : ""}`;
      if (li.textContent !== value) li.textContent = value;
      if (standingsList.children[index] !== li)
        standingsList.insertBefore(li, standingsList.children[index] ?? null);
    });
    find("#race-results").hidden = results === null;
    if (results && s.state !== lastState) {
      if (session.campaign) {
        text(
          "#campaign-result-status",
          s.state === "finished"
            ? session.campaign.finish(s)
            : "Unfinished run. No campaign progress earned.",
        );
        const next = main.querySelector<HTMLElement>("#campaign-next");
        if (next)
          next.hidden =
            s.state !== "finished" ||
            !s.eligible ||
            s.practiceReasons.length > 0;
      }
      const place = results.find((row) => row.id === "player")!.place;
      text(
        "#race-result-title",
        s.state === "finished"
          ? "Race complete"
          : s.state === "timed-out"
            ? "Time is up · unfinished"
            : "Race abandoned",
      );
      text(
        "#race-result-place",
        s.state === "finished" ? `${place} / 5` : "DNF",
      );
      find("#race-result-place").setAttribute(
        "aria-label",
        s.state === "finished" ? `Place ${place} of 5` : "Did not finish",
      );
      text("#race-result-wpm", s.wpm.toFixed(1));
      text(
        "#race-result-accuracy",
        s.accuracyPercent === null ? "—" : `${s.accuracyPercent.toFixed(1)}%`,
      );
      text("#race-result-time", `${(s.elapsedMs / 1000).toFixed(1)}s`);
      text(
        "#race-result-progress",
        `${Math.floor(s.progress * 100)}% of passage completed`,
      );
      find("#race-result-progress").hidden = s.state === "finished";
      find<HTMLDetailsElement>("#race-result-details").open = true;
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
      if (results) {
        window.clearTimeout(revealResults);
        revealResults = window.setTimeout(
          () => {
            if (!disposed)
              find("#race-result-title").setAttribute("tabindex", "-1");
          },
          reducedMotion() ? 0 : 1000,
        );
      }
    }
    lastState = s.state;
  }
  function bindInput(): void {
    adapter?.dispose();
    const target = find("#race-passage");
    target.replaceChildren();
    passageSpans = [];
    renderedLength = 0;
    for (const char of session.race.snapshot().player.passage) {
      const span = document.createElement("span");
      span.textContent = char;
      target.append(span);
      passageSpans.push(span);
    }
    adapter = connectRaceInput(input, session.race.typing, update, notice);
    update();
  }
  function reset(newSeed = false): void {
    window.clearTimeout(revealResults);
    calloutAnimation?.revert();
    session.race.abandon();
    if (newSeed) session.seed = (session.seed + 1) >>> 0;
    seed.value = String(session.seed);
    const pendingPace = session.campaign ? undefined : takePendingPace?.();
    if (pendingPace) {
      session.tier = pendingPace;
      tier.value = pendingPace;
    }
    session.trackId = tracks.read();
    session.kartId = garage.read();
    main
      .querySelectorAll<HTMLInputElement>('input[name="player-kart"]')
      .forEach((input) => {
        input.checked = input.value === session.kartId;
      });
    trackSelect.value = session.trackId;
    session.race = buildRace(session);
    lastState = "";
    main
      .querySelector<HTMLElement>("#campaign-next")
      ?.setAttribute("hidden", "");
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
      effects,
      playerKart: () => session.kartId ?? garage.read(),
      track: () => session.trackId,
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
        if (session.campaign || !seed.reportValidity()) return;
        session.passageIndex = Number(passage.value);
        session.tier = tier.value as CpuTier;
        session.timed = mode.value === "timed";
        session.seed = Number(seed.value);
        reset();
      },
      eventOptions,
    );
  trackSelect.addEventListener(
    "change",
    () => {
      if (
        session.race.snapshot().player.state !== "ready" ||
        !isTrackId(trackSelect.value)
      ) {
        trackSelect.value = session.trackId;
        return;
      }
      session.trackId = trackSelect.value;
      const saved = tracks.choose(session.trackId);
      text(
        "#track-choice-status",
        saved
          ? "Track saved on this browser. Scenery only."
          : "Track applied for this visit; browser storage is unavailable.",
      );
      update();
    },
    eventOptions,
  );
  kartPicker.addEventListener(
    "change",
    (event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement) ||
        !isKartId(target.value) ||
        session.race.snapshot().player.state !== "ready"
      )
        return;
      session.kartId = target.value;
      const saved = garage.choose(target.value);
      const name = STARTER_KARTS.find((kart) => kart.id === target.value)!.name;
      text(
        "#kart-save-status",
        `${name} selected. ${saved ? "Saved on this browser." : "Applied for this visit; browser storage is unavailable."} Cosmetic only; race progress is unchanged.`,
      );
    },
    eventOptions,
  );
  start.addEventListener(
    "click",
    () => {
      if (!trackReady || !seed.reportValidity()) return;
      void audio.unlock();
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
  if (session.campaign)
    text(
      "#race-controls-help",
      "Esc or leaving pauses everyone and makes this run practice-only. Retry for an eligible clear. Refresh discards the current run; previously saved clears stay safe.",
    );
  bindInput();
  mountTrack();
  const interval = window.setInterval(update, 100);
  return () => {
    disposed = true;
    window.clearTimeout(revealResults);
    calloutAnimation?.revert();
    audio.setScene("silent");
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
