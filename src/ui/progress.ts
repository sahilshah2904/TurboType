import { CAR_REWARDS, TRACK_REWARDS } from "../content/collection";
import { CATEGORY_NAMES, isCategory } from "../content/campaign";
import {
  economy,
  SAVE_LIMIT,
  parseGuestSave,
  type GuestSave,
  type RunSummary,
} from "../core/progression";
import type { LocalGuestRepository } from "../storage/guest";
import type { CloudStatus } from "../storage/cloud";

const AWARD_LABELS: Record<string, string> = {
  clear: "First clear",
  pit: "Pit stop",
  chapter: "Chapter trophy",
  cache: "Star cache",
  perfect: "Perfect lap",
  bonus: "Bonus challenge",
  finale: "Category finale",
  recovery: "Recovery badge",
};

export function rewardMessage(
  result: ReturnType<LocalGuestRepository["finish"]>,
) {
  if (
    !result.xp &&
    !result.credits &&
    !result.awards.length &&
    !result.unlocks.length
  )
    return "";
  const names = [...CAR_REWARDS, ...TRACK_REWARDS]
    .filter(({ id }) => result.unlocks.includes(id))
    .map(({ name }) => name);
  const awards = result.awards.map((id) => AWARD_LABELS[id.split(":")[0]]);
  const changes = [
    `+${result.xp} XP · +${result.credits} credits`,
    ...awards,
    ...names.map((name) => `Unlocked ${name}`),
  ];
  return `${changes.join(" · ")}.${result.saved ? "" : " Visit only. Retry or export your save in Progress."}`;
}

function accuracy(run: RunSummary) {
  return run.attempts ? (run.correct / run.attempts) * 100 : 0;
}

function eventLabel(event: string): string {
  const [category, number, detail, mode] = event.split("-");
  if (isCategory(category))
    return `${CATEGORY_NAMES[category]} · ${number === "bonus" ? `Chapter ${Number(detail)} bonus` : `Level ${Number(number)}`}`;
  if (category === "quick" && isCategory(detail))
    return `Quick Race · ${CATEGORY_NAMES[detail]}${mode === "timed" ? " · Timed" : ""}`;
  return "Race";
}

