import type {MediaFile} from "../entity/media-file";
import type {Track} from "../entity/track";
import type {Repository} from "../repository/repository";
import {MediaType} from "../types/media-type";
import type {TrackService} from "./track-service";
import {MP3Metadata} from "$lib/types/mp3-metadata";
import {readMP3Metadata} from "$lib/util/mp3-metadata-reader";


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
        const metadata: MP3Metadata = await this.readTrackMetadata(audioFile)

        const duration: number = metadata.duration ?? await this.readMP3Duration(audioFile);

        if (!duration) throw new Error("Could not parse duration from uploaded file");

        const entity: Omit<Track, "id"> = {
            name: metadata.title ?? audioFile.name ?? "Unnamed track",
            author: metadata.artist ?? "Unknown",
            album: metadata.album,
            audioMediaFileId: -1,
            duration: duration,
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
        const entity: Track = await this.trackRepository.get(id);

        // Delete audio blob
        await this.mediaFileRepository.delete(entity.audioMediaFileId);

        return this.trackRepository.delete(id);
    }

    async getAudioBlob(id: number): Promise<Blob> {
        const track: Track = await this.trackRepository.get(id);
        const audio: MediaFile<MediaType> = await this.mediaFileRepository.get(track.audioMediaFileId);

        if (audio.type !== MediaType.MP3) throw new Error(`Audio file for track ${id} is not MP3`);

        return audio.blob;
    }

    /**
     * Reads MP3 duration - used as fallback if metadata reader fails
     */
    private async readMP3Duration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const audioElement: HTMLAudioElement = document.createElement("audio");
            const url: string = URL.createObjectURL(file);

            audioElement.src = url;

            audioElement.addEventListener("loadedmetadata", () => {
                resolve(audioElement.duration);
                URL.revokeObjectURL(url);
            });

            audioElement.addEventListener("error", (err) => {
                reject(err);
                URL.revokeObjectURL(url);
            });
        });
    }

    /**
     * Returns MP3 metadata from track
     */
    private async readTrackMetadata(track: File): Promise<MP3Metadata> {
        return readMP3Metadata(track);
    }

}