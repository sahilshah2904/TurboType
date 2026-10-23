import {
  CATEGORY_NAMES,
  CATEGORIES,
  DISTRICTS,
  categoryLevels,
  campaignLevel,
  campaignBonus,
  type Category,
  type CampaignLevel,
} from "../content/campaign";
import {
  categorySummary,
  currentLevel,
  isUnlocked,
  starCount,
  type CampaignProgress,
} from "../core/campaign-progress";
import type { LocalCampaignRepository } from "../storage/campaign";
import { STARTER_KARTS, isKartId, type KartId } from "../content/kart-catalog";
import {
  STARTER_TRACKS,
  isTrackId,
  type TrackId,
} from "../content/track-catalog";

const escapePassage = (text: string) =>
  text.replace(
    /[&<>]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]!,
  );
const SPACING = 156;
const WIDTH = 15900;
function point(number: number) {
  return {
    x: 150 + (number - 1) * SPACING,
    y: [180, 135, 180, 225, 180, 135, 180, 225, 180, 135][(number - 1) % 10],
  };
}
function stars(bits = 0) {
  return "★".repeat(starCount(bits)) + "☆".repeat(3 - starCount(bits));
}
function nodeStatus(progress: CampaignProgress, level: CampaignLevel): string {
  return progress.clears[level.id]
    ? "Completed"
    : level.number === currentLevel(progress, level.category)
      ? "Current"
      : isUnlocked(progress, level)
        ? "Available"
        : "Locked";
}
export function campaignCards(progress: CampaignProgress): string {
  return CATEGORIES.map((category, i) => {
    const summary = categorySummary(progress, category);
    return `<article class="campaign-card campaign-card--${["green", "orange", "purple"][i]}"><p class="eyebrow">GEAR 0${i + 1}</p><h3>${CATEGORY_NAMES[category]}</h3><p>${["Find a calm rhythm. Common words and longer lowercase paragraphs.", "Build your flow through capitals, commas and sustained prose.", "Stay precise through quotes, numerals and demanding paragraphs."][i]}</p><p>${summary.cleared}/100 cleared · ${summary.stars}/300 stars</p><a class="button button--primary" href="#/campaign/${category}">Continue ${CATEGORY_NAMES[category]} →</a></article>`;
  }).join("");
}
export function campaignMapScreen(
  category: Category,
  progress: CampaignProgress,
  unlocked?: number,
): string {
  const summary = categorySummary(progress, category);
  const levels = categoryLevels(category);
  const path = levels
    .map((level, i) => {
      const p = point(level.number);
      const prev = point(Math.max(1, level.number - 1));
      return i === 0
        ? `M ${p.x} ${p.y}`
        : `C ${prev.x + SPACING / 2} ${prev.y}, ${p.x - SPACING / 2} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");
  const reachable = levels.slice(0, currentLevel(progress, category));
  const reachedPath = reachable
    .map((level, i) => {
      const p = point(level.number),
        prev = point(Math.max(1, level.number - 1));
      return i === 0
        ? `M ${p.x} ${p.y}`
        : `C ${prev.x + SPACING / 2} ${prev.y}, ${p.x - SPACING / 2} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");
  const p = point(unlocked ?? 1),
    prev = point(Math.max(1, (unlocked ?? 1) - 1));
  const unlockPath = `M ${prev.x} ${prev.y} C ${prev.x + SPACING / 2} ${prev.y}, ${p.x - SPACING / 2} ${p.y}, ${p.x} ${p.y}`;
  return `<section class="campaign-page"><a class="back-link" href="#/hub">← All campaigns</a><div class="campaign-heading"><div><p class="eyebrow">YOUR NEXT STRETCH OF ROAD</p><h1>${CATEGORY_NAMES[category]} <span>journey.</span></h1><p>${summary.cleared}/100 cleared · ${summary.stars}/300 stars · Current level ${currentLevel(progress, category)}</p></div><nav aria-label="Campaign categories">${CATEGORIES.map((c) => `<a href="#/campaign/${c}" ${category === c ? 'aria-current="page"' : ""}>${CATEGORY_NAMES[c]}</a>`).join("")}</nav></div><progress max="100" value="${summary.cleared}" aria-label="${CATEGORY_NAMES[category]} levels cleared"></progress><p class="help">100 playable levels and 10 optional chapter challenges. Only the first few races are short; later routes build sustained paragraph practice.</p>
  <div class="map-toolbar"><button id="map-current" class="button button--primary">Continue · level ${currentLevel(progress, category)}</button><button id="map-jump-current" class="button button--secondary">Jump to current</button><label>Chapter <select id="map-chapter">${DISTRICTS.map((name, i) => `<option value="${i + 1}">${i + 1} · ${name}</option>`).join("")}</select></label><button id="map-previous" class="text-button" aria-label="Previous chapter">←</button><button id="map-next" class="text-button" aria-label="Next chapter">→</button><label>Level <input id="map-number" type="number" min="1" max="100" value="1" /></label><button id="map-go" class="text-button">Go</button><button id="map-view" class="button button--secondary" aria-pressed="false">List view</button></div>
  <p class="help" id="map-help">Drag the road or use the scrollbar. On a level: arrow keys move, Home/End jump, Enter opens its briefing. Locks cannot be skipped.</p><p id="map-feedback" role="status">${unlocked ? `Level ${unlocked} unlocked. Keep your rhythm.` : "Choose a numbered stop to see its briefing."}</p>
  <div id="campaign-road" class="campaign-road" tabindex="0" role="region" aria-label="${CATEGORY_NAMES[category]} rightward campaign map" aria-describedby="map-help"><div class="campaign-world" style="width:${WIDTH}px"><div class="map-districts" aria-hidden="true">${DISTRICTS.map((name, i) => `<div class="map-district" data-chapter="${i + 1}" style="left:${i * SPACING * 10}px;width:${SPACING * 10}px"><span>${String(i + 1).padStart(2, "0")} / ${name}</span></div>`).join("")}</div><svg class="map-road-art" width="${WIDTH}" height="330" aria-hidden="true"><path d="${path}" class="map-road-edge"/><path d="${path}" class="map-road-line"/><path d="${reachedPath}" class="map-road-reached"/>${unlocked ? `<path d="${unlockPath}" pathLength="1" class="map-road-unlock"/>` : ""}</svg>
  ${levels
    .map((level) => {
      const p = point(level.number);
      const status = nodeStatus(progress, level);
      return `<button class="map-node map-node--${status.toLowerCase()} ${unlocked === level.number ? "map-node--unlock" : ""}" data-level="${level.number}" style="left:${p.x}px;top:${p.y}px" aria-label="${CATEGORY_NAMES[category]} level ${level.number}, ${status}, ${starCount(progress.clears[level.id]?.stars ?? 0)} stars${status === "Locked" ? `, clear level ${level.number - 1} to unlock` : ""}" ${status === "Current" ? 'aria-current="step"' : ""}><span class="map-node-state" aria-hidden="true">${status === "Completed" ? "✓" : status === "Locked" ? '<svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="10" height="8" rx="2"/><path d="M5 8V5a3 3 0 0 1 6 0v3"/></svg>' : status === "Current" ? "▼" : "○"}</span><strong>${level.number}</strong><span class="map-node-stars" aria-hidden="true">${stars(progress.clears[level.id]?.stars)}</span></button>`;
    })
    .join("")}
  ${DISTRICTS.map((_, i) => {
    const p = point(i * 10 + 10);
    return `<div class="map-bonus-branch" style="left:${p.x}px;top:${p.y + 52}px"><i></i><button class="map-bonus" data-bonus="${i + 1}" aria-label="Chapter ${i + 1} optional bonus, clear level ${i * 10 + 10}${progress.bonuses[campaignBonus(category, i + 1)!.id] ? ", completed" : ""}">${progress.bonuses[campaignBonus(category, i + 1)!.id] ? "✓" : "◇"} Bonus ${i + 1}</button></div>`;
  }).join("")}
  </div></div>
  <div id="campaign-list" class="campaign-list" hidden>${levels.map((level) => `<button class="button button--secondary" data-level="${level.number}">Level ${level.number} · ${nodeStatus(progress, level)} · ${stars(progress.clears[level.id]?.stars)}</button>`).join("")}</div>
  <p id="campaign-storage-status" class="help" role="status"></p><button id="campaign-export" class="text-button">Export map progress</button><p class="help">Local map progress only. Rewards, ownership, complete backups and cloud saves arrive in Phase 9.</p>
  <dialog id="level-briefing" class="level-briefing" aria-labelledby="briefing-title"><button id="briefing-close" class="text-button" aria-label="Close level briefing">Close ×</button><div id="briefing-content"></div></dialog></section>`;
}
export interface CampaignChoices {
  kart: () => KartId;
  track: () => TrackId;
  chooseKart: (id: KartId) => void;
  chooseTrack: (id: TrackId) => void;
}
export function connectCampaignMap(
  main: HTMLElement,
  category: Category,
  repository: LocalCampaignRepository,
  choices: CampaignChoices,
  launch: (level: CampaignLevel) => void,
  unlocked?: number,
): () => void {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const road = main.querySelector<HTMLElement>("#campaign-road")!;
  const list = main.querySelector<HTMLElement>("#campaign-list")!;
  const chapter = main.querySelector<HTMLSelectElement>("#map-chapter")!;
  const dialog = main.querySelector<HTMLDialogElement>("#level-briefing")!;
  const content = main.querySelector<HTMLElement>("#briefing-content")!;
  const status = main.querySelector<HTMLElement>("#campaign-storage-status")!;
  const progress = repository.read();
  let timer: number | undefined;
  let disposed = false;
  status.textContent = repository.status;
  function jump(number: number, focus = false) {
    if (!list.hidden) {
      const target = list.querySelector<HTMLElement>(
        `[data-level="${number}"]`,
      );
      target?.scrollIntoView({ block: "nearest" });
      if (focus) target?.focus({ preventScroll: true });
      chapter.value = String(Math.floor((number - 1) / 10) + 1);
      return;
    }
    const p = point(number);
    road.scrollLeft = Math.max(0, p.x - road.clientWidth / 2);
    chapter.value = String(Math.floor((number - 1) / 10) + 1);
    if (focus)
      road
        .querySelector<HTMLElement>(`[data-level="${number}"]`)
        ?.focus({ preventScroll: true });
  }
  function open(number: number, bonus = false) {
    const level = bonus
      ? campaignBonus(category, number)
      : campaignLevel(category, number);
    if (!level) return;
    const unlocked = isUnlocked(progress, level);
    const record = (bonus ? progress.bonuses : progress.clears)[level.id];
    const allowed = unlocked && !!level.passage;
    content.innerHTML = `<p class="eyebrow">${CATEGORY_NAMES[category]} · CHAPTER ${level.chapter} · ${bonus ? `BONUS ${number}` : `LEVEL ${number}`}</p><h2 id="briefing-title">${level.title}</h2><p>${level.focus}</p><p class="help">${bonus ? "Optional chapter challenge. Completing it never opens a main level or counts toward car/track milestones." : level.role === "finale" ? "Category finale. Complete the journey; every level remains replayable." : level.role === "showcase" ? "Chapter showcase. Combine the skills from this district." : level.role === "pit-stop" ? "Milestone practice. Keep the same calm correction rules." : "Main route lesson."}</p>${!unlocked ? `<p class="briefing-lock">Locked · Clear ${CATEGORY_NAMES[category]} level ${bonus ? level.number : number - 1} first.</p>` : ""}<p>${level.passage.length} characters · ${level.passage.split(" ").length} words · Untimed</p><div class="briefing-targets"><span>★ Finish unpaused</span><span>★ ${level.accuracyGoal}% accuracy</span><span>★ ${level.paceGoal} WPM</span></div><p class="help">${bonus ? "Finish unpaused to record this optional challenge;" : "Finish unpaused to open the next level;"} extra stars are optional and accumulate across replays. Paused or assisted runs are practice-only.</p><p>Four fixed CPUs · ${level.cpuBand.minWpm}–${level.cpuBand.maxWpm} target WPM</p><p>${record ? `Personal best: ${record.bestWpm.toFixed(1)} WPM · ${record.bestAccuracy.toFixed(1)}% accuracy · ${(record.bestTimeMs / 1000).toFixed(1)}s · ${stars(record.stars)} (bests may come from different runs).` : "First visit · set your best."}</p><details class="passage-preview"><summary>Read passage</summary><p>${escapePassage(level.passage)}</p></details>${allowed ? `<div class="briefing-choices"><label>Your car<select id="briefing-car">${STARTER_KARTS.map((k) => `<option value="${k.id}" ${k.id === choices.kart() ? "selected" : ""}>${k.name}</option>`).join("")}</select></label><label>Your track<select id="briefing-track">${STARTER_TRACKS.map((t) => `<option value="${t.id}" ${t.id === choices.track() ? "selected" : ""}>${t.name}</option>`).join("")}</select></label></div><p class="help">Your cosmetics work across categories and replays. All have equal performance.</p><button id="briefing-start" class="button button--primary">${record ? "Replay" : "Race"} ${bonus ? "bonus" : "level"} ${number} →</button>` : ""}`;
    content.querySelector("#briefing-start")?.addEventListener(
      "click",
      () => {
        // Recheck the actual progress boundary; a link or preview never bypasses locks.
        if (!isUnlocked(repository.read(), level)) return;
        const car =
          content.querySelector<HTMLSelectElement>("#briefing-car")!.value;
        const track =
          content.querySelector<HTMLSelectElement>("#briefing-track")!.value;
        if (!isKartId(car) || !isTrackId(track)) return;
        choices.chooseKart(car);
        choices.chooseTrack(track);
        dialog.close();
        launch(level);
      },
      options,
    );
    if (!dialog.open) dialog.showModal();
  }
  main
    .querySelector("#briefing-close")!
    .addEventListener("click", () => dialog.close(), options);
  // Native dialog close restores focus synchronously; a queued close handler
  // could otherwise steal focus from the next keyboard-selected stop.
  main.addEventListener(
    "click",
    (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-level],[data-bonus]",
      );
      if (!button) return;
      if (button.dataset.level) open(Number(button.dataset.level));
      else open(Number(button.dataset.bonus), true);
    },
    options,
  );
  road.addEventListener(
    "keydown",
    (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-level]",
      );
      if (!button) return;
      const number = Number(button.dataset.level);
      const next =
        event.key === "Home"
          ? 1
          : event.key === "End"
            ? 100
            : ["ArrowRight", "ArrowDown"].includes(event.key)
              ? Math.min(100, number + 1)
              : ["ArrowLeft", "ArrowUp"].includes(event.key)
                ? Math.max(1, number - 1)
                : 0;
      if (next) {
        event.preventDefault();
        jump(next, true);
      }
    },
    options,
  );
  main.querySelector("#map-current")!.addEventListener(
    "click",
    () => {
      jump(currentLevel(progress, category));
      open(currentLevel(progress, category));
    },
    options,
  );
  main
    .querySelector("#map-jump-current")!
    .addEventListener(
      "click",
      () => jump(currentLevel(progress, category), true),
      options,
    );
  chapter.addEventListener(
    "change",
    () => jump((Number(chapter.value) - 1) * 10 + 1),
    options,
  );
  for (const [id, delta] of [
    ["#map-previous", -1],
    ["#map-next", 1],
  ] as const)
    main.querySelector(id)!.addEventListener(
      "click",
      () => {
        chapter.value = String(
          Math.max(1, Math.min(10, Number(chapter.value) + delta)),
        );
        jump((Number(chapter.value) - 1) * 10 + 1);
      },
      options,
    );
  main.querySelector("#map-go")!.addEventListener(
    "click",
    () => {
      const input = main.querySelector<HTMLInputElement>("#map-number")!;
      if (input.reportValidity()) jump(Number(input.value), true);
    },
    options,
  );
  main.querySelector("#map-view")!.addEventListener(
    "click",
    (event) => {
      list.hidden = !list.hidden;
      road.hidden = !road.hidden;
      const button = event.currentTarget as HTMLElement;
      button.setAttribute("aria-pressed", String(!list.hidden));
      button.textContent = list.hidden ? "List view" : "Map view";
    },
    options,
  );
  let pointer:
    { id: number; x: number; scroll: number; dragging: boolean } | undefined;
  road.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) return;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        scroll: road.scrollLeft,
        dragging: false,
      };
    },
    options,
  );
  road.addEventListener(
    "pointermove",
    (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      if (Math.abs(dx) > 8) {
        pointer.dragging = true;
        road.setPointerCapture(event.pointerId);
        road.classList.add("dragging");
      }
      if (pointer.dragging) road.scrollLeft = pointer.scroll - dx;
    },
    options,
  );
  const release = () => {
    if (pointer?.dragging) {
      road.dataset.dragged = "true";
      window.setTimeout(() => delete road.dataset.dragged, 0);
    }
    pointer = undefined;
    road.classList.remove("dragging");
  };
  road.addEventListener("pointerup", release, options);
  road.addEventListener("pointercancel", release, options);
  road.addEventListener(
    "click",
    (event) => {
      if (road.dataset.dragged) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    options,
  );
  const decorations = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (!el.dataset.loaded) {
            el.dataset.loaded = "true";
            const art = document.createElement("div");
            art.className = "map-district-scenery";
            el.append(art);
          }
        }
      }),
    { root: road, rootMargin: "0px 800px" },
  );
  main
    .querySelectorAll(".map-district")
    .forEach((el) => decorations.observe(el));
  const saved = progress.positions[category];
  if (unlocked) jump(unlocked);
  else if (saved === null) jump(currentLevel(progress, category));
  else road.scrollLeft = saved;
  road.addEventListener(
    "scroll",
    () => {
      chapter.value = String(
        Math.max(
          1,
          Math.min(
            10,
            Math.floor(
              (road.scrollLeft + road.clientWidth / 2 - 150 + SPACING / 2) /
                (SPACING * 10),
            ) + 1,
          ),
        ),
      );
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!disposed) {
          repository.position(category, road.scrollLeft);
          status.textContent = repository.status;
        }
      }, 300);
    },
    options,
  );
  main.querySelector("#campaign-export")!.addEventListener(
    "click",
    () => {
      const blob = new Blob([repository.exportRaw()], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "turbotype-map-progress.json";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    options,
  );
  return () => {
    disposed = true;
    window.clearTimeout(timer);
    repository.position(category, road.scrollLeft);
    decorations.disconnect();
    abort.abort();
    if (dialog.open) dialog.close();
  };
}
