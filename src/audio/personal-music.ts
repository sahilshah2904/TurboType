/** A visit-only local file. No upload, persistence or third-party request. */
export class PersonalMusic {
  private media: HTMLAudioElement | undefined;
  private url: string | undefined;
  private generation = 0;
  private state: "idle" | "starting" | "playing" | "failed" = "idle";
  name = "";
  constructor(
    private changed: () => void,
    private makeMedia = () => new Audio(),
    private urls = URL,
  ) {}
  get active(): boolean {
    return this.state === "starting" || this.state === "playing";
  }
  get failed(): boolean {
    return this.state === "failed";
  }
  select(file: File): void {
    this.clear();
    this.name = file.name;
    try {
      this.url = this.urls.createObjectURL(file);
      const media = this.makeMedia();
      this.media = media;
      media.loop = true;
      media.preload = "metadata";
      media.src = this.url;
      media.onerror = () => {
        this.generation++;
        media.pause();
        this.state = "failed";
        this.changed();
      };
    } catch {
      this.state = "failed";
    }
    this.changed();
  }
  retry(): void {
    if (this.failed) this.state = "idle";
  }
  sync(play: boolean, volume: number): void {
    const media = this.media;
    if (!media) return;
    media.volume = Math.max(0, Math.min(1, volume));
    if (!play) {
      if (this.active) this.generation++;
      media.pause();
      if (!this.failed) this.state = "idle";
      return;
    }
    if (this.active || this.failed) return;
    const token = ++this.generation;
    this.state = "starting";
    try {
      void media
        .play()
        .then(() => {
          if (token !== this.generation) {
            if (media !== this.media || !this.active) media.pause();
            return;
          }
          this.state = "playing";
          this.changed();
        })
        .catch(() => {
          if (token !== this.generation) return;
          media.pause();
          this.state = "failed";
          this.changed();
        });
    } catch {
      this.state = "failed";
      this.changed();
    }
  }
  clear(): void {
    this.generation++;
    if (this.media) {
      this.media.onerror = null;
      this.media.pause();
      this.media.removeAttribute("src");
      this.media.load();
    }
    if (this.url) this.urls.revokeObjectURL(this.url);
    this.media = undefined;
    this.url = undefined;
    this.name = "";
    this.state = "idle";
  }
}
