export function guestFixture() {
  return {
    schemaVersion: 1,
    rulesVersion: 3,
    contentVersion: 3,
    revision: 1,
    updatedAt: 0,
    campaign: {
      schemaVersion: 2,
      rulesVersion: 3,
      positions: { easy: null, medium: null, hard: null },
      clears: {} as Record<
        string,
        {
          stars: number;
          bestWpm: number;
          bestAccuracy: number;
          bestTimeMs: number;
          revision: number;
        }
      >,
      bonuses: {},
    },
    raceXp: 0,
    raceCredits: 0,
    recoveryBadge: false,
    history: [],
    records: {},
    characters: {},
  };
}
