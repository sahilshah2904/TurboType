/** Keep the active race above an OS keyboard without resetting input or race state. */
export function connectViewport(): () => void {
  const viewport = window.visualViewport;
  const update = () => {
    document.documentElement.dataset.compactViewport = String(
      (viewport?.height ?? innerHeight) < 550,
    );
    document.documentElement.style.setProperty(
      "--visible-height",
      `${viewport?.height ?? innerHeight}px`,
    );
    document.documentElement.style.setProperty(
      "--visible-top",
      `${viewport?.offsetTop ?? 0}px`,
    );
  };
  viewport?.addEventListener("resize", update);
  viewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
  return () => {
    viewport?.removeEventListener("resize", update);
    viewport?.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    document.documentElement.style.removeProperty("--visible-height");
    document.documentElement.style.removeProperty("--visible-top");
    delete document.documentElement.dataset.compactViewport;
  };
}
