import {
  emptyCampaign,
  recordCampaignFinish,
  validateCampaign,
  type CampaignProgress,
} from "../core/campaign-progress";
import type { CampaignLevel, Category } from "../content/campaign";
import type { TypingSnapshot } from "../core/typing-engine";
export const CAMPAIGN_STORAGE_KEY = "turbotype:campaign-map:v2";
export const LEGACY_CAMPAIGN_STORAGE_KEY = "turbotype:campaign-map:v1";
/** Small Phase 7 progress boundary. Phase 9 migrates it into the canonical guest snapshot. */
export class LocalCampaignRepository {
  private value = emptyCampaign();
  private blocked = false;
  status = "Progress saves on this browser only. No cloud backup yet.";
  constructor(private storage: () => Pick<Storage, "getItem" | "setItem">) {
    this.reload();
  }
  read(): CampaignProgress {
    return structuredClone(this.value);
  }
  reload(): void {
    try {
      const raw = this.storage().getItem(CAMPAIGN_STORAGE_KEY);
      if (raw === null) {
        if (this.blocked) return;
        const legacy = this.storage().getItem(LEGACY_CAMPAIGN_STORAGE_KEY);
        if (legacy !== null) {
          const migrated = validateCampaign(JSON.parse(legacy), true);
          if (!migrated) throw new Error("invalid legacy progress");
          this.value = migrated;
          this.persist(); // Leave the original v1 value untouched as a recovery copy.
        } else this.value = emptyCampaign();
        return;
      }
      const parsed = validateCampaign(JSON.parse(raw));
      if (!parsed) throw new Error("invalid");
      this.value = parsed;
      this.blocked = false;
      this.status = "Progress saves on this browser only. No cloud backup yet.";
    } catch {
      this.blocked = true;
      this.status =
        "Campaign storage is unavailable or unreadable. Existing data is preserved; changes last for this visit only.";
    }
  }
  private persist(): boolean {
    if (this.blocked) return false;
    try {
      const raw = JSON.stringify(this.value);
      if (this.storage().getItem(CAMPAIGN_STORAGE_KEY) !== raw)
        this.storage().setItem(CAMPAIGN_STORAGE_KEY, raw);
      return true;
    } catch {
      this.blocked = true;
      this.status =
        "Campaign storage is unavailable. Progress lasts for this visit only.";
      return false;
    }
  }
  finish(level: CampaignLevel, snapshot: TypingSnapshot) {
    if (!this.blocked) this.reload();
    const result = recordCampaignFinish(this.value, level, snapshot);
    if (!result.accepted) return { ...result, saved: false };
    this.value = result.progress;
    return { ...result, saved: this.persist() };
  }
  position(category: Category, x: number): void {
    if (!Number.isFinite(x)) return;
    if (!this.blocked) this.reload();
    this.value.positions[category] = Math.max(0, Math.min(17000, x));
    this.persist();
  }
  exportRaw(): string {
    try {
      return (
        this.storage().getItem(CAMPAIGN_STORAGE_KEY) ??
        this.storage().getItem(LEGACY_CAMPAIGN_STORAGE_KEY) ??
        JSON.stringify(this.value)
      );
    } catch {
      return JSON.stringify(this.value);
    }
  }
}
