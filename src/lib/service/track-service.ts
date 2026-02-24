import type { Track } from "../entity/track";

export interface TrackService {
    
    /**
     * Retrieves all tracks
     */
    getAll(): Promise<Track[]>

    /**
     * Retrieves track
     */
    get(id: number): Promise<Track>

    /**
     * Creates new track using the medatada from audio file
     */
    create(audioFile: File): Promise<Track>

    /**
     * Updates existing track metadata
     */
    update(id: number, entity: Track): Promise<Track>

    /**
     * Deletes existing track
     */
    delete(id: number): Promise<void>

    /**
     * Returns audio blob for given track
     */
    getAudioBlob(id: number): Promise<Blob>

}