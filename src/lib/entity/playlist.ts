export interface Playlist {
    id: string
    name: string;
    description: string;
    trackIds: Set<number>
}