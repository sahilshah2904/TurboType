/** Original SVG fire and instrument face; decoration never changes game rules. */
export function speedometer(): string {
  const ticks = Array.from({ length: 33 }, (_, i) => {
    const angle = ((-140 + i * 8.75) * Math.PI) / 180;
    const major = i % 8 === 0;
    const inner = major ? 61 : 69;
    const labelX = i === 0 ? 18 : i === 32 ? 162 : 90 + Math.sin(angle) * 49;
    const labelY = i === 0 || i === 32 ? 158 : 95 - Math.cos(angle) * 49;
    return `<line class="${major ? "dial-tick-major" : "dial-tick"}" x1="${90 + Math.sin(angle) * inner}" y1="${90 - Math.cos(angle) * inner}" x2="${90 + Math.sin(angle) * 75}" y2="${90 - Math.cos(angle) * 75}"/>${major ? `<text x="${labelX}" y="${labelY}" text-anchor="middle">${i * 5}</text>` : ""}`;
  }).join("");
  return `<aside class="speedometer" data-active="false" aria-label="Live typing speed" title="Recent correct typing over up to three active seconds. Results use average WPM.">
    <svg viewBox="0 0 180 165" aria-hidden="true">
      <defs>
        <radialGradient id="dial-glass"><stop stop-color="#29252a"/><stop offset=".75" stop-color="#11151c"/><stop offset="1" stop-color="#080d13"/></radialGradient>
        <linearGradient id="dial-fire" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ffe19a"/><stop offset=".3" stop-color="#ff931e"/><stop offset=".7" stop-color="#ff872c"/><stop offset="1" stop-color="#c71d44"/></linearGradient>
        <linearGradient id="dial-core" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#fff3c4"/><stop offset="1" stop-color="#ff9d35" stop-opacity=".25"/></linearGradient>
        <clipPath id="dial-window"><circle cx="90" cy="85" r="73"/></clipPath>
      </defs>
      <circle class="dial-bezel" cx="90" cy="85" r="81"/>
      <circle cx="90" cy="85" r="76" fill="url(#dial-glass)"/>
      <g clip-path="url(#dial-window)">
        <g class="dial-flames" fill="url(#dial-fire)">
          <path d="M12 158 Q5 121 30 91 Q22 118 42 121 Q22 80 49 46 Q43 78 65 88 Q49 43 80 13 Q66 55 94 73 Q100 46 95 29 Q126 55 113 98 Q132 88 132 58 Q158 91 142 118 Q164 112 165 89 Q183 134 166 163 Z"/>
          <path class="dial-flames-inner" fill="url(#dial-core)" d="M33 158 Q26 134 48 113 Q42 136 67 137 Q49 100 76 77 Q65 107 88 117 Q84 78 107 61 Q98 105 118 120 Q134 105 133 95 Q150 128 140 159 Z"/>
        </g>
        <circle cx="90" cy="85" r="56" fill="#090f19" fill-opacity=".18"/>
      </g>
      <path class="dial-track" d="M40 145 A78 78 0 1 1 140 145"/>
      <path class="dial-redline" d="M146 32 A78 78 0 0 1 150 135"/>
      ${ticks}
      <g class="dial-needle"><path d="M87 96 L90 28 L93 96 Z"/><circle cx="90" cy="90" r="7"/><circle class="dial-pin" cx="90" cy="90" r="3"/></g>
    </svg><div class="dial-readout"><strong class="dial-value">0</strong><span>LIVE WPM</span></div>
  </aside>`;
}
export function updateSpeedometer(
  parent: HTMLElement,
  recentWpm: number,
  active: boolean,
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
  dial.style.setProperty(
    "--heat",
    String(0.55 + (Math.min(speed, 160) / 160) * 0.45),
  );
  dial.dataset.active = String(active);
  dial.dataset.wpm = String(speed);
}
