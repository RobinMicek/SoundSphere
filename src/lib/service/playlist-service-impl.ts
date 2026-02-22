import type { PlaylistService } from "./playlist-service";
import type { Playlist } from "../entity/playlist";
import type { Track } from "../entity/track";
import { MediaType } from "../types/media-type";
import type { Repository } from "../repository/repository";
import type { MediaFile } from "../entity/media-file";
import { generatePolynomialdHash } from "../util/seed";

export class PlaylistServiceImpl implements PlaylistService {
    
    private readonly playlistRepository: Repository<Playlist>;
    private readonly trackRepository: Repository<Track>;
    private readonly mediaFileRepository: Repository<MediaFile<MediaType>>

    constructor(playlistRepository: Repository<Playlist>, trackRepository: Repository<Track>, mediaFileRepository: Repository<MediaFile<MediaType>>) {
        this.playlistRepository = playlistRepository;
        this.trackRepository = trackRepository;
        this.mediaFileRepository = mediaFileRepository
    }

    async getAll(): Promise<Playlist[]> {
        return this.playlistRepository.getAll();
    }

    async get(id: number): Promise<Playlist> {
        return this.playlistRepository.get(id);
    }

    async create(entity: Omit<Playlist, "id">): Promise<Playlist> {
        const coverArtSeed: number = generatePolynomialdHash(entity.name);
        // TODO: Create and save covert art

        return this.playlistRepository.save(entity);
    }
    
    async update(id: number, entity: Playlist): Promise<Playlist> {
        const coverArtSeed: number = generatePolynomialdHash(entity.name);
        // TODO: Remove old, create and save covert art

        return this.playlistRepository.update(id, entity);
    }
    
    async delete(id: number): Promise<void> {
        return this.playlistRepository.delete(id);
    }
    
    async getAllTracks(id: number): Promise<Track[]> {
        const playlist: Playlist = await this.playlistRepository.get(id);

        return this.trackRepository.getMany(playlist.trackIds);
    }
    
    async getCoverArtUrl(id: number): Promise<string | null> {
        const playlist: Playlist = await this.playlistRepository.get(id);
        const coverArt: MediaFile<MediaType> = await this.mediaFileRepository.get(playlist.coverMediaFileId);

        if (coverArt.type !== MediaType.SVG) return null;

        return URL.createObjectURL(coverArt.blob);
    }

}