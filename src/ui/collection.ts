import { STARTER_KARTS, isKartId, type KartId } from "../content/kart-catalog";
import {
  STARTER_TRACKS,
  isTrackId,
  type TrackId,
  type TrackTheme,
} from "../content/track-catalog";
import { CAR_REWARDS, TRACK_REWARDS } from "../content/collection";
import { CATEGORY_NAMES } from "../content/campaign";
import { mountTrackPreview } from "../game/track-preview";

export type CollectionKind = "cars" | "tracks";
const color = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

/** Lightweight original geometric thumbnails; enlarged tracks use the actual game scene. */
function trackThumbnail(track: TrackTheme): string {
  const silhouettes =
    track.id === "neon-harbor"
      ? Array.from(
          { length: 12 },
          (_, i) =>
            `<rect x="${i * 52}" y="${55 + ((i * 37) % 75)}" width="38" height="145"/>`,
        ).join("")
      : track.id === "emerald-trail"
        ? Array.from(
            { length: 12 },
            (_, i) =>
              `<path d="M${i * 54} 190 l25 -${90 + ((i * 13) % 50)} 25 ${90 + ((i * 13) % 50)}Z"/>`,
          ).join("")
        : track.id === "coral-coast"
          ? '<path d="M0 135 Q140 110 300 140 T600 130 V200 H0Z"/><path d="M60 190 Q70 110 90 70 M90 70 Q25 60 30 100 M90 70 Q140 40 150 90" fill="none" stroke="currentColor" stroke-width="12"/>'
          : '<path d="M0 195 L90 45 200 180 320 20 480 175 550 65 640 195Z"/>';
  return `<svg class="collection-art" viewBox="0 0 600 260" aria-hidden="true"><rect width="600" height="260" fill="${color(track.sky)}"/><circle cx="490" cy="55" r="27" fill="${color(track.glow)}"/><g fill="${color(track.land)}" color="${color(track.detail)}">${silhouettes}</g>${track.id === "frostline-pass" ? '<path d="M65 85 L90 45 120 88 90 76ZM292 62L320 20 354 66 320 53Z" fill="#b7d4e6"/>' : ""}<path d="M0 197H600V260H0Z" fill="${color(track.road)}"/><path d="M0 197H600" stroke="${color(track.edge)}" stroke-width="3"/><path d="M0 232H600" stroke="#a2b1bc" stroke-opacity=".35" stroke-width="2" stroke-dasharray="35 30"/></svg>`;
}
/** Concept silhouettes deliberately conceal surface detail and cannot be enlarged. */
function vehicleShadow(family: string): string {
  const body =
    family === "board"
      ? '<path d="M70 142Q170 170 285 140L260 159H100Z M143 132L166 75 202 77 214 133Z"/>'
      : family === "truck" || family === "crawler"
        ? '<path d="M55 124V85H132L151 61H222L252 100H292V139H55Z"/><circle cx="104" cy="145" r="32"/><circle cx="245" cy="145" r="32"/>'
        : family === "flight" || family === "jet"
          ? '<path d="M38 137L108 110 160 62 210 70 230 113 310 140 220 155H90Z M101 117L53 64 91 71 152 122Z"/>'
          : family === "hover" || family === "pod"
            ? '<path d="M43 139Q68 103 125 105L158 70Q214 66 237 110L298 136 272 157H72Z"/><ellipse cx="170" cy="173" rx="99" ry="5"/>'
            : '<path d="M42 142L67 111 131 100 160 73H221L251 111 293 126 305 149H42Z"/><circle cx="100" cy="147" r="24"/><circle cx="250" cy="147" r="24"/>';
  return `<svg class="collection-shadow" viewBox="0 0 340 205" aria-hidden="true"><g fill="#05090e" stroke="#45535f" stroke-width="2">${body}</g></svg>`;
}
export function collectionScreen(
  kind: CollectionKind,
  kart: KartId,
  track: TrackId,
  locked: boolean,
): string {
  const cars = kind === "cars";
  const starters = cars
    ? STARTER_KARTS.map((k) => ({
        id: k.id,
        name: k.name,
        description: k.style,
        art: `<img class="collection-art" src="${import.meta.env.BASE_URL}assets/karts/${k.file}" alt="${k.style}" loading="lazy"/>`,
      }))
    : STARTER_TRACKS.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.setting,
        art: trackThumbnail(t),
      }));
  const selected = cars ? kart : track;
  const rewards = cars ? CAR_REWARDS : TRACK_REWARDS;
  return `<section class="collection-page"><div class="collection-heading"><div><p class="eyebrow">YOUR COLLECTION</p><h1>${cars ? "Choose your" : "Find your"} <span>${cars ? "ride." : "circuit."}</span></h1><p>${cars ? "Every style. The same performance." : "A new setting for every stretch of road."} Your choice follows you into every race.</p></div><nav aria-label="Collections"><a href="#/cars" ${cars ? 'aria-current="page"' : ""}>Cars · 23</a><a href="#/tracks" ${!cars ? 'aria-current="page"' : ""}>Tracks · 26</a></nav></div>
  <div class="collection-lock" ${locked ? "" : "hidden"}><p>A race is in progress. You can preview, but cannot change your car or track until it ends.</p><button id="collection-end-race" class="button button--secondary">End current races to change selection</button></div>
  <p id="collection-status" role="status">${locked ? "Selection locked during the race, including pauses." : "Select once. Saved on this browser for all your races."}</p>
  <h2>Ready to ${cars ? "drive" : "race"} <span class="help">5 starters</span></h2><div class="collection-grid">${starters.map((item) => `<article class="collection-card" data-item="${item.id}" data-selected="${item.id === selected}"><button class="collection-preview" data-preview="${item.id}" aria-label="Enlarge ${item.name}">${item.art}<span class="collection-enlarge" aria-hidden="true">⛶</span></button><div class="collection-card-copy"><h3>${item.name}</h3><p>${item.description}</p><button class="button ${item.id === selected ? "button--primary" : "button--secondary"}" data-equip="${item.id}" aria-pressed="${item.id === selected}" ${locked ? "disabled" : ""}>${item.id === selected ? "Selected" : "Select"}</button></div></article>`).join("")}</div>
  <div class="collection-reward-heading"><h2>On the horizon</h2><p>Locked design previews. Earned rewards and final artwork are coming. Only unique eligible main levels count; bonus challenges and replays do not.</p></div><div class="collection-grid collection-grid--rewards">${rewards.map((item) => `<article class="collection-card collection-card--locked" data-reward="${item.id}" aria-label="${item.name}, locked, ${CATEGORY_NAMES[item.category]} level ${item.level}">${cars ? vehicleShadow((item as (typeof CAR_REWARDS)[number]).family) : `<svg class="collection-shadow" viewBox="0 0 340 205" aria-hidden="true"><path d="M0 170L55 90 95 140 155 55 220 125 275 80 340 160V205H0Z" fill="#05090e" stroke="#45535f"/><path d="M0 185Q100 140 180 180T340 173" fill="none" stroke="#45535f" stroke-width="10"/></svg>`}<div class="collection-card-copy"><p class="eyebrow">LOCKED · ${CATEGORY_NAMES[item.category]}</p><h3>${item.name}</h3><p>Unlock at ${CATEGORY_NAMES[item.category]} level <strong>${item.level}</strong></p></div></article>`).join("")}</div>
  <dialog id="collection-detail" class="collection-detail" aria-labelledby="collection-detail-title"><button id="collection-close" class="text-button">Close ×</button><div id="collection-detail-content"></div></dialog></section>`;
}
export function connectCollection(
  main: HTMLElement,
  kind: CollectionKind,
  options: {
    kart: () => KartId;
    track: () => TrackId;
    locked: () => boolean;
    equipKart: (id: KartId) => boolean;
    equipTrack: (id: TrackId) => boolean;
    endRaces: () => void;
    reducedMotion: () => boolean;
    effects: () => "high" | "low";
  },
): () => void {
  const abort = new AbortController();
  const dialog = main.querySelector<HTMLDialogElement>("#collection-detail")!;
  const detail = main.querySelector<HTMLElement>("#collection-detail-content")!;
  const status = main.querySelector<HTMLElement>("#collection-status")!;
  let disposePreview: (() => void) | undefined;
  let generation = 0;
  const stopPreview = () => {
    generation++;
    disposePreview?.();
    disposePreview = undefined;
  };
  dialog.addEventListener("close", stopPreview, { signal: abort.signal });
  main
    .querySelector("#collection-close")!
    .addEventListener("click", () => dialog.close(), { signal: abort.signal });
  main
    .querySelector("#collection-end-race")!
    .addEventListener("click", options.endRaces, { signal: abort.signal });
  main.addEventListener(
    "click",
    (event) => {
      const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "[data-equip], [data-preview]",
      );
      if (!target) return;
      const id = target.dataset.equip ?? target.dataset.preview;
      const item =
        kind === "cars"
          ? STARTER_KARTS.find((k) => k.id === id)
          : STARTER_TRACKS.find((t) => t.id === id);
      if (!item) return; // Unknown/reward IDs cannot select or open detailed artwork.
      if (target.dataset.equip) {
        if (options.locked()) {
          status.textContent = "Selection locked until the current races end.";
          return;
        }
        const saved =
          kind === "cars" && isKartId(id)
            ? options.equipKart(id)
            : kind === "tracks" && isTrackId(id)
              ? options.equipTrack(id)
              : false;
        main.querySelectorAll<HTMLElement>("[data-item]").forEach((card) => {
          const chosen = card.dataset.item === id;
          card.dataset.selected = String(chosen);
          const button = card.querySelector<HTMLButtonElement>("[data-equip]")!;
          button.setAttribute("aria-pressed", String(chosen));
          button.textContent = chosen ? "Selected" : "Select";
          button.classList.toggle("button--primary", chosen);
          button.classList.toggle("button--secondary", !chosen);
        });
        status.textContent = `${item.name} selected for every new race. ${saved ? "Saved on this browser." : "Applied for this visit; browser storage is unavailable."}`;
        return;
      }
      stopPreview();
      detail.innerHTML = `<p class="eyebrow">${kind === "cars" ? "YOUR RIDE" : "YOUR CIRCUIT"}</p><h2 id="collection-detail-title">${item.name}</h2>${"file" in item ? `<img class="collection-detail-car" src="${import.meta.env.BASE_URL}assets/karts/${item.file}" alt="${item.name} — ${item.style}"/><p>${item.style} · Cosmetic only, equal performance.</p>` : `<p>${item.setting}</p><div id="collection-track-preview" class="track-preview" role="img" aria-label="${item.name} circuit with your selected car"></div><p id="collection-preview-status" role="status">Preparing circuit…</p><button id="collection-preview-retry" class="text-button" hidden>Retry preview</button>`}`;
      dialog.showModal();
      if (kind === "tracks" && isTrackId(id)) {
        const host = detail.querySelector<HTMLElement>(
          "#collection-track-preview",
        )!;
        const message = detail.querySelector<HTMLElement>(
          "#collection-preview-status",
        )!;
        const retry = detail.querySelector<HTMLButtonElement>(
          "#collection-preview-retry",
        )!;
        const mount = () => {
          stopPreview();
          const token = generation;
          host.replaceChildren();
          message.textContent = "Preparing circuit…";
          retry.hidden = true;
          mountTrackPreview(host, {
            playerKart: options.kart(),
            track: id,
            reducedMotion: options.reducedMotion(),
            effects: options.effects(),
            onReady: () => {
              if (token === generation) message.textContent = "";
            },
            onError: (text) => {
              if (token === generation) {
                message.textContent = text;
                retry.hidden = false;
              }
            },
          })
            .then((dispose) => {
              if (token !== generation) dispose();
              else disposePreview = dispose;
            })
            .catch(() => {
              if (token === generation) {
                message.textContent = "Circuit could not load. Try again.";
                retry.hidden = false;
              }
            });
        };
        retry.addEventListener("click", mount, { signal: abort.signal });
        mount();
      }
    },
    { signal: abort.signal },
  );
  return () => {
    stopPreview();
    abort.abort();
    if (dialog.open) dialog.close();
  };
}
