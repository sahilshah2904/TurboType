import type { RaceAudio } from "../audio/race-audio";
export function audioControls(): string {
  return `<details class="audio-controls"><summary>Sound & music</summary><div class="audio-controls__body"><button type="button" id="audio-toggle" class="button button--secondary" aria-pressed="false">Enable sound</button>${["master", "music", "effects"].map((key) => `<label for="audio-${key}">${key[0].toUpperCase() + key.slice(1)} volume<input id="audio-${key}" type="range" min="0" max="1" step="0.05" /></label>`).join("")}<label for="personal-music">Personal music file<input id="personal-music" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac" /></label><p id="personal-music-status" class="help" role="status"></p><button type="button" id="clear-personal-music" class="text-button">Use original music</button><p class="help">Choose your own audio file, including your copy of Misirlou. It stays on this device for this visit; nothing is uploaded. Countdown cues stay separate.</p><p id="audio-status" class="help" role="status">Sound off. Enable it when ready.</p></div></details>`;
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
  let fileError = "";
  const sync = () => {
    const p = audio.preferences;
    const track = audio.personalTrack;
    parent.querySelector("#personal-music-status")!.textContent =
      fileError ||
      (track.name
        ? `${track.name}${track.failed ? " — playback blocked or unsupported; using original music. Tap Retry sound to retry." : " — selected for menu and race music."}`
        : "Original Harbor Circuit soundtrack selected.");
    parent.querySelector<HTMLButtonElement>("#clear-personal-music")!.disabled =
      !track.name;
    button.textContent =
      p.muted || audio.status === "locked"
        ? "Enable sound"
        : track.failed
          ? "Retry sound"
          : "Mute sound";
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
            : `Sound on · ${track.name && !track.failed ? "personal soundtrack" : "original Harbor Circuit score"}.`) +
      (unsaved
        ? " Applied for this visit; browser storage is unavailable."
        : "");
  };
  const unsubscribe = audio.subscribe(sync);
  parent.querySelector<HTMLInputElement>("#personal-music")!.addEventListener(
    "change",
    (event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      if (
        file.size > 50 * 1024 * 1024 ||
        file.size === 0 ||
        (!file.type.startsWith("audio/") &&
          !/\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(file.name))
      ) {
        fileError =
          "Choose an audio file between 1 byte and 50 MB. Your previous track is unchanged.";
      } else {
        fileError = "";
        unsaved = !audio.setPreferences({ ...audio.preferences, muted: false });
        audio.selectMusic(file);
        void audio.unlock().then(sync);
      }
      input.value = "";
      sync();
    },
    options,
  );
  parent.querySelector("#clear-personal-music")!.addEventListener(
    "click",
    () => {
      fileError = "";
      audio.clearMusic();
      sync();
    },
    options,
  );
  button.addEventListener(
    "click",
    () => {
      const muted =
        audio.status === "locked" || audio.personalTrack.failed
          ? false
          : !audio.preferences.muted;
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
