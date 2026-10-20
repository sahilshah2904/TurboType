/** Framework-free contracts shared by solo, persistence and future network adapters. */
export const CATEGORIES = ["easy", "medium", "hard"] as const;
export type Category = (typeof CATEGORIES)[number];
export type LevelId = `${Category}-${string}`;
export type RaceId = string & { readonly __raceId: unique symbol };
export type PlayerId = string & { readonly __playerId: unique symbol };
export type InputProfile = "touch" | "hardware" | "unspecified";
export type RaceStatus =
  "ready" | "countdown" | "racing" | "paused" | "finished" | "abandoned";

export interface RaceSnapshot {
  raceId: RaceId;
  status: RaceStatus;
  elapsedMs: number;
  validatedLength: number;
}

export interface RaceResult {
  raceId: RaceId;
  playerId: PlayerId;
  levelId: LevelId | null;
  rulesVersion: number;
  contentVersion: number;
  inputProfile: InputProfile;
  elapsedMs: number;
  correctAttempts: number;
  totalAttempts: number;
  eligible: boolean;
  provenance: "client-solo" | "server-match";
}

/** Intentionally not implemented in Phase 2; race behavior starts in Phase 3. */
export interface RaceProvider {
  start(): Promise<void>;
  subscribe(listener: (snapshot: RaceSnapshot) => void): () => void;
  dispose(): void;
}

export interface AuthSession {
  playerId: PlayerId;
  kind: "guest" | "account";
}

export interface AuthProvider {
  getSession(): Promise<AuthSession>;
  subscribe(listener: (session: AuthSession) => void): () => void;
}

export type SyncState = "local" | "pending" | "synced" | "failed";
export interface ResultSyncProvider {
  /** The server must deduplicate by raceId and derive awards, not trust client balances. */
  submit(result: RaceResult): Promise<{ raceId: RaceId; state: SyncState }>;
}

export interface SettingsRepository<T> {
  load(): T;
  save(settings: T): boolean;
}
