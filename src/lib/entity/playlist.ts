export interface Playlist {
    id: number;
    name: string;
    coverMediaFileId: number;
    description: string;
    trackIds: Set<number>;
}
