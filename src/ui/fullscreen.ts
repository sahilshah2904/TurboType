const ENTER = "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5";
const EXIT = "M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5";
export function fullscreenControl(): string {
  return `<button id="app-fullscreen" class="fullscreen-control" type="button" aria-label="Enter fullscreen" aria-pressed="false" title="Enter fullscreen"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${ENTER}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button><p id="fullscreen-feedback" class="fullscreen-feedback" role="status" hidden></p>`;
}
/** App-owned, so route changes never replace the control or accumulate listeners. */
export function connectFullscreen(root: HTMLElement): () => void {
  const button = root.querySelector<HTMLButtonElement>("#app-fullscreen")!;
  const feedback = root.querySelector<HTMLElement>("#fullscreen-feedback")!;
  const abort = new AbortController();
  const sync = () => {
    const active = Boolean(document.fullscreenElement);
    const label = active ? "Exit fullscreen" : "Enter fullscreen";
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(active));
    button.title = label;
    button.querySelector("path")!.setAttribute("d", active ? EXIT : ENTER);
  };
  button.addEventListener(
    "click",
    async () => {
      feedback.hidden = true;
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch {
        feedback.textContent =
          "Fullscreen is unavailable in this browser window. You can continue normally.";
        feedback.hidden = false;
      }
      sync();
    },
    { signal: abort.signal },
  );
  document.addEventListener("fullscreenchange", sync, { signal: abort.signal });
  sync();
  return () => abort.abort();
}
