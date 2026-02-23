import type {MediaFile} from "../entity/media-file";
import type {Track} from "../entity/track";
import type {Repository} from "../repository/repository";
import {MediaType} from "../types/media-type";
import type {TrackService} from "./track-service";


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
        const duration: number = await this.readMP3Duration(audioFile);

        if (!duration) throw new Error("Could not parse duration from uploaded file");

        const entity: Omit<Track, "id"> = {
            name: audioFile.name ?? "Unnamed track",
            author: "Unknown",
            album: undefined,
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

}