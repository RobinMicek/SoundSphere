import type { MediaType } from "../types/media-type";

export interface MediaFile<T extends MediaType> {
    id: number;
    blob: Blob;
    type: T;
}
