import { isKartId, type KartId } from "../content/kart-catalog";
const KEY = "turbotype:garage:v1";
/** Cosmetic preference, not a campaign entitlement or race-result save. */
export class LocalGarageRepository {
  constructor(private storage: () => Pick<Storage, "getItem" | "setItem">) {}
  load(): KartId {
    try {
      const value: unknown = JSON.parse(this.storage().getItem(KEY) ?? "null");
      if (
        value &&
        typeof value === "object" &&
        "schemaVersion" in value &&
        value.schemaVersion === 1 &&
        "selectedKart" in value &&
        isKartId(value.selectedKart)
      )
        return value.selectedKart;
    } catch {
      /* Storage is optional; the default remains playable. */
    }
    return "volt-kart";
  }
  save(selectedKart: KartId): boolean {
    if (!isKartId(selectedKart)) return false;
    try {
      this.storage().setItem(
        KEY,
        JSON.stringify({ schemaVersion: 1, selectedKart }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
