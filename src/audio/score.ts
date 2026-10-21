export const SCORE_BPM = 116;
export const SCORE_STEP_SECONDS = 60 / SCORE_BPM / 4;
export interface ScoreNote {
  midi: number;
  duration: number;
  level: number;
  wave: OscillatorType;
}
/** Original 'Harbor Circuit' score. 8 bars / 128 sixteenth-note steps, ~16.55 seconds. */
export function scoreStep(
  step: number,
  race: boolean,
): { notes: ScoreNote[]; kick: boolean; hat: boolean; snare: boolean } {
  const index = ((step % 128) + 128) % 128,
    bar = Math.floor(index / 16),
    tick = index % 16;
  const root = [45, 41, 48, 43, 45, 41, 48, 43][bar];
  const motif = [
    24, 31, 27, 26, 24, 19, 22, 27, 24, 31, 34, 31, 27, 26, 22, 19,
  ];
  const notes: ScoreNote[] = [];
  if (tick % 4 === 0)
    notes.push({
      midi: root,
      duration: 0.34,
      level: race ? 0.11 : 0.085,
      wave: "triangle",
    });
  if (tick === 0)
    for (const offset of [12, 15, 19])
      notes.push({
        midi: root + offset,
        duration: 1.8,
        level: 0.022,
        wave: "sine",
      });
  if (tick % 2 === 0)
    notes.push({
      midi: root + motif[(tick + bar * 3) % 16],
      duration: race ? 0.16 : 0.32,
      level: race ? 0.045 : 0.035,
      wave: "triangle",
    });
  return {
    notes,
    kick: tick % 4 === 0,
    hat: tick % 2 === 0,
    snare: tick % 8 === 4,
  };
}
export const midiHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
