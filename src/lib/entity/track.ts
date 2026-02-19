import type { AudioType } from "../types/audio-type";

export interface Track {
    id: string;
    name: string;
    author: string;
    album?: string;
    audio: Blob;
    audioType: AudioType;
    duration: number;
}