import { expect, it, vi } from "vitest";
import { PersonalMusic } from "./personal-music";
function fixture() {
  const media = {
    volume: 1,
    loop: false,
    preload: "",
    src: "",
    onerror: null,
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    load: vi.fn(),
    removeAttribute: vi.fn(),
  };
  const urls = {
    createObjectURL: vi.fn(() => "blob:local"),
    revokeObjectURL: vi.fn(),
  };
  const changed = vi.fn();
  const music = new PersonalMusic(
    changed,
    () => media as unknown as HTMLAudioElement,
    urls as unknown as typeof URL,
  );
  return { music, media, urls, changed };
}
const file = { name: "personal.wav" } as File;
it("uses only a local blob, applies volume and releases the file on clear", async () => {
  const { music, media, urls } = fixture();
  music.select(file);
  music.sync(true, 0.2);
  await Promise.resolve();
  expect(media.src).toBe("blob:local");
  expect(media.loop).toBe(true);
  expect(music.active).toBe(true);
  expect(media.volume).toBe(0.2);
  music.sync(false, 0);
  expect(music.active).toBe(false);
  expect(media.pause).toHaveBeenCalled();
  music.clear();
  expect(urls.revokeObjectURL).toHaveBeenCalledWith("blob:local");
  expect(media.removeAttribute).toHaveBeenCalledWith("src");
  expect(music.name).toBe("");
});
it("reports blocked playback and retries only after explicit permission", async () => {
  const { music, media } = fixture();
  media.play.mockRejectedValueOnce(Error("blocked"));
  music.select(file);
  music.sync(true, 0.5);
  await Promise.resolve();
  await Promise.resolve();
  expect(music.failed).toBe(true);
  expect(music.active).toBe(false);
  music.sync(true, 0.5);
  expect(media.play).toHaveBeenCalledTimes(1);
  music.retry();
  music.sync(true, 0.5);
  await Promise.resolve();
  expect(music.active).toBe(true);
  music.clear();
});
it("cancels a pending play on pause and revokes each replaced file", async () => {
  const { music, media, urls } = fixture();
  let resume!: () => void;
  media.play.mockImplementationOnce(
    () => new Promise<void>((r) => (resume = r)),
  );
  music.select(file);
  music.sync(true, 0.5);
  music.sync(false, 0.5);
  const pauses = media.pause.mock.calls.length;
  resume();
  await Promise.resolve();
  expect(media.pause.mock.calls.length).toBeGreaterThan(pauses);
  expect(music.active).toBe(false);
  music.select(file);
  expect(urls.revokeObjectURL).toHaveBeenCalledTimes(1);
  music.clear();
  expect(urls.revokeObjectURL).toHaveBeenCalledTimes(2);
});
