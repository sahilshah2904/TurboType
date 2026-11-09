import { type CampaignLevel, type Category } from "../content/campaign";
import {
  recordCampaignFinish,
  validateCampaign,
} from "../core/campaign-progress";
import {
  economy,
  HISTORY_LIMIT,
  newGuestSave,
  ordinaryReward,
  ownedEquipment,
  parseGuestSave,
  type GuestSave,
  type RunSummary,
} from "../core/progression";
import type { CharacterSample, TypingSnapshot } from "../core/typing-engine";
import { CAMPAIGN_STORAGE_KEY, LEGACY_CAMPAIGN_STORAGE_KEY } from "./campaign";

export const GUEST_KEY = "turbotype:guest:v1";
const RECOVERY_KEY = "turbotype:guest:recovery";
type StorageAccess = Pick<Storage, "getItem" | "setItem">;

export class LocalGuestRepository {
  private value = newGuestSave();
  private baseline: string | null = null;
  private blocked = false;
  private dirty = false;
  private unusable: string | null = null;
  private writerAvailable = true;
  private releaseWriter?: () => void;
  private readonly lockRequest = new AbortController();
  status = "Progress saves on this browser.";

  constructor(
    private readonly storage: () => StorageAccess,
    private readonly onWrite?: () => void,
    writerKey?: string,
    onWriterChange?: () => void,
  ) {
    if (writerKey && typeof navigator !== "undefined" && navigator.locks) {
      this.writerAvailable = false;
      void navigator.locks
        .request(writerKey, { signal: this.lockRequest.signal }, () => {
          if (this.lockRequest.signal.aborted) return;
          this.writerAvailable = true;
          this.reload();
          onWriterChange?.();
          return new Promise<void>((resolve) => {
            this.releaseWriter = resolve;
          });
        })
        .catch(() => {
          if (!this.lockRequest.signal.aborted) {
            this.writerAvailable = true;
            this.reload();
            onWriterChange?.();
          }
        });
    }
    this.reload();
  }

  close(): void {
    this.lockRequest.abort();
    this.releaseWriter?.();
  }

  read() {
    return structuredClone(this.value.campaign);
  }

  snapshot() {
    return structuredClone(this.value);
  }

  reload(): void {
    if (this.dirty) return;
    try {
      const store = this.storage();
      const raw = store.getItem(GUEST_KEY);
      this.baseline = raw;
      this.unusable = raw;
      let save: GuestSave;
      if (raw !== null) {
        const current = parseGuestSave(raw);
        if (!current) throw new Error("invalid guest save");
        save = current;
      } else {
        const v2 = store.getItem(CAMPAIGN_STORAGE_KEY);
        const legacy = v2 ?? store.getItem(LEGACY_CAMPAIGN_STORAGE_KEY);
        this.unusable = legacy;
        const campaign =
          legacy === null
            ? undefined
            : validateCampaign(JSON.parse(legacy), v2 === null);
        if (campaign === null) throw new Error("invalid map save");
        save = newGuestSave(campaign);
      }
      this.value = save;
      this.blocked = false;
      this.unusable = null;
      this.status = this.writerAvailable
        ? "Progress saves on this browser."
        : "Another tab may be saving progress. Close other TurboType tabs to make this tab writable.";
      if (
        this.writerAvailable &&
        raw === null &&
        save.campaign &&
        (Object.keys(save.campaign.clears).length ||
          Object.values(save.campaign.positions).some(
            (position) => position !== null,
          ))
      )
        this.persist(save);
    } catch {
      this.blocked = true;
      this.status =
        "Progress storage is unavailable or unreadable. Existing data is preserved. Changes last for this visit only.";
    }
  }

  private persist(save: GuestSave, replace = false, notify = true): boolean {
    const updated = {
      ...save,
      revision: save.revision + 1,
      updatedAt: Date.now(),
    };
    if (!this.writerAvailable) {
      if (!replace) {
        this.value = updated;
        this.dirty = true;
      }
      this.status =
        "Another tab is the save writer. Changes last for this visit only. Close the other tab, then retry or export.";
      return false;
    }
    if (!this.blocked || replace) {
      try {
        const store = this.storage();
        const current = store.getItem(GUEST_KEY);
        if (current !== this.baseline && !replace) {
          this.dirty = true;
          this.value = updated;
          this.status =
            "Another tab changed progress. Export this visit before reloading. Changes last for this visit only.";
          return false;
        }
        const raw = JSON.stringify(updated);
        if (!parseGuestSave(raw)) throw new Error("invalid save");
        if (replace && (this.unusable ?? current) !== null)
          store.setItem(RECOVERY_KEY, (this.unusable ?? current)!);
        store.setItem(GUEST_KEY, raw);
        this.baseline = raw;
        this.value = updated;
        this.unusable = null;
        this.dirty = false;
        this.blocked = false;
        this.status = "Progress saved on this browser.";
        if (notify) this.onWrite?.();
        return true;
      } catch {
        // Keep the working snapshot available for export/retry.
      }
    }
    this.dirty = true;
    if (!replace) this.value = updated;
    this.status =
      "Progress could not be saved. Existing data is preserved. Changes last for this visit only.";
    return false;
  }

