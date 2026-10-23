import { STORIES } from "./stories.ts";

export const CHAPTER_SKILLS = {
  easy: [
    ["Calm spacing", "Read common words ahead and use one space between them."],
    [
      "Full alphabet",
      "Reach upper and lower letter rows without losing your place.",
    ],
    [
      "Word endings",
      "Notice familiar endings while keeping short words relaxed.",
    ],
    [
      "Longer words",
      "Read a whole word before entering a longer letter sequence.",
    ],
    [
      "Steady corrections",
      "Remove one wrong character and recover a calm rhythm.",
    ],
    [
      "Repeated letters",
      "Keep repeated letters distinct instead of rushing through them.",
    ],
    [
      "Reading ahead",
      "Follow the next phrase while the current line moves upward.",
    ],
    [
      "Sentence rhythm",
      "Use sentence boundaries to reset attention without rushing.",
    ],
    [
      "Sustained flow",
      "Hold an even pace through a substantial lowercase passage.",
    ],
    [
      "Long-form recap",
      "Combine accurate spacing and relaxed reading through the finale.",
    ],
  ],
  medium: [
    [
      "Sentence capitals",
      "Use Shift for sentence openings and return to lowercase smoothly.",
    ],
    [
      "Commas and pauses",
      "Read commas as part of a phrase while maintaining exact spacing.",
    ],
    [
      "Contractions",
      "Type apostrophes within ordinary words without skipping a letter.",
    ],
    [
      "Longer vocabulary",
      "Combine longer words with capitals and familiar punctuation.",
    ],
    [
      "Possessive forms",
      "Distinguish a possessive apostrophe from an ordinary word ending.",
    ],
    [
      "Questions",
      "Move between statements and questions without changing correction rules.",
    ],
    [
      "Introductory numerals",
      "Switch between letters and small whole numbers in prose.",
    ],
    [
      "Compound sentences",
      "Carry a phrase across commas and sentence boundaries.",
    ],
    [
      "Reading for detail",
      "Keep capital letters, numerals and apostrophes accurate together.",
    ],
    [
      "Sustained mixed prose",
      "Combine the category's skills through a longer final reading.",
    ],
  ],
  hard: [
    [
      "Dialogue and time",
      "Track quotation marks, capitals and clock times in connected prose.",
    ],
    [
      "Apostrophes in dialogue",
      "Distinguish quoted speech, contractions and possessives.",
    ],
    [
      "Colons and semicolons",
      "Follow linked clauses with exact punctuation and spacing.",
    ],
    [
      "Hyphens and parentheses",
      "Enter compound terms and parenthetical details precisely.",
    ],
    [
      "Decimals and percentages",
      "Keep decimal points, percent signs and numeric units exact.",
    ],
    ["Square brackets", "Read bracketed notes as part of a complete report."],
    [
      "Paths and slashes",
      "Distinguish forward slashes and backslashes in short file references.",
    ],
    [
      "Workplace symbols",
      "Read labels using @, #, $ and & alongside ordinary prose.",
    ],
    [
      "Technical notation",
      "Enter braces, operators, underscores, backticks and pipes in context.",
    ],
    [
      "Precision endurance",
      "Combine dense notation and connected prose through the final route.",
    ],
  ],
} as const;

