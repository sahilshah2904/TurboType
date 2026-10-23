import { expect, it } from "vitest";
import { KEYBOARD_SAMPLE, KEY_ROWS } from "./keyboard-check";
it("covers every printable English keyboard character without duplicate physical keys", () => {
  for (let code = 32; code <= 126; code++)
    expect(KEYBOARD_SAMPLE).toContain(String.fromCharCode(code));
  const keys = KEY_ROWS.flat();
  expect(new Set(keys.map((k) => k.code)).size).toBe(keys.length);
  expect(keys.map((k) => k.chars).join("")).toContain("qQ");
});
