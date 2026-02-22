import { writable, type Writable } from "svelte/store";
import { Repository } from "./repository";
import type { Playlist } from "../entity/playlist";

export class PlaylistRepository extends Repository<Playlist> {
    private readonly objectStoreName = "playlists";
    
    constructor() {
        super();
    }
    
    async getAll(): Promise<Playlist[]> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as Playlist[]);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async get(id: number): Promise<Playlist> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result as Playlist);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async save(entity: Omit<Playlist, "id">): Promise<Playlist> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.add(entity);

            request.onsuccess = () => {
                const savedEntity: Playlist = {...entity, id: request.result as number};                
                resolve(savedEntity);
            }

            request.onerror = () => reject(request.error);
        });
    }

    async update(id: number, entity: Playlist): Promise<Playlist> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readwrite");
            const store = transaction.objectStore(this.objectStoreName);
            
            // Dont trust provided id on entity
            entity.id = id;

            const request = store.put(entity);

            request.onsuccess = () => {
                const savedEntity: Playlist = {...entity, id: request.result as number};
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
