export interface Track {
    id: number;
    name: string;
    author: string;
    album?: string;
    audioMediaFileId: number;
    duration: number;
    addedAt: Date;
}