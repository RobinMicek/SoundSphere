export interface MediaFile<MediaType> {
    id: number;
    blob: Blob;
    type: MediaType;
}