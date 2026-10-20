export interface Standing {
  id: string;
  progress: number;
  finishTimeMs: number | null;
}

/** Competition ranking (1,1,3); ids break display ties, never competitive places. */
export function rankStandings(
  entries: readonly Standing[],
): (Standing & { place: number })[] {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (
      ids.has(entry.id) ||
      !Number.isFinite(entry.progress) ||
      entry.progress < 0 ||
      entry.progress > 1 ||
      (entry.finishTimeMs !== null &&
        (!Number.isFinite(entry.finishTimeMs) ||
          entry.finishTimeMs < 0 ||
          entry.progress !== 1))
    )
      throw new RangeError("Invalid or duplicate race standing.");
    ids.add(entry.id);
  }
  const sorted = [...entries].sort((a, b) => {
    const displayOrder = a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    if (a.finishTimeMs !== null && b.finishTimeMs !== null)
      return a.finishTimeMs - b.finishTimeMs || displayOrder;
    if (a.finishTimeMs !== null) return -1;
    if (b.finishTimeMs !== null) return 1;
    return b.progress - a.progress || displayOrder;
  });
  let place = 1;
  return sorted.map((entry, index) => {
    const previous = sorted[index - 1];
    const tied =
      previous &&
      (entry.finishTimeMs !== null
        ? entry.finishTimeMs === previous.finishTimeMs
        : previous.finishTimeMs === null &&
          entry.progress === previous.progress);
    if (!tied) place = index + 1;
    return { ...entry, place };
  });
}
