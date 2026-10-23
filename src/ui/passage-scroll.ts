/** Keep the active wrapped line at the top, with upcoming lines below it. */
export function followPassageCaret(
  passage: HTMLElement,
  caret: HTMLElement | undefined | null,
  wrapped: boolean,
  horizontalAnchor = 0.3,
): void {
  if (!caret) return;
  if (wrapped) {
    passage.scrollLeft = 0;
    const first = passage.firstElementChild as HTMLElement | null;
    passage.scrollTop = Math.max(0, caret.offsetTop - (first?.offsetTop ?? 0));
  } else {
    passage.scrollTop = 0;
    passage.scrollLeft = Math.max(
      0,
      caret.offsetLeft - passage.clientWidth * horizontalAnchor,
    );
  }
}
