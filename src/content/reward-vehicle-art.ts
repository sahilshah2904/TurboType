type Wheel = readonly [number, number, number];
type Recipe = readonly [
  string,
  string,
  string,
  string,
  string,
  readonly Wheel[],
];

// Each recipe is an original side profile with separate glazing and axle anchors.
const VEHICLES: readonly Recipe[] = [
  [
    "reward-easy-015",
    "#ef604c",
    "#ffdf9d",
    "M17 69L27 55 74 49 99 29 131 29 155 48 181 54 194 68 184 80H20Z",
    "M82 48L102 32H128L147 48Z",
    [
      [-54, 25, 17],
      [59, 25, 17],
    ],
  ],
  [
    "reward-medium-015",
    "#e5a13f",
    "#f4efbc",
    "M18 65V39H67L86 17H133L157 41 183 47 194 65 177 72H21Z",
    "M77 37L91 21H129L145 37Z",
    [
      [-52, 21, 24],
      [55, 21, 24],
    ],
  ],
  [
    "reward-hard-015",
    "#8865ee",
    "#63f8ea",
    "M13 62Q38 74 81 61L95 34 111 23 132 26 138 55 187 51 195 58 173 72 45 79Z",
    "M101 38L113 26 129 29 132 43Z",
    [],
  ],
  [
    "reward-easy-030",
    "#e99139",
    "#fff1ab",
    "M11 58L27 45 66 43 85 21 121 20 153 41 178 46 192 61 181 72H22Z",
    "M72 44L89 25H119L142 43Z",
    [
      [-63, 24, 22],
      [61, 24, 21],
    ],
  ],
  [
    "reward-medium-030",
    "#51b9e4",
    "#a7fbfd",
    "M14 63L52 57 86 40 107 40 121 31 140 31 157 51 192 57 197 64 155 75 48 74Z",
    "M108 46L125 34H137L151 48Z",
    [],
  ],
  [
    "reward-hard-030",
    "#576eec",
    "#f2d9ff",
    "M14 61L35 39 49 43 70 57 92 27 116 19 145 30 159 48 192 53 191 64 167 73 49 76Z",
    "M94 46L102 31 118 24 143 34 151 46Z",
    [],
  ],
  [
    "reward-easy-045",
    "#52ac80",
    "#f4f1a0",
    "M13 62L29 49 73 46 100 26 120 28 131 46 165 49 191 64 177 75H20Z",
    "M84 45L103 29 117 32 124 45Z",
    [
      [-58, 25, 20],
      [62, 27, 17],
    ],
  ],
  [
    "reward-medium-045",
    "#638762",
    "#f4c65e",
    "M13 65L16 41H54L70 23H122L145 43H181L193 67 176 73H22Z",
    "M65 42L75 27H118L132 42Z",
    [
      [-59, 25, 18],
      [0, 25, 17],
      [59, 25, 18],
    ],
  ],
  [
    "reward-hard-045",
    "#ed5656",
    "#ffd88a",
    "M13 57L38 46 47 18 62 22 68 45 101 46 119 25 139 30 154 47 192 58 190 66 170 74H37Z",
    "M108 46L122 29 137 33 147 46Z",
    [],
  ],
  [
    "reward-easy-060",
    "#54bdc4",
    "#c7fcff",
    "M14 69Q14 53 34 49L67 47 87 29 126 28 147 46 184 51 196 65 184 76H28Z",
    "M76 46L91 33H124L137 46Z",
    [],
  ],
  [
    "reward-medium-060",
    "#cf668b",
    "#ffd49d",
    "M11 62L32 53 48 30 60 33 63 49 93 48 117 29 144 35 154 48 193 53 195 63 166 76 60 75Z",
    "M105 46L120 33 141 38 147 48Z",
    [],
  ],
  [
    "reward-hard-060",
    "#6dc968",
    "#dffda8",
    "M19 62Q28 46 54 44L75 24Q104 13 134 28L153 45 181 52 194 65 180 76H34Z",
    "M65 44L80 27Q108 19 131 31L144 45Z",
    [],
  ],
  [
    "reward-easy-075",
    "#bc6860",
    "#f8f1ac",
    "M15 60V43H56L68 22H119L142 41H169L192 55 185 70H18Z",
    "M61 42L73 25H116L133 42Z",
    [
      [-55, 22, 24],
      [53, 21, 25],
    ],
  ],
  [
    "reward-medium-075",
    "#7985cd",
    "#b9f9e4",
    "M13 62L26 46 53 40 69 22 120 19 148 39 187 43 195 59 179 71H20Z",
    "M61 39L75 25 116 23 138 40Z",
    [
      [-60, 22, 22],
      [62, 23, 23],
    ],
  ],
  [
    "reward-hard-075",
    "#ef66af",
    "#fdf08f",
    "M12 65L38 50 70 55 100 24 131 17 149 29 153 49 184 47 196 57 166 72H40Z",
    "M103 43L121 23 137 22 147 34 149 45Z",
    [],
  ],
  [
    "reward-easy-090",
    "#4679e5",
    "#ffcc78",
    "M13 65L36 48 59 48 74 18 85 20 92 38 120 28 150 45 184 49 195 61 173 74H23Z",
    "M93 46L120 32 144 45Z",
    [],
  ],
  [
    "reward-medium-090",
    "#8649bd",
    "#f6ccff",
    "M15 65L37 48 70 45 95 24 128 24 151 46 181 49 193 58 192 69 170 77H33Z",
    "M81 44L99 28H126L145 46Z",
    [],
  ],
  [
    "reward-hard-090",
    "#4d9d9b",
    "#ffedbd",
    "M11 60L37 43 63 43 74 30 91 19 127 16 149 29 163 42 187 46 196 57 179 72 55 76Z",
    "M74 43L95 23 126 20 146 32 154 43Z",
    [],
  ],
];

