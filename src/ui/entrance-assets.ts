import type { KartId } from "../content/kart-catalog";
interface AssetProgress {
  completed: number;
  total: number;
  label: string;
}
/** Actual decode/module readiness, not byte progress. Cancellation owns every image/timer. */
export async function prepareEntrance(
  kart: KartId,
  signal: AbortSignal,
  changed: (progress: AssetProgress) => void,
): Promise<void> {
  let completed = 0;
  const base = import.meta.env.BASE_URL;
  const images = [
    ["TurboType identity", `${base}assets/brand-mark.svg`],
    ["Your car", `${base}assets/karts/parts/${kart}-preview.webp`],
    ["Chassis artwork", `${base}assets/karts/parts/${kart}-body.webp`],
    ["Wheel artwork", `${base}assets/karts/parts/${kart}-wheel.webp`],
  ];
  const total = images.length + 1;
  const ready = (label: string) => {
    if (!signal.aborted) changed({ completed: ++completed, total, label });
  };
  changed({ completed, total, label: "Preparing your starting line" });
  const tasks = images.map(
    ([label, url]) =>
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        const timer = window.setTimeout(
          () => finish(new Error(`${label} took too long to load.`)),
          10000,
        );
        const abort = () => finish(new DOMException("Canceled", "AbortError"));
        let ended = false;
        function finish(error?: Error): void {
          if (ended) return;
          ended = true;
          clearTimeout(timer);
          signal.removeEventListener("abort", abort);
          img.onload = img.onerror = null;
          if (error) {
            img.removeAttribute("src");
            reject(error);
          } else {
            ready(label);
            resolve();
          }
        }
        img.onload = () => {
          void img
            .decode()
            .then(() => finish())
            .catch(() => finish(new Error(`${label} could not be prepared.`)));
        };
        img.onerror = () => finish(new Error(`${label} could not load.`));
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) abort();
        else img.src = url;
      }),
  );
  tasks.push(
    new Promise<void>((resolve, reject) => {
      let ended = false;
      const timer = window.setTimeout(
        () => finish(new Error("Race renderer took too long to load.")),
        10000,
      );
      const abort = () => finish(new DOMException("Canceled", "AbortError"));
      function finish(error?: Error): void {
        if (ended) return;
        ended = true;
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
        if (error) reject(error);
        else {
          ready("Race renderer");
          resolve();
        }
      }
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) abort();
      else
        void import("phaser")
          .then(() => finish())
          .catch(() => finish(new Error("Race renderer could not load.")));
    }),
  );
  await Promise.all(tasks);
}
