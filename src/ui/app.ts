import { keyboardScreen, connectKeyboard } from "./keyboard-check";
import {
  readCampaignRoute,
  campaignLevel,
  campaignBonus,
  campaignLink,
} from "../content/campaign";
import { isUnlocked, starCount } from "../core/campaign-progress";
import {
  LocalCampaignRepository,
  CAMPAIGN_STORAGE_KEY,
} from "../storage/campaign";
import {
  campaignCards,
  campaignMapScreen,
  connectCampaignMap,
} from "./campaign-map";
import { createCampaignRaceSession, type QuickRaceSession } from "./quick-race";
import type { CpuTier } from "../core/cpu-schedule";
import {
  LocalOnboardingRepository,
  type OnboardingPreferences,
} from "../storage/onboarding";
import {
  entranceScreen,
  connectEntrance,
  welcomeScreen,
  rulesScreen,
} from "./entrance";
import { learningScreen, connectLearning } from "./driving-lessons";
import { collectionScreen, connectCollection } from "./collection";
import { trackTheme, type TrackId } from "../content/track-catalog";
import { LocalTrackRepository } from "../storage/tracks";
import { animate, createScope } from "animejs";
import { RaceAudio } from "../audio/race-audio";
import { audioControls, connectAudioControls } from "./audio-controls";
import { APP_VERSION } from "../config/versions";
import { connectFullscreen, fullscreenControl } from "./fullscreen";
import { STARTER_KARTS, type KartId } from "../content/kart-catalog";
import { LocalGarageRepository } from "../storage/garage";
import {
  LocalSettingsRepository,
  type UserSettings,
} from "../storage/settings";
import { parseRoute } from "./router";
import { mountTrackPreview } from "../game/track-preview";
import {
  createPracticeSession,
  practiceScreen,
  connectTypingPractice,
} from "./typing-practice";
import {
  createQuickRaceSession,
  applyQuickRacePace,
  quickRaceScreen,
  connectQuickRace,
} from "./quick-race";

const ARROW = '<span aria-hidden="true">↗</span>';