const wheelShape = (accent: string) =>
  `<circle cx="50" cy="50" r="48" fill="#12151b" stroke="#76808a" stroke-width="2"/><circle cx="50" cy="50" r="31" fill="#273541" stroke="${accent}" stroke-width="3"/><path d="M50 20V80M20 50H80M29 29L71 71M29 71L71 29" stroke="${accent}" stroke-width="4"/><circle cx="50" cy="50" r="11" fill="#d8e4ed"/><circle cx="50" cy="50" r="5" fill="#273541"/>`;

export const rewardVehicleArt = VEHICLES.map(
  ([id, paint, accent, body, glass, wheels], index) => {
    const wheel = wheelShape(accent);
    const svg = (content: string) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="400" height="200">${content}</svg>`;
    const contours = `<defs><linearGradient id="paint" x2=".25" y2="1"><stop stop-color="${paint}"/><stop offset="1" stop-color="#192635"/></linearGradient><linearGradient id="glass" x2="0" y2="1"><stop stop-color="${accent}"/><stop offset=".7" stop-color="#162b42"/></linearGradient><clipPath id="body"><path d="${body}"/></clipPath></defs><path d="${body}" fill="url(#paint)" stroke="#d8e4ed" stroke-width="1.4"/><g clip-path="url(#body)"><path d="M10 65L70 52 116 55 191 44M22 70L88 62 149 64 195 54" fill="none" stroke="${accent}" stroke-width="${(index % 3) + 2}" opacity=".84"/><path d="M26 69H175M49 60H90" stroke="#162331" stroke-width="3"/><path d="M174 56L191 58 189 61H178Z" fill="#eff9ff"/><path d="M15 59H26V64H15Z" fill="#ff445a"/></g><path d="${glass}" fill="url(#glass)" stroke="#d0e1ed" stroke-width="1.2"/><path d="M100 48L96 61M107 53H117" stroke="#1d2b39" stroke-width="1.8"/>${wheels.length ? "" : `<path d="M47 80H73M126 78H154" stroke="${accent}" stroke-width="3" stroke-linecap="round"/><path d="M54 85H66M133 83H147" stroke="${accent}" stroke-opacity=".55" stroke-width="2"/>`}`;
    const assembled = wheels
      .map(
        ([x, y, radius]) =>
          `<g transform="translate(${100 + x - radius} ${50 + y - radius}) scale(${radius / 50})">${wheel}</g>`,
      )
      .join("");
    return {
      id,
      wheels,
      bodyY: 0,
      exhaust: [-86, 11] as const,
      preview: svg(contours + assembled),
      body: svg(contours),
      wheel: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">${wheel}</svg>`,
    };
  },
);
