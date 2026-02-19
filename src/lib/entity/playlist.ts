export interface Playlist {
    id: string
    name: string;
    cover: Blob;
    description: string;
    trackIds: Set<number>
}