import type {PlaylistService} from "./playlist-service";
import type {Playlist} from "../entity/playlist";
import type {Track} from "../entity/track";
import {MediaType} from "../types/media-type";
import type {Repository} from "../repository/repository";
import type {MediaFile} from "../entity/media-file";
import {generatePolynomialdHash} from "../util/seed";
import {createSVGColoredGrid, generatePerlinGrid, perlinToColorRGB} from "$lib/util/perlin";
import {
    PLAYLIST_COVER_ART_PERLIN_SCALE,
    PLAYLIST_COVER_ART_PERLIN_SIZE,
    PLAYLIST_COVER_ART_SVG_CELL_SIZE
} from "$lib/constants";

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
        // Generate cover art
        const coverArtSvg: string = this.createCoverArt(entity.name);

        // Save cover art and update cover art id on entity
        entity.coverMediaFileId = await this.saveCoverArt(coverArtSvg);

        return this.playlistRepository.save(entity);
    }
    
    async update(id: number, entity: Playlist): Promise<Playlist> {
        // Remove old cover art
        await this.mediaFileRepository.delete(entity.coverMediaFileId);

        // Generate cover art
        const coverArtSvg: string = this.createCoverArt(entity.name);

        // Save cover art and update cover art id on entity
        entity.coverMediaFileId = await this.saveCoverArt(coverArtSvg);

        return this.playlistRepository.update(id, entity);
    }
    
    async delete(id: number): Promise<void> {
        return this.playlistRepository.delete(id);
    }

    async getAllTracks(id: number): Promise<Track[]> {
        const playlist: Playlist = await this.playlistRepository.get(id);

        return this.trackRepository.getMany(playlist.trackIds);
    }

    async addTrack(id: number, trackId: number): Promise<Playlist> {
        const playlist: Playlist = await this.playlistRepository.get(id);
        playlist.trackIds = [...playlist.trackIds.filter(t => t !== trackId), trackId];

        return await this.playlistRepository.update(id, playlist);
    }

    async deleteTrack(id: number, trackId: number): Promise<Playlist> {
        const playlist: Playlist = await this.playlistRepository.get(id);
        playlist.trackIds = [...playlist.trackIds.filter(t => t !== trackId)];

        return await this.playlistRepository.update(id, playlist);
    }
    
    async getCoverArtBlob(id: number): Promise<Blob> {
        const playlist: Playlist = await this.playlistRepository.get(id);
        const coverArt: MediaFile<MediaType> = await this.mediaFileRepository.get(playlist.coverMediaFileId);

        if (coverArt.type !== MediaType.SVG) throw new Error(`Cover art for playlist ${id} is not SVG`);

        return coverArt.blob;
    }

    /**
     * Generates new perlin noise svg using playlist name as seed and returns svg string
     */
    private createCoverArt(playlistName: string) {
        const seed = generatePolynomialdHash(playlistName);
        const perlinGrid: number[][] = generatePerlinGrid(PLAYLIST_COVER_ART_PERLIN_SIZE, PLAYLIST_COVER_ART_PERLIN_SIZE, seed, PLAYLIST_COVER_ART_PERLIN_SCALE);

        return createSVGColoredGrid(perlinGrid, perlinToColorRGB, PLAYLIST_COVER_ART_SVG_CELL_SIZE)
    }

    /**
     * Saves cover art as media file and returns id
     */
    private async saveCoverArt(svgString: string): Promise<number> {
        const { id } = await this.mediaFileRepository.save({
            blob: new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }),
            type: MediaType.SVG
        });

        return id;
    }

}