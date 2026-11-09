import { CAR_REWARDS, TRACK_REWARDS } from "../content/collection";
import {
  economy,
  SAVE_LIMIT,
  parseGuestSave,
  type GuestSave,
  type RunSummary,
} from "../core/progression";
import type { LocalGuestRepository } from "../storage/guest";

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
  const peak = Math.max(1, ...recent.map(({ wpm }) => wpm));
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
  const display = (run: RunSummary) =>
    `<tr><td>${run.event}</td><td>${run.wpm.toFixed(1)}</td><td>${accuracy(run).toFixed(1)}%</td><td>${(run.elapsedMs / 1000).toFixed(1)}s</td><td>${run.eligible ? "Eligible" : run.finished ? "Practice" : "DNF"}</td></tr>`;
  return `<section class="page-heading"><p class="eyebrow">YOUR DRIVER</p><h1>Driver <span>progress.</span></h1><p>Rank ${stats.rank} · ${stats.xp} XP · ${stats.credits} credits${save.recoveryBadge ? " · Recovery badge" : ""}</p></section>
    <section class="settings-panel"><h2>Cloud progress</h2><p id="cloud-status" role="status">${cloudReady ? "Checking sign-in…" : "Cloud sync is available when a Supabase project is configured on a secure address. Local play is available here."}</p>
    <div id="cloud-actions" class="practice-actions" hidden><button type="button" data-cloud="signIn" class="button button--primary">Sign in with Google</button><button type="button" data-cloud="signOut" class="text-button" hidden>Sign out</button><button type="button" data-cloud="importGuest" class="text-button" hidden>Import guest progress</button><button type="button" data-cloud="retry" class="text-button" hidden>Check cloud sync</button><button type="button" data-cloud="useLocal" class="text-button" hidden>Keep this device’s copy</button><button type="button" data-cloud="useRemote" class="text-button" hidden>Use cloud copy</button><button type="button" data-cloud="removeSave" class="text-button" hidden>Delete cloud save</button></div>
    <h2>Coaching</h2><p>${coaching}</p><a class="button button--secondary" href="#/practice">Open practice drills</a>
    <details><summary>Milestone awards (${stats.awards.length + Number(save.recoveryBadge)})</summary>
    <ul>${save.recoveryBadge ? "<li>Recovery badge · corrected an error and reached a 20-character streak</li>" : ""}${stats.awards
      .map(({ id, xp, credits }) => {
        const [kind, event, threshold] = id.split(":");
        return `<li>${AWARD_LABELS[kind]} · ${event}${threshold ? ` · ${threshold} stars` : ""} · ${xp} XP · ${credits} credits</li>`;
      })
      .join("")}</ul></details>
    <h2>Recent race pace</h2><p>Last ${recent.length} races, newest first. Different passages and modes can have different pace.</p>
    <ol>${recent.map((run) => `<li><meter min="0" max="${peak}" value="${run.wpm}" aria-label="${run.wpm.toFixed(1)} words per minute"></meter> ${run.wpm.toFixed(1)} WPM</li>`).join("")}</ol>
    ${latest?.pace.length ? `<details><summary>Pace through latest finish</summary><p>WPM by equal passage segment, in order.</p><ol>${latest.pace.map((wpm) => `<li><meter min="0" max="${Math.max(1, ...latest.pace)}" value="${wpm}"></meter> ${wpm.toFixed(1)} WPM</li>`).join("")}</ol></details>` : ""}
    <details><summary>Recent history (${recent.length})</summary><div class="race-table-wrap"><table><thead><tr><th>Event</th><th>WPM</th><th>Accuracy</th><th>Time</th><th>Result</th></tr></thead><tbody>${recent.map(display).join("")}</tbody></table></div></details>
    <details><summary>Comparable bests (${records.length})</summary><p>Fastest eligible finish per passage and mode under this rules and content version.</p><div class="race-table-wrap"><table><thead><tr><th>Event</th><th>WPM</th><th>Accuracy</th><th>Time</th><th>Result</th></tr></thead><tbody>${records.map(display).join("")}</tbody></table></div></details>
    <details><summary>Key accuracy and timing</summary><p>Based on eligible races. Keys with fewer than five attempts are hidden. Timing measures the interval between successful inputs.</p><ul>${characters.map(([key, sample]) => `<li>${keyLabel(key)} · ${sample.errors} errors in ${sample.attempts} attempts${sample.timingCount >= 5 ? ` · ${Math.round(sample.timingMs / sample.timingCount)} ms average` : ""}</li>`).join("")}</ul></details>
    <h2>Local save and recovery</h2><p id="guest-status" role="status">${status}</p>
    <div class="practice-actions"><button id="guest-export" class="button button--secondary">Export current save</button><button id="guest-export-original" class="text-button">Export recovery data</button><button id="guest-retry" class="text-button">Retry save</button>${cloudReady ? "" : '<button id="guest-reset" class="text-button">Reset guest progress</button>'}</div>
    <p><label for="guest-import">Import a backup to replace this local save</label> <input id="guest-import" type="file" accept=".json,application/json"></p>
    <dialog id="guest-confirm"><h2>Replace your local save?</h2><p id="guest-preview"></p><button id="guest-replace" class="button button--primary">Replace save</button><form method="dialog"><button class="text-button">Cancel</button></form></dialog>
    </section>`;
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