export function mountApp(root: HTMLElement): () => void {
  const repository = new LocalSettingsRepository(() => localStorage);
  let settings = repository.load();
  const garage = new LocalGarageRepository(() => localStorage);
  let selectedKart = garage.load();
  const tracks = new LocalTrackRepository(() => localStorage);
  let selectedTrack = tracks.load();
  const audio = new RaceAudio();
  const campaign = new LocalCampaignRepository(() => localStorage);
  let campaignSession: QuickRaceSession | undefined;
  let forceCampaignStart = false;
  let launchCampaign = false;
  const equipmentLocked = () =>
    [quickRaceSession, campaignSession].some(
      (session) =>
        session &&
        ["countdown", "racing", "paused"].includes(
          session.race.snapshot().player.state,
        ),
    );
  let unlockedNode: { category: string; number: number } | undefined;
  const campaignResults = new WeakMap<object, string>();
  const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let scope: ReturnType<typeof createScope> | undefined;
  let unmountPreview: (() => void) | undefined;
  let clearScreen: (() => void) | undefined;
  let generation = 0;
  const practiceSession = createPracticeSession();
  const onboarding = new LocalOnboardingRepository(() => localStorage);
  let learning = onboarding.load();
  const saveLearning = (patch: Partial<OnboardingPreferences>) => {
    learning = { ...learning, ...patch };
    return onboarding.save(learning);
  };
  const quickRaceSession = createQuickRaceSession(learning.preferredPace);
  let pendingPace: CpuTier | undefined;
  if (["", "#", "#/"].includes(location.hash))
    history.replaceState(null, "", learning.skipIntro ? "#/hub" : "#/intro");
  const reducedMotion = () =>
    settings.motion === "reduced" ||
    (settings.motion === "system" && systemMotion.matches);

  root.innerHTML = `
    <div class="world-backdrop" aria-hidden="true"><div class="world-moon"></div><div class="world-mountains"></div><div class="world-city"></div><div class="world-grid"></div></div>${fullscreenControl()}<div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="#/hub" aria-label="TurboType home"><img src="${import.meta.env.BASE_URL}assets/brand-mark.svg" width="34" height="34" alt="" />TURBO<span>TYPE</span></a>
        <nav aria-label="Main navigation"><a href="#/hub" data-route="hub">The hub</a><a href="#/race" data-route="race">Quick Race</a><a href="#/cars" data-route="cars">Cars</a><a href="#/tracks" data-route="tracks">Tracks</a><a href="#/practice" data-route="practice">Practice</a><a href="#/keyboard" data-route="keyboard">Keyboard check</a><a href="#/settings" data-route="settings">Settings</a></nav>
        <span class="guest"><span class="status-dot"></span> GUEST DRIVER</span>
      </header>
      <main id="main" tabindex="-1"></main>
      <footer class="footer"><span><b>TURBOTYPE</b> / BUILT FOR THE LONG RUN</span><span>Single-player race preview · ${APP_VERSION}</span><a href="https://github.com/sahilshah2904/TurboType" target="_blank" rel="noopener noreferrer">Follow development ${ARROW}</a></footer>
    </div>`;
  const main = root.querySelector<HTMLElement>("main")!;
  const clearFullscreen = connectFullscreen(root);

  function applyPreferences(): void {
    document.documentElement.dataset.effects = settings.effects;
    document.documentElement.dataset.motion = reducedMotion()
      ? "reduced"
      : "full";
    document.documentElement.dataset.textSize = settings.largeText
      ? "large"
      : "standard";
  }

  function render(): void {
    const currentGeneration = ++generation;
    clearScreen?.();
    clearScreen = undefined;
    scope?.revert();
    unmountPreview?.();
    unmountPreview = undefined;
    const route = parseRoute(location.hash);
    const campaignRoute = readCampaignRoute(location.hash);
    if (["campaign", "hub", "cars", "tracks"].includes(route))
      campaign.reload();
    const selectedLevel = campaignRoute?.number
      ? campaignRoute.bonus
        ? campaignBonus(campaignRoute.category, campaignRoute.number)
        : campaignLevel(campaignRoute.category, campaignRoute.number)
      : undefined;
    if (
      route === "level" &&
      selectedLevel?.passage &&
      isUnlocked(campaign.read(), selectedLevel) &&
      (forceCampaignStart ||
        campaignSession?.campaign?.level.id !== selectedLevel.id)
    ) {
      forceCampaignStart = false;
      campaignSession?.race.abandon();
      campaignSession = createCampaignRaceSession(
        selectedLevel,
        selectedTrack,
        (snapshot) => {
          const previous = campaignResults.get(campaignSession!.race);
          if (previous) return previous;
          const result = campaign.finish(selectedLevel, snapshot);
          if (
            result.newlyCleared &&
            selectedLevel.kind === "main" &&
            selectedLevel.number < 100
          )
            unlockedNode = {
              category: selectedLevel.category,
              number: selectedLevel.number + 1,
            };
          const recorded = result.accepted
            ? `${starCount((selectedLevel.kind === "bonus" ? result.progress.bonuses : result.progress.clears)[selectedLevel.id].stars)} / 3 stars · ${result.newlyCleared ? (selectedLevel.kind === "bonus" ? "Bonus cleared." : "Level cleared.") : "Replay complete."} ${result.saved ? "Map progress saved on this browser." : "Progress lasts for this visit only; browser storage is unavailable."}${selectedLevel.kind === "main" && selectedLevel.number === 100 ? " Category complete! Replay any level or try another category." : ""}`
            : "Practice finish · no stars or unlock. Retry without pausing or assisted input for an eligible clear.";
          campaignResults.set(campaignSession!.race, recorded);
          return recorded;
        },
      );
    }
    const levelAllowed =
      !!selectedLevel?.passage && isUnlocked(campaign.read(), selectedLevel);
    const activeSession =
      route === "level" && levelAllowed ? campaignSession! : quickRaceSession;
    document.documentElement.dataset.route = route;
    main.classList.remove(
      "quick-race-active",
      "practice-active",
      "learning-active",
    );
    audio.setScene("menu");
    applyPreferences();
    root.querySelectorAll<HTMLElement>("[data-route]").forEach((link) => {
      if (link.dataset.route === route)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = `TurboType — ${{ hub: "Your words. Full throttle.", cars: "Your cars", tracks: "Your tracks", intro: "Enter TurboType", welcome: "Welcome", rules: "How to play", tutorial: "Guided tutorial", calibration: "Find your starting pace", race: "Quick Race", practice: "Typing practice", keyboard: "Keyboard check", settings: "Settings", campaign: "Campaign map", level: "Campaign race" }[route]}`;
    main.innerHTML =
      route === "intro"
        ? entranceScreen(selectedKart)
        : route === "welcome"
          ? welcomeScreen(learning)
          : route === "rules"
            ? rulesScreen()
            : route === "tutorial" || route === "calibration"
              ? learningScreen(route)
              : route === "hub"
                ? hubScreen(selectedKart, selectedTrack, campaign.read())
                : route === "cars" || route === "tracks"
                  ? collectionScreen(
                      route,
                      selectedKart,
                      selectedTrack,
                      equipmentLocked(),
                    )
                  : route === "campaign" && campaignRoute
                    ? campaignMapScreen(
                        campaignRoute.category,
                        campaign.read(),
                        unlockedNode?.category === campaignRoute.category
                          ? unlockedNode.number
                          : undefined,
                      )
                    : route === "level" && !levelAllowed
                      ? `<section class="page-heading campaign-unavailable"><h1>Road not open yet.</h1><p>${selectedLevel && !isUnlocked(campaign.read(), selectedLevel) ? `Clear ${selectedLevel.category} level ${selectedLevel.kind === "bonus" ? selectedLevel.number : selectedLevel.number - 1} first.` : "Choose a valid campaign event."}</p><a class="button button--primary" href="#/campaign/${campaignRoute?.category ?? "easy"}">Return to map</a></section>`
                      : route === "race" || route === "level"
                        ? quickRaceScreen(
                            activeSession.race.snapshot().player.state ===
                              "ready"
                              ? selectedKart
                              : (activeSession.kartId ?? selectedKart),
                            activeSession.race.snapshot().player.state ===
                              "ready"
                              ? selectedTrack
                              : activeSession.trackId,
                            route === "level" ? selectedLevel : undefined,
                          )
                        : route === "practice"
                          ? practiceScreen()
                          : route === "keyboard"
                            ? keyboardScreen()
                            : settingsScreen(settings, learning);
    scope = createScope({ root: main }).add(() => {
      if (!reducedMotion())
        animate(".reveal", {
          opacity: [0, 1],
          y: [14, 0],
          duration: 550,
          delay: (_el, i) => (i ?? 0) * 65,
          ease: "out(3)",
        });
    });
    if (route === "intro")
      clearScreen = connectEntrance(
        main,
        selectedKart,
        () => learning,
        () => {
          void audio.unlock().then((ok) => {
            if (ok) audio.cue("go");
          });
        },
      );
    if (route === "welcome") {
      main
        .querySelector<HTMLInputElement>("#welcome-skip-intro")!
        .addEventListener("change", (event) => {
          const saved = saveLearning({
            skipIntro: (event.target as HTMLInputElement).checked,
          });
          main.querySelector("#welcome-save-status")!.textContent = saved
            ? "Opening preference saved on this browser."
            : "Applied for this visit; browser storage is unavailable.";
        });
      for (const id of ["#welcome-rules", "#welcome-hub"])
        main.querySelector(id)!.addEventListener("click", () => {
          saveLearning({ welcomeSeen: true });
        });
    }
    if (route === "tutorial" || route === "calibration")
      clearScreen = connectLearning(main, {
        kind: route,
        preferred: learning.preferredPace,
        completed: () =>
          saveLearning({ tutorialComplete: true, welcomeSeen: true }),
        applyPace: (tier, sample) => {
          const saved = saveLearning({
            preferredPace: tier,
            ...(sample ? { calibration: sample } : {}),
          });
          const applied = applyQuickRacePace(quickRaceSession, tier);
          pendingPace = applied ? undefined : tier;
          return { saved, applied };
        },
      });
    if (route === "hub") {
      const track = main.querySelector<HTMLElement>("#track-preview")!;
      const message = main.querySelector<HTMLElement>("#track-status")!;
      const mount = () => {
        track.removeAttribute("data-ready");
        main.querySelector("#retry-preview")?.setAttribute("hidden", "");
        message.textContent = "Preparing your circuit…";
        mountTrackPreview(track, {
          reducedMotion: reducedMotion(),
          effects: settings.effects,
          playerKart: selectedKart,
          track: selectedTrack,
          onReady: () => {
            if (currentGeneration === generation) {
              message.textContent = "";
              main.querySelector("#retry-preview")?.setAttribute("hidden", "");
            }
          },
          onError: (text) => {
            if (currentGeneration === generation) {
              message.textContent = text;
              main.querySelector("#retry-preview")?.removeAttribute("hidden");
            }
          },
        })
          .then((dispose) => {
            if (currentGeneration !== generation) dispose();
            else unmountPreview = dispose;
          })
          .catch(() => {
            if (currentGeneration === generation) {
              message.textContent =
                "The track could not start. You can still check your keyboard or change settings.";
              main.querySelector("#retry-preview")?.removeAttribute("hidden");
            }
          });
      };
      mount();
      main.querySelector("#retry-preview")?.addEventListener("click", () => {
        unmountPreview?.();
        track.replaceChildren();
        mount();
      });
    }
    if (route === "campaign" && campaignRoute) {
      clearScreen = connectCampaignMap(
        main,
        campaignRoute.category,
        campaign,
        {
          kart: () => selectedKart,
          track: () => selectedTrack,
        },
        (level) => {
          forceCampaignStart = true;
          launchCampaign = true;
          void audio.unlock();
          location.hash = campaignLink(level);
        },
        unlockedNode?.category === campaignRoute.category
          ? unlockedNode.number
          : undefined,
      );
      unlockedNode = undefined;
    }
    if (route === "cars" || route === "tracks")
      clearScreen = connectCollection(main, route, {
        kart: () => selectedKart,
        track: () => selectedTrack,
        locked: equipmentLocked,
        equipKart: (id) => {
          if (equipmentLocked()) return false;
          selectedKart = id;
          return garage.save(id);
        },
        equipTrack: (id) => {
          if (equipmentLocked()) return false;
          selectedTrack = id;
          return tracks.save(id);
        },
        endRaces: () => {
          for (const session of [quickRaceSession, campaignSession])
            if (
              session &&
              ["countdown", "racing", "paused"].includes(
                session.race.snapshot().player.state,
              )
            )
              session.race.abandon();
          render();
        },
        reducedMotion,
        effects: () => settings.effects,
      });
    if (route === "keyboard") clearScreen = connectKeyboard(main);
    if (route === "practice")
      clearScreen = connectTypingPractice(main, practiceSession);
    if (route === "race" || (route === "level" && levelAllowed))
      clearScreen = connectQuickRace(
        main,
        activeSession,
        reducedMotion,
        () => settings.effects,
        audio,
        {
          read: () => selectedKart,
        },
        {
          read: () => selectedTrack,
        },
        () => {
          const pace = pendingPace;
          pendingPace = undefined;
          return pace;
        },
        route === "level" && launchCampaign,
      );
    launchCampaign = false;
    if (route === "settings") {
      clearScreen = connectAudioControls(main, audio);
      main
        .querySelector<HTMLInputElement>("#skip-opening")!
        .addEventListener("change", (event) => {
          const saved = saveLearning({
            skipIntro: (event.target as HTMLInputElement).checked,
          });
          main.querySelector("#opening-save-status")!.textContent = saved
            ? "Opening preference saved on this browser."
            : "Applied for this visit; browser storage is unavailable.";
        });
      main.querySelector("form")!.addEventListener("change", () => {
        const form = new FormData(main.querySelector("form")!);
        settings = {
          motion: form.get("motion") as UserSettings["motion"],
          effects: form.get("effects") as UserSettings["effects"],
          largeText: form.get("largeText") === "on",
        };
        const saved = repository.save(settings);
        applyPreferences();
        if (reducedMotion()) scope?.revert();
        main.querySelector("#save-status")!.textContent = saved
          ? "Preferences saved on this browser."
          : "Preferences applied for this visit. Browser storage is unavailable.";
      });
    }
  }

  const onNavigate = () => {
    render();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  };
  const onMotion = () => {
    if (settings.motion === "system") {
      if (parseRoute(location.hash) === "hub") render();
      else applyPreferences();
    }
  };
  const onCampaignStorage = (event: StorageEvent) => {
    if (
      event.key === CAMPAIGN_STORAGE_KEY &&
      ["campaign", "hub"].includes(parseRoute(location.hash))
    )
      render();
  };
  window.addEventListener("storage", onCampaignStorage);
  window.addEventListener("hashchange", onNavigate);
  const audioBlur = () => audio.setVisible(false);
  const audioFocus = () => audio.setVisible(!document.hidden);
  const audioVisibility = () => audio.setVisible(!document.hidden);
  window.addEventListener("blur", audioBlur);
  window.addEventListener("focus", audioFocus);
  document.addEventListener("visibilitychange", audioVisibility);
  systemMotion.addEventListener("change", onMotion);
  const skipLink = document.querySelector<HTMLAnchorElement>(".skip-link");
  const skip = (event: Event) => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
  };
  skipLink?.addEventListener("click", skip);
  render();
  return () => {
    generation++;
    clearScreen?.();
    scope?.revert();
    unmountPreview?.();
    audio.dispose();
    clearFullscreen();
    delete document.documentElement.dataset.route;
    window.removeEventListener("blur", audioBlur);
    window.removeEventListener("focus", audioFocus);
    document.removeEventListener("visibilitychange", audioVisibility);
    window.removeEventListener("hashchange", onNavigate);
    window.removeEventListener("storage", onCampaignStorage);
    systemMotion.removeEventListener("change", onMotion);
    skipLink?.removeEventListener("click", skip);
    root.replaceChildren();
  };
}

function hubScreen(
  selectedKart: KartId,
  selectedTrack: TrackId,
  progress: import("../core/campaign-progress").CampaignProgress,
): string {
  const kart = STARTER_KARTS.find((kart) => kart.id === selectedKart)!;
  return `
    <section class="hero reveal" aria-labelledby="hero-title">
      <div><p class="eyebrow"><span class="status-dot"></span> FIND YOUR RHYTHM. OWN THE ROAD.</p><h1 id="hero-title">YOUR WORDS.<br /><span>FULL THROTTLE.</span></h1><p class="hero-copy">Turn every keystroke into momentum.<br />Take on four CPUs. Build clean speed.</p><a class="button button--primary" href="#/race">Start a race ${ARROW}</a><div class="onboarding-links"><a href="#/rules">How to play</a><a href="#/tutorial">Guided tutorial</a><a href="#/calibration">Find my pace</a></div></div>
      <aside class="hero-note"><span class="garage-label">${kart.name.toUpperCase()} / YOUR STARTING LINE</span><img class="garage-kart ${kart.id === "volt-kart" ? "kart-art--starter" : ""}" src="${import.meta.env.BASE_URL}assets/karts/${kart.file}" alt="${kart.name} — ${kart.style}" /><span>Four opponents. One passage.<br />Your pace sets your progress.</span><a class="button button--secondary" href="#/cars">Choose car →</a></aside>
    </section>
    <section class="track-card reveal" aria-label="Animated track preview">
      <div class="section-top"><span class="eyebrow"><span class="status-dot"></span> YOUR CIRCUIT</span><span>${trackTheme(selectedTrack).name} · <a href="#/tracks">Choose track →</a></span></div>
      <div id="track-preview" class="track-preview" role="img" aria-label="Your selected kart on an illustrated city road, with two decorative rival karts"></div>
      <div class="track-bottom"><span id="track-status" role="status">Preparing your circuit…</span><button id="retry-preview" class="text-button" hidden>Retry preview</button></div>
    </section>
    <section class="campaign-section reveal" aria-labelledby="campaign-heading"><div class="section-heading"><div><p class="eyebrow">THREE GEARS. ONE JOURNEY.</p><h2 id="campaign-heading">Find your starting line.</h2></div><span class="pill">CHOOSE YOUR JOURNEY</span></div><div class="campaign-grid">
      ${campaignCards(progress)}
    </div></section>
    <div class="development-note reveal"><span class="note-icon" aria-hidden="true">↳</span><p><strong>A strong start, built one lap at a time.</strong> Explore 100 levels and 10 optional challenges in each category, from short starts to sustained paragraphs. Rewards and cloud saves are still being built.</p><a href="#/keyboard">Try the input check →</a></div>`;
}

function settingsScreen(
  settings: UserSettings,
  learning: OnboardingPreferences,
): string {
  return `<section class="page-heading reveal"><a class="back-link" href="#/hub">← Back to the hub</a><p class="eyebrow">MAKE IT YOUR OWN</p><h1>Your ride.<br /><span>Your settings.</span></h1><p>Comfort first. Find the setup that works for you.</p></section><section class="settings-panel reveal"><form><div class="setting-row"><div><label for="motion">Motion</label><p>Choose how much the track and interface move.</p></div><select name="motion" id="motion">${[
    ["system", "Follow device"],
    ["reduced", "Reduced motion"],
    ["full", "Full motion"],
  ]
    .map(
      ([value, text]) =>
        `<option value="${value}" ${settings.motion === value ? "selected" : ""}>${text}</option>`,
    )
    .join(
      "",
    )}</select></div><div class="setting-row"><div><label for="effects">Track effects</label><p>Use fewer particles for a lighter ride.</p></div><select name="effects" id="effects"><option value="high" ${settings.effects === "high" ? "selected" : ""}>High</option><option value="low" ${settings.effects === "low" ? "selected" : ""}>Low</option></select></div><div class="setting-row"><div><label for="large-text">Larger typing text</label><p>Make passages and typing easier to read.</p></div><input type="checkbox" name="largeText" id="large-text" ${settings.largeText ? "checked" : ""} /></div></form><p id="save-status" class="help" role="status">Preferences are stored on this browser. Cloud saves are not available in this preview.</p>${audioControls()}<section class="opening-settings" aria-labelledby="opening-settings-title"><h2 id="opening-settings-title">Opening & learning</h2><label class="guide-check"><input type="checkbox" id="skip-opening" ${learning.skipIntro ? "checked" : ""}/>Skip opening next time</label><p id="opening-save-status" class="help" role="status">${learning.tutorialComplete ? "Tutorial completed. Replay anytime." : "Tutorial is optional and can be replayed anytime."}</p><div class="setting-row"><div><span class="setting-label">Replay opening</span><p>Watch the TurboType title sequence again.</p></div><a class="button button--secondary" href="#/intro">Replay opening</a></div><div class="setting-row"><div><span class="setting-label">Welcome</span><p>Return to your starting line.</p></div><a class="button button--secondary" href="#/welcome">Welcome</a></div><div class="setting-row"><div><span class="setting-label">How to play</span><p>Read the racing rules and controls.</p></div><a class="button button--secondary" href="#/rules">How to play</a></div><div class="setting-row"><div><span class="setting-label">Replay tutorial</span><p>Practice matching, correcting and building a clean streak.</p></div><a class="button button--secondary" href="#/tutorial">Replay tutorial</a></div><div class="setting-row"><div><span class="setting-label">Recalibrate pace</span><p>Try a thirty-second sample or choose CPU pace manually.</p></div><a class="button button--secondary" href="#/calibration">Recalibrate pace</a></div></section></section>`;
}
