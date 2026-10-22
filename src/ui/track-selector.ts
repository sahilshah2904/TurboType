import { STARTER_TRACKS, type TrackId } from "../content/track-catalog";
export function trackChoices(selected: TrackId, id: string): string {
  return `<div class="track-choice"><label for="${id}">Track</label><select id="${id}">${STARTER_TRACKS.map((track) => `<option value="${track.id}" ${track.id === selected ? "selected" : ""}>${track.name} · ${track.setting}</option>`).join("")}</select><p class="help" id="track-choice-status" role="status">Five starter tracks · scenery only. Choose before countdown.</p></div>`;
}
