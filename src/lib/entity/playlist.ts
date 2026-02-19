import type { MediaType } from "../types/media-type";
import type { MediaFile } from "./media-file";

export interface Playlist {
    id: number;
    name: string;
    cover: MediaFile<MediaType.SVG>;
    description: string;
    trackIds: Set<number>;
}