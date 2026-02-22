import type { MediaFile } from "../entity/media-file";
import type { Track } from "../entity/track";
import type { Repository } from "../repository/repository";
import { MediaType } from "../types/media-type";
import type { MP3Metadata } from "../types/mp3-metadata";
import type { TrackService } from "./track-service";
import * as mm from 'music-metadata-browser';

export class TrackServiceImpl implements TrackService {

    private readonly trackRepository: Repository<Track>;
    private readonly mediaFileRepository: Repository<MediaFile<MediaType>>;

    constructor(trackRepository: Repository<Track>, mediaFileRepository: Repository<MediaFile<MediaType>>) {
        this.trackRepository = trackRepository;
        this.mediaFileRepository = mediaFileRepository;
    }

    async getAll(): Promise<Track[]> {
        return this.trackRepository.getAll();
    }

    async get(id: number): Promise<Track> {
        return this.trackRepository.get(id);
    }

    async create(audioFile: File): Promise<Track> {
    
        // Extract information from file
        const metadata = await this.readMedatadaFromMP3File(audioFile);

        if (!metadata.duration) throw new Error("Could not parse duration from uploaded file");

        const entity: Omit<Track, "id"> = {
            name: metadata.title ?? "Unnamed track",
            author: metadata.artist ?? "Unknown",
            album: metadata.album ?? undefined,
            audioMediaFileId: -1,
            duration: metadata.duration,
            addedAt: new Date()
        }

        // Save audio file
        const audioFileEntity: Omit<MediaFile<MediaType.MP3>, "id"> = {
            blob: audioFile,
            type: MediaType.MP3
        };

        const { id } = await this.mediaFileRepository.save(audioFileEntity);
        
        // Save track
        entity.audioMediaFileId = id;
        return this.trackRepository.save(entity);
    }

    async update(id: number, entity: Track): Promise<Track> {
        return this.trackRepository.update(id, entity);
    }

    async delete(id: number): Promise<void> {
        return this.trackRepository.delete(id);
    }

    async getAudioBlob(id: number): Promise<Blob> {
        const track: Track = await this.trackRepository.get(id);
        const audio: MediaFile<MediaType> = await this.mediaFileRepository.get(track.audioMediaFileId);

        if (audio.type !== MediaType.MP3) throw new Error(`Audio file for track ${id} is not MP3`);

        return audio.blob;
    }

    private async readMedatadaFromMP3File(file: File): Promise<MP3Metadata> {
        const metadata = await mm.parseBlob(file);

        return {...metadata.common as MP3Metadata, duration: metadata.format.duration};
    }

}