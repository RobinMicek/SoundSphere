import type { MediaType } from "../types/media-type";
import type { MediaFile } from "./media-file";

export interface Track {
    id: number;
    name: string;
    author: string;
    album?: string;
    audio: MediaFile<MediaType.MP3>;
    duration: number;
}