const OPENINGS = [
  "a quiet visit leaves room to notice the details that a hurried journey might miss.",
  "a clear plan gives each small task a useful place in the work of the day.",
  "the people who care for this place know that a little attention can make a lasting difference.",
  "there is time to look closely and understand how separate details fit into a larger picture.",
  "a familiar place can still offer a new question when someone takes a slower and more careful look.",
  "the work moves forward through small choices that keep the next step clear and easy to follow.",
  "a visitor can learn a great deal by watching what people check before they begin their work.",
  "the most useful details are often the ones that make another visit easier to plan.",
  "a patient look at ordinary work can reveal how much care supports a place that feels simple to use.",
  "the end of a long route is a good place to bring together the habits learned along the way.",
];
const MEDIUM_NOTES = [
  "We begin with a simple plan, then adjust it when a detail needs more care. A quick correction doesn't undo the progress already made.",
  "At the entrance, a visitor stops to read the day's notice. Clear words, a useful map, and a little time make the next step easier to choose.",
  "We've brought a notebook because memory isn't always reliable. A short comment can preserve the small detail that would otherwise be forgotten.",
  "The group compares its observations, listens to a different explanation, and checks the part that remains uncertain. Attention matters more than a quick guess.",
  "The volunteer's notebook includes the visitor's question. Keeping both together helps the next team understand why a particular detail was recorded.",
  "What should we check before leaving? The question gives everyone a chance to notice a missing label, an open gate, or a detail that needs another look.",
  "The plan has 3 simple steps: observe, record, and compare. We finish 1 task carefully before moving to another, rather than guessing how far we've come.",
  "Although the work is familiar, we don't stop reading the instructions. A quiet change can matter, and a careful check keeps an old habit useful.",
  "The team's 2 notebooks describe the same visit from different places. We've kept both accounts so that a reader can compare the details instead of relying on a single view.",
  "We've learned to read ahead, correct small mistakes, and keep a pace that lasts. The final section asks for the same care as the first, even when the finish feels close.",
];
export const HARD_NOTES = [
  'At 6:15, Mira opened the log. "Read the whole instruction before moving on," she said. The team checked 3 observations against the map, then marked the next review for 9:40.',
  "\"We've checked the visitor's note, but we haven't checked the team's copy,\" Mira said. \"Don't change the original until both accounts agree.\" The reply was brief: \"I'll compare them now.\"",
  'The report separated 2 questions: what changed, and why? The first had a clear answer; the second needed another observation. "Record the uncertainty," Mira said. "A precise question is useful work."',
  'The follow-up report included a short-term plan (check the labels), a long-term task (compare the records), and a reminder: "Re-read the final line." None of the notes changed the original observation.',
  'The display showed 12.5%, while the handwritten note said 12.0%. "Keep both readings," Mira said. The 0.5-point difference was recorded as an observation, not proof that either source was accurate.',
  'The log used [open] for a question and [checked] for a verified detail. "Keep [pending] items visible," Mira said. A label such as [section 4] helped readers find the relevant page without guessing.',
  'The folder was named notes/field-trip, and its local copy was C:\\logs\\visit.txt. "A slash is not a backslash," Mira said. The date label, 23/10/2026, stayed separate from both file references.',
  'The practice label read "team@station", the crate was marked #4, and a sample budget showed $25 & $10. These were copied labels, not contact details or spending instructions. "Check every symbol," Mira said.',
  'A sample rule read `count >= 3 && state != 0`; the note beside it used {route_id: 7} and A|B. "Treat ^, ~, *, + and = as separate symbols," Mira said. The notation was a reading exercise, not a command.',
  'The final check combined [route_10], 98.5%, notes/end.txt, C:\\logs\\end.txt, and {ready: true}. "Is count >= 3 && gap < 2?" Mira asked. The reply, "Check A|B, #7, $5 & ~4!", stayed a quoted practice label.',
];

function sentenceCase(text: string): string {
  return text.replace(
    /(^|\. )([a-z])/g,
    (_, prefix, letter) => prefix + letter.toUpperCase(),
  );
}

/** Offline authoring only. No text generation or remote services during gameplay. */
export function authorPassage(
  category: "easy" | "medium" | "hard",
  number: number,
  bonus = false,
) {
  const chapter = Math.floor((number - 1) / 10);
  const slot = (number - 1) % 10;
  const story = STORIES[chapter];
  const [skill, objective] = CHAPTER_SKILLS[category][chapter];
  const notes =
    category === "easy"
      ? []
      : [category === "medium" ? MEDIUM_NOTES[chapter] : HARD_NOTES[chapter]];
  const opening =
    category === "easy" ? OPENINGS[slot] : sentenceCase(OPENINGS[slot]);
  const format = category === "easy" ? (text: string) => text : sentenceCase;
  const target = bonus
    ? { easy: 260, medium: 400, hard: 560 }[category]
    : Math.round(
        { easy: 830, medium: 1050, hard: 1320 }[category] +
          ((number - 7) / 93) *
            ({ easy: 1400, medium: 2200, hard: 3000 }[category] -
              { easy: 830, medium: 1050, hard: 1320 }[category]),
      );
  const parts = [opening, ...notes];
  // Different omissions give each visit a distinct ordered excerpt of the same chapter anthology.
  const omitted = new Set([slot % 16, (slot + 5) % 16]);
  for (let i = 0; i < story.paragraphs.length; i++) {
    if (omitted.has(i)) continue;
    const text = format(story.paragraphs[i]);
    if (parts.join(" ").length + text.length + 1 > target) continue;
    parts.push(text);
  }
  // Add complete sentences, never cut words or pad with repeated text.
  const remaining = story.paragraphs
    .filter((p) => !parts.includes(format(p)))
    .flatMap(
      (p) =>
        format(p)
          .match(/[^.]+\./g)
          ?.map((s) => s.trim()) ?? [],
    );
  for (const sentence of remaining) {
    if (parts.join(" ").length + sentence.length + 1 <= target)
      parts.push(sentence);
  }
  return {
    id: bonus
      ? `${category}-bonus-${String(chapter + 1).padStart(2, "0")}`
      : `${category}-${String(number).padStart(3, "0")}`,
    title: `${story.title} · ${bonus ? "Precision side road" : slot === 9 ? (chapter === 9 ? "Category finale" : "Chapter showcase") : ["First look", "Make a plan", "Notice the detail", "Build the rhythm", "Careful choices", "Keep the flow", "Read ahead", "Combine the skills", "Route rehearsal"][slot]}`,
    focus: `${skill}: ${objective}`,
    skills: [skill],
    passage: parts.join(" "),
  };
}