  retry(): boolean {
    if (this.unusable !== null) return false;
    this.blocked = false;
    return this.persist(this.value);
  }

  position(category: Category, x: number): void {
    if (!Number.isFinite(x) || !this.writerAvailable) return;
    this.reload();
    const position = Math.max(0, Math.min(17000, x));
    if (this.value.campaign.positions[category] === position) return;
    const save = this.snapshot();
    save.campaign.positions[category] = position;
    this.persist(save);
  }

  equip(equipment: Pick<GuestSave, "kart" | "track">): boolean {
    this.reload();
    return this.persist({ ...this.value, ...equipment });
  }

  finish(
    id: string,
    event: string,
    snapshot: TypingSnapshot,
    place: number,
    pace: number[],
    recovered: boolean,
    samples: Record<string, CharacterSample>,
    level?: CampaignLevel,
  ) {
    this.reload();
    const before = this.value;
    const result = level
      ? recordCampaignFinish(before.campaign, level, snapshot)
      : { accepted: false, newlyCleared: false, progress: before.campaign };
    if (
      before.history.some((row) => row.id === id) ||
      !["finished", "timed-out", "abandoned"].includes(snapshot.state) ||
      snapshot.totalAttempts === 0
    )
      return {
        ...result,
        saved: !this.dirty,
        xp: 0,
        credits: 0,
        awards: [] as string[],
        unlocks: [] as string[],
      };
    const eligible = level
      ? result.accepted
      : snapshot.eligible && snapshot.elapsedMs > 0;
    const run: RunSummary = {
      id,
      event,
      at: Date.now(),
      elapsedMs: snapshot.elapsedMs,
      wpm: snapshot.wpm,
      attempts: snapshot.totalAttempts,
      correct: snapshot.correctAttempts,
      eligible,
      finished: snapshot.state === "finished",
      pace,
    };
    const reward =
      eligible || snapshot.practiceReasons.includes("paused")
        ? ordinaryReward(snapshot, place, level)
        : { xp: 0, credits: 0 };
    const best = before.records[event];
    const characters = { ...before.characters };
    if (eligible)
      for (const [key, sample] of Object.entries(samples)) {
        const previous = characters[key] ?? {
          attempts: 0,
          errors: 0,
          timingCount: 0,
          timingMs: 0,
        };
        if (previous.attempts + sample.attempts <= 1e8)
          characters[key] = {
            attempts: previous.attempts + sample.attempts,
            errors: previous.errors + sample.errors,
            timingCount: previous.timingCount + sample.timingCount,
            timingMs: previous.timingMs + sample.timingMs,
          };
      }
    const save: GuestSave = {
      ...before,
      campaign: result.progress,
      raceXp: before.raceXp + reward.xp,
      raceCredits: before.raceCredits + reward.credits,
      recoveryBadge: before.recoveryBadge || (eligible && recovered),
      history: [run, ...before.history].slice(0, HISTORY_LIMIT),
      characters,
      records:
        eligible && (!best || run.elapsedMs < best.elapsedMs)
          ? { ...before.records, [event]: run }
          : before.records,
    };
    const old = economy(before);
    const next = economy(save);
    const awards = next.awards
      .filter(
        ({ id: award }) =>
          !old.awards.some((previous) => previous.id === award),
      )
      .map(({ id: award }) => award);
    if (save.recoveryBadge && !before.recoveryBadge) awards.push("recovery");
    const previousOwnership = ownedEquipment(before.campaign);
    const unlocks = [...ownedEquipment(save.campaign)].filter(
      (item) => !previousOwnership.has(item),
    );
    return {
      ...result,
      saved: this.persist(save),
      xp: next.xp - old.xp,
      credits: next.credits - old.credits,
      awards,
      unlocks,
    };
  }

  exportRaw(): string {
    if (this.unusable !== null) return this.unusable;
    try {
      return this.storage().getItem(RECOVERY_KEY) ?? JSON.stringify(this.value);
    } catch {
      return JSON.stringify(this.value);
    }
  }

  exportCurrent(): string {
    return JSON.stringify(this.value);
  }

  replace(raw: string, notify = true): boolean {
    const save = parseGuestSave(raw);
    return (
      !!save &&
      this.persist(
        { ...save, revision: Math.max(save.revision, this.value.revision) },
        true,
        notify,
      )
    );
  }

  reset(): boolean {
    return this.replace(JSON.stringify(newGuestSave()));
  }
}
