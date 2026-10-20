import { expect, it } from "vitest";
import { rankStandings } from "./standings";

it("orders finished racers before progress and awards shared places", () => {
  const ranked = rankStandings([
    { id: "d", progress: 0.5, finishTimeMs: null },
    { id: "b", progress: 1, finishTimeMs: 5000 },
    { id: "a", progress: 1, finishTimeMs: 5000 },
    { id: "c", progress: 1, finishTimeMs: 6000 },
    { id: "e", progress: 0.5, finishTimeMs: null },
    { id: "f", progress: 0.4, finishTimeMs: null },
  ]);
  expect(ranked.map(({ id, place }) => [id, place])).toEqual([
    ["a", 1],
    ["b", 1],
    ["c", 3],
    ["d", 4],
    ["e", 4],
    ["f", 6],
  ]);
});
it("does not mutate source data and rejects inconsistent/duplicate standings", () => {
  const entries = [{ id: "a", progress: 0, finishTimeMs: null }];
  expect(rankStandings(entries)).toEqual([{ ...entries[0], place: 1 }]);
  expect(entries[0]).not.toHaveProperty("place");
  expect(() => rankStandings([...entries, ...entries])).toThrow(RangeError);
  expect(() =>
    rankStandings([{ id: "a", progress: 0.5, finishTimeMs: 1 }]),
  ).toThrow(RangeError);
});
