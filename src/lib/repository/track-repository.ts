import { writable, type Writable } from "svelte/store";
import type { Track } from "../entity/track";
import { Repository } from "./repository";

export class TrackRepository extends Repository<Track> {
    private readonly objectStoreName = "tracks";
    
    constructor() {
        super();
    }
    
    async getAll(): Promise<Track[]> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as Track[]);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async get(id: number): Promise<Track> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result as Track);
            }

            request.onerror = () => reject(request.error);
        });

    }

    async save(entity: Omit<Track, "id">): Promise<Track> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.add(entity);

            request.onsuccess = () => {
                const savedEntity: Track = { ...entity, id: request.result as number };
                resolve(savedEntity);
            }

            request.onerror = () => reject(request.error);
        });

    }

    async update(id: number, entity: Track): Promise<Track> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);

            // Dont believe the id that is set on the entity itself
            entity.id = id;

            const request = store.put(entity);

            request.onsuccess = () => {
                const savedEntity: Track = { ...entity, id: request.result as number };
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
                resolve();
            }

            request.onerror = () => reject(request.error);
        });
    }
}
