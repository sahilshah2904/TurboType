import type { RaceAudio } from "../audio/race-audio";
export function audioControls(): string {
  return `<details class="audio-controls"><summary>Sound & music</summary><div class="audio-controls__body"><button type="button" id="audio-toggle" class="button button--secondary" aria-pressed="false">Enable sound</button>${["master", "music", "effects"].map((key) => `<label for="audio-${key}">${key[0].toUpperCase() + key.slice(1)} volume<input id="audio-${key}" type="range" min="0" max="1" step="0.05" /></label>`).join("")}<p id="audio-status" class="help" role="status">Sound off. Enable it when ready.</p></div></details>`;
}
export function connectAudioControls(
  parent: HTMLElement,
  audio: RaceAudio,
): () => void {
  const abort = new AbortController(),
    options = { signal: abort.signal };
  const button = parent.querySelector<HTMLButtonElement>("#audio-toggle")!,
    status = parent.querySelector<HTMLElement>("#audio-status")!;
  let unsaved = false;
  const sync = () => {
    const p = audio.preferences;
    button.textContent =
      p.muted || audio.status === "locked" ? "Enable sound" : "Mute sound";
    button.setAttribute(
      "aria-pressed",
      String(!p.muted && audio.status === "running"),
    );
    for (const key of ["master", "music", "effects"] as const)
      parent.querySelector<HTMLInputElement>(`#audio-${key}`)!.value = String(
        p[key],
      );
    status.dataset.state = audio.status;
    status.textContent =
      (audio.status === "unavailable"
        ? "Sound unavailable. Racing still works; toggle sound off/on to retry."
        : audio.status === "locked"
          ? "Tap Enable sound or Start race to unlock browser audio."
          : p.muted
            ? "Sound off. Enable it when ready."
            : "Sound on · original Harbor Circuit synth score.") +
      (unsaved
        ? " Applied for this visit; browser storage is unavailable."
        : "");
  };
  const unsubscribe = audio.subscribe(sync);
  button.addEventListener(
    "click",
    () => {
      const muted =
        audio.status === "locked" ? false : !audio.preferences.muted;
      unsaved = !audio.setPreferences({ ...audio.preferences, muted });
      if (!muted) void audio.unlock().then(sync);
      sync();
    },
    options,
  );
  for (const key of ["master", "music", "effects"] as const)
    parent.querySelector<HTMLInputElement>(`#audio-${key}`)!.addEventListener(
      "input",
      (event) => {
        unsaved = !audio.setPreferences({
          ...audio.preferences,
          [key]: Number((event.target as HTMLInputElement).value),
        });
        sync();
      },
      options,
    );
  return () => {
    abort.abort();
    unsubscribe();
  };
}
