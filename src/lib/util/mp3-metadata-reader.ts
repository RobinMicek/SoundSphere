import { parseBlob } from 'music-metadata-browser';
import { Buffer } from 'buffer';
import type {MP3Metadata} from "../types/mp3-metadata";

(window as any).Buffer = Buffer;

export async function readMP3Metadata(file: File): Promise<MP3Metadata> {
    const metadata = await parseBlob(
        file,
        {
            duration: true
        }
    );

    return {
        title: metadata.common?.title,
        artist: metadata.common?.artist,
        album: metadata.common?.album,
        duration: metadata.format?.duration
    };
}