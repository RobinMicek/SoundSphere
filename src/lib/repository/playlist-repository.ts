import { writable, type Writable } from "svelte/store";
import { Repository } from "./repository";
import type { Playlist } from "../entity/playlist";

export class PlaylistRepository extends Repository<Playlist> {
    private readonly objectStoreName = "playlists";
    
    private readonly reactiveStore = writable<Playlist[]>([]);

    constructor() {
        super();
    }
    
    async getAll(): Promise<Writable<Playlist[]>> {
        const db = await this.dbPromise;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.objectStoreName, "readonly");
            const store = transaction.objectStore(this.objectStoreName);
            const request = store.getAll();

            request.onsuccess = () => {
                this.reactiveStore.set(request.result as Playlist[]);
                resolve(this.reactiveStore);
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
                this.reactiveStore.update(arr => [...arr.filter(playlist => playlist.id !== id, request.result as Playlist)]);
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
                
                this.reactiveStore.update(arr => [...arr, savedEntity]);
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

                this.reactiveStore.update(arr => [...arr.filter(playlist => playlist.id !== id), savedEntity]);
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
                this.reactiveStore.update(arr => [...arr.filter(playlist => playlist.id !== id)]);
                resolve();
            }

            request.onerror = () => reject(request.error);
        });
    }
}
