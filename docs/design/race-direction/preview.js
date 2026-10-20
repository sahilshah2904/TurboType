import { SoloRace } from "../../../src/core/solo-race.ts";
import { connectRaceInput } from "../../../src/ui/race-input.ts";

const $ = (id) => document.getElementById(id);
const passage =
  "Every clean word carries you forward. Find a steady rhythm, correct each mistake, and let your focus turn the road into a new personal challenge.";
const ids = ["cpu-1", "cpu-2", "player", "cpu-3", "cpu-4"];
let race,
  adapter,
  audioUrl,
  previousState = "",
  lastBurst = 0,
  toastUntil = 0;
let raf,
  disposed = false,
  ready = false,
  lastHudAt = -Infinity;
const movement = new Map();
const input = $("input"),
  music = $("music"),
  menu = $("menu"),
  sound = $("sound");
const params = new URLSearchParams(location.search);
if (params.get("keyboard") === "mock")
  document.body.classList.add("mock-keyboard");
$("accessible-passage").textContent = passage;
for (const [i, id] of ids.entries()) {
  const lane = document.createElement("div");
  lane.className = "lane";
  const car = document.createElement("div");
  car.className = "car" + (id === "player" ? " player" : "");
  car.id = `car-${id}`;
  if (id !== "player")
    car.style.setProperty(
      "--paint",
      `hue-rotate(${[80, 160, 0, 240, 300][i]}deg)`,
    );
  const label = document.createElement("span");
  label.className = "label";
  const flame = document.createElement("span");
  flame.className = "flame";
  flame.style.animationDelay = `${-i * 37}ms`;
  flame.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = "./volt-kart-concept.png";
  img.alt = "";
  car.append(label, flame, img);
  lane.append(car);
  $("track").append(lane);
}
function createRace() {
  adapter?.dispose();
  race?.abandon();
  race = new SoloRace({
    passage,
    tier: "easy",
    seed: 42,
    now: () => performance.now(),
  });
  adapter = connectRaceInput(input, race.typing, update, (message) => {
    $("hint").textContent = message;
  });
  $("passage").replaceChildren(
    ...Array.from(passage, (char) => {
      const span = document.createElement("span");
      span.textContent = char;
      return span;
    }),
  );
  movement.clear();
  previousState = "";
  lastBurst = 0;
  ready = true;
  update();
}
function showMenu(title, copy) {
  $("menu-title").textContent = title;
  $("menu-copy").textContent = copy;
  if (!menu.open && !sound.open) menu.showModal();
}
function pause() {
  race.pause();
  music.pause();
  update();
  if (race.snapshot().player.state === "paused")
    showMenu("Take a breath.", "Your text is safe. Everyone is paused.");
}
function update() {
  if (disposed || !ready) return;
  const snapshot = race.snapshot(),
    s = snapshot.player;
  input.readOnly = s.state !== "racing";
  adapter.sync();
  document.body.classList.toggle("racing", s.state === "racing");
  document.body.classList.toggle(
    "nitro",
    s.state === "racing" && s.nitroActive,
  );
  $("place").textContent =
    `${snapshot.standings.find((row) => row.id === "player").place} / 5`;
  $("wpm").textContent = s.wpm.toFixed(0);
  $("accuracy").textContent =
    s.accuracyPercent === null ? "—" : `${s.accuracyPercent.toFixed(0)}%`;
  const seconds = s.elapsedMs / 1000;
  $("timer").textContent =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;
  $("streak").textContent = `CLEAN STREAK ${s.cleanStreak}`;
  $("progress").style.width = `${s.progress * 100}%`;
  $("race").style.setProperty("--road-x", `${-s.elapsedMs * 0.2}px`);
  for (const [i, span] of [...$("passage").children].entries()) {
    span.className =
      i < s.validatedLength
        ? "done"
        : i === s.validatedLength
          ? s.errorCharacter === null
            ? "current"
            : "error"
          : "";
  }
  const caret = $("passage").querySelector(".current,.error");
  if (caret)
    $("passage").scrollLeft = Math.max(
      0,
      caret.offsetLeft - $("passage").clientWidth * 0.26,
    );
  const width = $("track").clientWidth;
  for (const id of ids) {
    const row = snapshot.standings.find((r) => r.id === id),
      gap = row.progress - s.progress;
    const x =
      width *
      (0.43 + Math.sign(gap) * 0.43 * (1 - Math.exp(-Math.abs(gap) * 7)));
    const car = $(`car-${id}`);
    car.style.left = `${Math.max(55, Math.min(width - 55, x))}px`;
    const previous = movement.get(id);
    const movedAt =
      previous && row.progress > previous.progress
        ? s.elapsedMs
        : (previous?.movedAt ?? -Infinity);
    movement.set(id, { progress: row.progress, movedAt });
    car.dataset.moving = String(
      s.state === "racing" &&
        row.progress < 1 &&
        s.elapsedMs - movedAt < 200 &&
        (id !== "player" || s.errorCharacter === null),
    );
    car.querySelector(".label").textContent =
      id === "player"
        ? `YOU · #${row.place}`
        : `${row.name} · CPU · ${Math.round(row.progress * 100)}%`;
  }
  $("countdown").hidden = s.state !== "countdown";
  $("countdown").textContent = s.countdown ?? "";
  if (s.nitroBursts > lastBurst) {
    lastBurst = s.nitroBursts;
    toastUntil = s.elapsedMs + 1000;
  }
  $("toast").hidden = s.state !== "racing" || s.elapsedMs >= toastUntil;
  $("start").textContent =
    s.state === "paused" ? "Resume preview →" : "Start preview →";
  $("start").hidden = ["finished", "timed-out"].includes(s.state);
  $("retry").hidden = s.state === "ready";
  if (s.state !== previousState) {
    if (s.state === "racing")
      $("hint").textContent =
        "Type the passage · Backspace corrects · Esc pauses";
    if (s.state === "paused")
      $("hint").textContent = "Paused. Resume when ready.";
    if (s.state === "finished") {
      music.pause();
      const player = snapshot.results.find((row) => row.id === "player");
      $("summary").hidden = false;
      $("summary").textContent =
        `Place ${player.place} of 5 · ${s.wpm.toFixed(1)} WPM · ${s.accuracyPercent.toFixed(1)}% accuracy\n${s.errorCount} errors · ${s.correctedErrors} corrected · ${s.longestStreak} best streak\nSession-only prototype result. No rewards or progress saved.`;
      showMenu(
        "Lap complete.",
        "The result is frozen. Keep building your rhythm.",
      );
    }
  }
  previousState = s.state;
}
$("start").addEventListener("click", () => {
  menu.close();
  race.start();
  update();
  input.focus();
  if (audioUrl)
    void music.play().catch(() => {
      $("file-status").textContent =
        "Playback blocked. Press Play in the music controls.";
    });
});
$("retry").addEventListener("click", () => {
  music.pause();
  if (audioUrl) music.currentTime = 0;
  createRace();
  $("summary").hidden = true;
  showMenu("Find your rhythm.", "Same passage. Same seed. Fresh start.");
});
$("pause").addEventListener("click", pause);
menu.addEventListener("cancel", (event) => {
  event.preventDefault();
});
sound.addEventListener("cancel", (event) => {
  event.preventDefault();
  sound.close();
  music.pause();
  showAfterSound();
});
$("settings").addEventListener("click", () => {
  race.pause();
  music.pause();
  update();
  if (menu.open) menu.close();
  sound.showModal();
});
function showAfterSound() {
  if (race.snapshot().player.state !== "racing")
    showMenu(
      "Ready when you are.",
      "Start or resume the preview. Your music choice stays in this tab.",
    );
}
$("close-sound").addEventListener("click", () => {
  sound.close();
  music.pause();
  showAfterSound();
});
$("music-file").addEventListener("change", (event) => {
  music.pause();
  music.removeAttribute("src");
  music.load();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = undefined;
  const file = event.target.files?.[0];
  if (!file) {
    $("file-status").textContent = "No recording selected.";
    return;
  }
  if (file.type && !file.type.startsWith("audio/")) {
    $("file-status").textContent = "Please choose an audio recording.";
    return;
  }
  audioUrl = URL.createObjectURL(file);
  music.src = audioUrl;
  music.volume = 0.35;
  $("file-status").textContent =
    `Selected locally: ${file.name}. Start/resume the preview to play it.`;
});
music.addEventListener("error", () => {
  $("file-status").textContent =
    "This recording could not play. Choose another supported audio file.";
});
$("fullscreen").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    $("file-status").textContent =
      "Fullscreen unavailable. The preview still fills the browser window.";
  }
});
$("standings").addEventListener("click", () => {
  const snapshot = race.snapshot();
  $("summary").hidden = false;
  $("summary").textContent = (snapshot.results ?? snapshot.standings)
    .map(
      (row) =>
        `${row.place}. ${row.name}${row.cpu ? " (CPU)" : ""} — ${Math.round(row.progress * 100)}%${row.status === "simulated" ? " · simulated finish" : ""}`,
    )
    .join("\n");
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.open && !sound.open) pause();
});
window.addEventListener("blur", pause);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
function viewport() {
  document.documentElement.style.setProperty(
    "--visible-height",
    `${window.visualViewport?.height ?? innerHeight}px`,
  );
}
window.visualViewport?.addEventListener("resize", viewport);
window.addEventListener("resize", viewport);
viewport();
function tick(at) {
  if (disposed) return;
  if (at - lastHudAt >= 50) {
    lastHudAt = at;
    update();
  }
  raf = requestAnimationFrame(tick);
}
createRace();
menu.showModal();
raf = requestAnimationFrame(tick);
window.addEventListener("pagehide", () => {
  disposed = true;
  cancelAnimationFrame(raf);
  adapter.dispose();
  race.pause();
  music.pause();
  music.removeAttribute("src");
  music.load();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
});
