import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const out = fileURLToPath(new URL("../public/assets/cars/", import.meta.url));
mkdirSync(out, { recursive: true });
const designs = [
  {
    name: "neon-gt",
    roof: "M208 117 290 61 Q304 52 327 53 L447 57 Q472 59 495 82 L545 120",
    glass: "M257 112 302 68 365 68 363 112Z M380 69 442 72 490 113 380 112Z",
    nose: "M545 120 673 133 724 157 719 178 653 186 121 186 81 168 91 145 171 128Z",
    wing: "",
  },
  {
    name: "apex-r",
    roof: "M221 119 295 66 Q311 58 334 59 L447 62 512 118",
    glass: "M265 111 307 74 361 73 359 111Z M376 73 438 76 484 113 376 111Z",
    nose: "M512 118 663 128 729 151 728 177 652 188 118 188 77 170 96 143 180 129Z",
    wing: "<path d='M100 128 102 103 73 99 74 90 185 90 181 101 135 105 137 124' fill='#171e29' stroke='#90a5b3' stroke-width='3'/>",
  },
  {
    name: "volt-x",
    roof: "M198 119 282 69 Q296 60 317 60 L439 62 528 119",
    glass: "M242 111 297 74 364 73 362 112Z M379 73 435 75 495 114 379 112Z",
    nose: "M528 119 667 128 730 145 724 176 654 187 114 187 76 166 90 145 163 129Z",
    wing: "",
  },
];
for (const d of designs) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="240" viewBox="0 0 760 240" role="img" aria-label="Original ${d.name} sports car body">
<defs><linearGradient id="paint" x2="0" y2="1"><stop stop-color="#fcffff"/><stop offset=".48" stop-color="#bccad1"/><stop offset=".56" stop-color="#e8f2f4"/><stop offset="1" stop-color="#516473"/></linearGradient><linearGradient id="glass" x2=".6" y2="1"><stop stop-color="#496579"/><stop offset=".48" stop-color="#142837"/><stop offset="1" stop-color="#08111e"/></linearGradient></defs>
${d.wing}<path d="${d.roof}" fill="url(#paint)" stroke="#182d3b" stroke-width="4"/>
<path d="${d.nose}" fill="url(#paint)" stroke="#142735" stroke-width="4"/>
<path d="${d.glass}" fill="url(#glass)" stroke="#0d1c2c" stroke-width="4"/>
<path d="M128 136 Q359 125 646 139 M252 145 530 145 567 136" fill="none" stroke="#f5ffff" stroke-opacity=".65" stroke-width="4"/>
<path d="M271 128 274 174 476 177 490 129 M386 127 386 176" fill="none" stroke="#526875" stroke-width="2"/>
<path d="M307 137 342 137" stroke="#182d3b" stroke-width="5" stroke-linecap="round"/>
<path d="M497 146 548 149 529 172 493 172Z" fill="#132631"/><path d="M504 153 535 154 525 165 501 165Z" fill="#3d5966"/>
<path d="M87 163 122 172 655 176 722 161 717 188 115 191 79 176Z" fill="#101b29"/>
<path d="M269 181 512 181" stroke="#75939c" stroke-width="3"/>
<path d="M669 141 717 151 714 158 665 151Z" fill="#e7ffff"/><path d="M671 146 713 154" stroke="#78eaff" stroke-width="3"/>
<path d="M87 146 122 140 123 149 85 155Z" fill="#ff6b67"/>
<path d="M135 183 A57 57 0 0 1 249 183 M528 183 A57 57 0 0 1 642 183" fill="#09121e" stroke="#65808a" stroke-width="6"/>
<path d="M136 161 A60 60 0 0 1 250 161 M527 161 A61 61 0 0 1 643 161" fill="none" stroke="#e4f5fa" stroke-opacity=".55" stroke-width="3"/>
<path d="M441 105 467 105 479 117 443 117Z" fill="#1c303d"/>
<path d="M687 164 716 161 709 173 683 176Z" fill="#0b1b28"/><path d="M89 172 111 176" stroke="#abbec5" stroke-width="5"/>
</svg>\n`;
  writeFileSync(`${out}/${d.name}.svg`, svg);
}
