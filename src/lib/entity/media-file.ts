export interface MediaFile<T> {
    id: number;
    blob: Blob;
    type: T;
}