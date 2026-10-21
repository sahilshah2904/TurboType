/** Decorative analog dial plus a numeric recent-WPM reading; never drives game rules. */
export function speedometer(): string {
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const angle = ((-140 + i * 35) * Math.PI) / 180;
    const x = 90 + Math.sin(angle) * 66,
      y = 90 - Math.cos(angle) * 66;
    return `<text x="${x}" y="${y + 3}" text-anchor="middle">${i * 20}</text>`;
  }).join("");
  return `<aside class="speedometer" aria-label="Live typing speed" title="Recent correct typing over up to three active seconds. Results use average WPM."><svg viewBox="0 0 180 155" aria-hidden="true"><path class="dial-track" d="M45 144 A70 70 0 1 1 135 144"/><path class="dial-accent" d="M23 70 A70 70 0 0 1 126 30"/>${ticks}<g class="dial-needle"><path d="M87 96 L90 35 L93 96 Z"/><circle cx="90" cy="90" r="6"/></g></svg><strong class="dial-value">0</strong><span>LIVE WPM</span></aside>`;
}
export function updateSpeedometer(
  parent: HTMLElement,
  recentWpm: number,
): void {
  const dial = parent.querySelector<HTMLElement>(".speedometer");
  if (!dial) return;
  const speed = Number.isFinite(recentWpm) ? Math.max(0, recentWpm) : 0;
  const reading = dial.querySelector(".dial-value")!;
  const value = String(Math.round(speed));
  if (reading.textContent !== value) reading.textContent = value;
  dial.style.setProperty(
    "--needle",
    `${-140 + (Math.min(speed, 160) / 160) * 280}deg`,
  );
  dial.dataset.wpm = String(speed);
}