function raceTime(elapsedMs: number): string {
  if (elapsedMs < 60_000) return `${(elapsedMs / 1000).toFixed(1)} s`;
  const seconds = Math.round(elapsedMs / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function outcome(run: RunSummary): string {
  const label = run.eligible ? "Eligible" : run.finished ? "Practice" : "DNF";
  return `<span class="progress-race-status" data-outcome="${label}">${label}</span>`;
}

function renderRaceTable(runs: RunSummary[]): string {
  return `<div class="race-table-wrap progress-race-table"><table><thead><tr><th scope="col">Event</th><th scope="col">WPM</th><th scope="col">Accuracy</th><th scope="col">Time</th><th scope="col">Result</th></tr></thead><tbody>${runs.map((run) => `<tr><th scope="row">${eventLabel(run.event)}</th><td>${run.wpm.toFixed(1)}</td><td>${accuracy(run).toFixed(1)}%</td><td>${raceTime(run.elapsedMs)}</td><td>${outcome(run)}</td></tr>`).join("")}</tbody></table></div>`;
}

function paceRows(entries: { label: string; wpm: number }[]): string {
  const peak = Math.max(1, ...entries.map(({ wpm }) => wpm));
  return `<ol class="progress-pace" role="list">${entries.map(({ label, wpm }) => `<li><span>${label}</span><meter min="0" max="${peak}" value="${wpm}" aria-label="${label}, ${wpm.toFixed(1)} words per minute"></meter><strong>${wpm.toFixed(1)} <span>WPM</span></strong></li>`).join("")}</ol>`;
}

function latestRace(run: RunSummary): string {
  const metrics = [
    ["Speed", `${run.wpm.toFixed(1)} WPM`],
    ["Accuracy", `${accuracy(run).toFixed(1)}%`],
    ["Time", raceTime(run.elapsedMs)],
  ];
  return `<section class="progress-latest-race" aria-labelledby="progress-latest-title">
    <div class="progress-latest-heading"><div><p class="eyebrow">Latest race</p><h3 id="progress-latest-title">${eventLabel(run.event)}</h3></div>${outcome(run)}</div>
    <dl class="progress-metrics">${metrics.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
    </section>`;
}

export function progressScreen(
  save: GuestSave,
  status: string,
  cloudReady: boolean,
) {
  const stats = economy(save);
  const recent = save.history.slice(0, 10);
  const completed = recent.filter(({ finished }) => finished);
  const coaching =
    completed.length < 3
      ? "Finish three races to get a suggestion based on your recent attempts."
      : completed.reduce((sum, run) => sum + accuracy(run), 0) /
            completed.length <
          95
        ? "Recent accuracy averaged below 95%. Try the correction drill and slow down after an error."
        : "Recent accuracy averaged at least 95%. Try the consistency drill and aim for an even pace.";
  const latest = completed[0];
  const characters = Object.entries(save.characters)
    .filter(([, sample]) => sample.attempts >= 5)
    .sort(([, a], [, b]) => b.errors / b.attempts - a.errors / a.attempts)
    .slice(0, 12);
  const keyLabel = (key: string) =>
    key === " "
      ? "Space"
      : key.replace(
          /[&<>]/g,
          (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]!,
        );
  const records = Object.values(save.records).sort((a, b) => b.at - a.at);
  const awardCount = stats.awards.length + Number(save.recoveryBadge);
  return `<section class="page-heading"><p class="eyebrow">YOUR DRIVER</p><h1>Driver <span>progress.</span></h1><p>Rank ${stats.rank} · ${stats.xp} XP · ${stats.credits} credits${save.recoveryBadge ? " · Recovery badge" : ""}</p></section>
    <section class="settings-panel driver-progress" aria-label="Driver progress details">
    <div class="progress-section"><h2>Save progress</h2><p id="cloud-status" role="status">${cloudReady ? "Checking sign-in…" : "Guest progress is saved in this browser."}</p>
    <div id="cloud-actions" class="practice-actions" hidden><button type="button" data-cloud="signIn" class="button button--primary" hidden>Sign in with Google</button><button type="button" data-cloud="retry" data-primary-check class="button button--secondary" hidden>Check cloud access</button><button type="button" data-cloud="signOut" class="text-button" hidden>Sign out</button><button type="button" data-cloud="useLocal" class="button button--secondary" hidden>Keep this device’s copy</button><button type="button" data-cloud="useRemote" class="button button--secondary" hidden>Use cloud copy</button></div>
    <p id="google-sign-in-note" class="help" hidden>Google shares your email and basic profile to identify your save. Guest play is always available.</p></div>
    <div class="progress-section"><h2>Practice next</h2><p>${coaching}</p><a class="button button--secondary" href="#/practice">Open practice drills</a></div>
    ${
      recent.length || awardCount || records.length
        ? `<details class="progress-section"><summary>Race stats and awards</summary>
    ${recent.length ? latestRace(recent[0]) : ""}
    ${recent.length > 1 ? `<h3>Recent race pace</h3><p class="help">Newest first. Pace varies by passage and mode.</p>${paceRows(recent.slice(0, 5).map((run) => ({ label: eventLabel(run.event), wpm: run.wpm })))}` : ""}
    ${recent.length ? `<details><summary>Recent history (${recent.length})</summary>${renderRaceTable(recent)}</details>` : ""}
    ${records.length ? `<details><summary>Comparable bests (${records.length})</summary><p class="help">Fastest eligible finish per passage and mode under this rules and content version.</p>${renderRaceTable(records)}</details>` : ""}
    ${latest?.pace.length ? `<details><summary>Pace through latest finish</summary><p class="help">WPM by passage segment, in order.</p>${paceRows(latest.pace.map((wpm, index) => ({ label: `Segment ${index + 1}`, wpm })))}</details>` : ""}
    ${
      awardCount
        ? `<details><summary>Milestone awards (${awardCount})</summary>
    <ul>${save.recoveryBadge ? "<li>Recovery badge · corrected an error and reached a 20-character streak</li>" : ""}${stats.awards
      .map(({ id, xp, credits }) => {
        const [kind, event, threshold] = id.split(":");
        const label = isCategory(event)
          ? CATEGORY_NAMES[event]
          : eventLabel(event);
        return `<li>${AWARD_LABELS[kind]} · ${label}${threshold ? ` · ${threshold} stars` : ""} · ${xp} XP · ${credits} credits</li>`;
      })
      .join("")}</ul></details>`
        : ""
    }
    ${characters.length ? `<details><summary>Key accuracy and timing</summary><p>Based on eligible races. Keys with fewer than five attempts are hidden. Timing measures the interval between successful inputs.</p><ul>${characters.map(([key, sample]) => `<li>${keyLabel(key)} · ${sample.errors} errors in ${sample.attempts} attempts${sample.timingCount >= 5 ? ` · ${Math.round(sample.timingMs / sample.timingCount)} ms average` : ""}</li>`).join("")}</ul></details>` : ""}</details>`
        : ""
    }
    <details id="progress-save-tools" class="progress-section"><summary>Save and backup tools</summary><p id="guest-status" role="status">${status}</p>
    <div class="practice-actions"><button id="guest-export" class="button button--secondary">Export current save</button><button id="guest-export-original" class="text-button">Export recovery data</button><button id="guest-retry" class="text-button">Retry save</button>${cloudReady ? "" : '<button id="guest-reset" class="text-button">Reset guest progress</button>'}</div>
    <p><label for="guest-import">Import a backup to replace this local save</label> <input id="guest-import" type="file" accept=".json,application/json"></p>
    <div id="cloud-tools" class="practice-actions" hidden><button type="button" data-cloud="importGuest" class="text-button" hidden>Import guest progress</button><button type="button" data-cloud="retry" class="text-button" hidden>Check cloud sync</button><button type="button" data-cloud="removeSave" class="text-button" hidden>Delete cloud save</button></div>
    </details>
    <dialog id="guest-confirm"><h2>Replace your local save?</h2><p id="guest-preview"></p><button id="guest-replace" class="button button--primary">Replace save</button><form method="dialog"><button class="text-button">Cancel</button></form></dialog>
    </section>`;
}

export function updateCloudProgress(main: HTMLElement, cloud: CloudStatus) {
  const status = main.querySelector("#cloud-status");
  if (!status) return;
  status.textContent = cloud.message;
  const { signedIn, approved, conflict, needsCheck } = cloud;
  const note = main.querySelector<HTMLElement>("#google-sign-in-note")!;
  note.hidden = signedIn;
  for (const button of main.querySelectorAll<HTMLButtonElement>(
    "[data-cloud]",
  )) {
    const action = button.dataset.cloud;
    const visible =
      action === "signIn"
        ? !signedIn
        : action === "signOut" || action === "removeSave"
          ? signedIn
          : action === "importGuest"
            ? approved && !conflict
            : action === "retry"
              ? signedIn &&
                (button.hasAttribute("data-primary-check")
                  ? needsCheck
                  : approved && !needsCheck)
              : approved && conflict;
    button.hidden = !visible;
  }
  for (const group of main.querySelectorAll<HTMLElement>(
    "#cloud-actions, #cloud-tools",
  ))
    group.hidden = !group.querySelector("button:not([hidden])");
}

export function connectProgress(
  main: HTMLElement,
  repository: LocalGuestRepository,
  refresh: () => void,
) {
  const controller = new AbortController();
  const signal = controller.signal;
  const find = <T extends HTMLElement = HTMLElement>(selector: string) =>
    main.querySelector<T>(selector)!;
  const status = find("#guest-status");
  const dialog = find<HTMLDialogElement>("#guest-confirm");
  const file = find<HTMLInputElement>("#guest-import");
  let pending: string | undefined;
  const download = (raw: string, name: string) => {
    const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  find("#guest-export").addEventListener(
    "click",
    () => download(repository.exportCurrent(), "turbotype-save.json"),
    { signal },
  );
  find("#guest-export-original").addEventListener(
    "click",
    () => download(repository.exportRaw(), "turbotype-recovery.json"),
    { signal },
  );
  find("#guest-retry").addEventListener(
    "click",
    () => {
      status.textContent = repository.retry()
        ? "Save written."
        : repository.status;
    },
    { signal },
  );
  main.querySelector("#guest-reset")?.addEventListener(
    "click",
    () => {
      if (
        window.confirm(
          "Reset this browser’s guest progress? A recovery copy will be kept.",
        )
      ) {
        if (repository.reset()) refresh();
        else status.textContent = repository.status;
      }
    },
    { signal },
  );
  file.addEventListener(
    "change",
    async () => {
      pending = undefined;
      const selected = file.files?.[0];
      file.value = "";
      if (!selected || selected.size > SAVE_LIMIT) {
        status.textContent = "Choose a TurboType backup under 1 MiB.";
        return;
      }
      try {
        const raw = await selected.text();
        if (signal.aborted) return;
        const save = parseGuestSave(raw);
        if (!save) throw new Error("Invalid backup");
        pending = raw;
        find("#guest-preview").textContent =
          `This backup contains ${Object.keys(save.campaign.clears).length} main clears and ${economy(save).xp} XP. Import replaces your current progress rather than combining it.`;
        dialog.showModal();
      } catch {
        status.textContent =
          "Backup format or version is invalid. Current progress is preserved.";
      }
    },
    { signal },
  );
  find("#guest-replace").addEventListener(
    "click",
    () => {
      const raw = pending;
      pending = undefined;
      dialog.close();
      if (raw && repository.replace(raw)) refresh();
      else status.textContent = repository.status;
    },
    { signal },
  );
  return () => controller.abort();
}
