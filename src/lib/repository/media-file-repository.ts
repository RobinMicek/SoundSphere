import { writable, type Writable } from "svelte/store";
import { Repository } from "./repository";
import type { MediaFile } from "../entity/media-file";
import type { MediaType } from "../types/media-type";

export class MediaFileRepository extends Repository<MediaFile<MediaType>> {
    private readonly objectStoreName = "media_files";
    
    private readonly reactiveStore = writable<MediaFile<MediaType>[]>([]);

    constructor() {
        super();
    }
    
    async getAll(): Promise<Writable<MediaFile<MediaType>[]>> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.getAll();

            request.onsuccess = () => {
                this.reactiveStore.set(request.result as MediaFile<MediaType>[]);
                resolve(this.reactiveStore);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async get(id: number): Promise<MediaFile<MediaType>> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.get(id);

            request.onsuccess = () => {
                this.reactiveStore.update(arr => [...arr.filter(mediaFile => mediaFile.id !== id), request.result as MediaFile<MediaType>]);
                resolve(request.result as MediaFile<MediaType>);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async save(entity: Omit<MediaFile<MediaType>, "id">): Promise<MediaFile<MediaType>> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.add(entity);

            request.onsuccess = () => {
                const savedEntity: MediaFile<MediaType> = {...entity, id: request.result as number};
                
                this.reactiveStore.update(arr => [...arr, savedEntity]);
                resolve(savedEntity);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async update(id: number, entity: MediaFile<MediaType>): Promise<MediaFile<MediaType>> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            
            // Dont trust provided id on entity
            entity.id = id;

            const request = store.put(entity);

            request.onsuccess = () => {
                const savedEntity: MediaFile<MediaType> = {...entity, id: request.result as number};

                this.reactiveStore.update(arr => [...arr.filter(mediaFile => mediaFile.id !== id), savedEntity]);
                resolve(savedEntity);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async delete(id: number): Promise<void> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.delete(id);

            request.onsuccess = () => {
                this.reactiveStore.update(arr => [...arr.filter(mediaFile => mediaFile.id !== id)]);
                resolve();
            }

            request.onerror = () => reject(request.error);
        });
    }
}
