import type { Playlist } from "../entity/playlist";
import type { Track } from "../entity/track";

export interface PlaylistService {

    /**
     * Returns reactive store of all playlists
     */
    getAll(): Promise<Playlist[]>

    /**
     * Retrieves playlist
     */
    get(id: number): Promise<Playlist>

    /**
     * Creates new playlist
     */
    create(entity: Omit<Playlist, "id">): Promise<Playlist>
    
    /**
     * Updates existing playlist
     */
    update(id: number, entity: Playlist): Promise<Playlist>
    
    /**
     * Deletes existing playlist
     */
    delete(id: number): Promise<void>
    
    /**
     * Returns reactive store of all tracks for given playlist
     */
    getAllTracks(id: number): Promise<Track[]>
    
    /**
     * Returns cover art url (can be directly pasted into img tag)
     */
    getCoverArtUrl(id: number): Promise<string | null>

}