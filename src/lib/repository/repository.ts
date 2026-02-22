import type { Writable } from "svelte/store";
import { DATABASE_NAME, DATABASE_VERSION } from "../constants";

export abstract class Repository<T> {
    protected dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.openDB();
    }

    /** 
     * Retrieves all entities
     */
    abstract getAll(): Promise<T[]>;

    /**
     * Returns subset of all entities filtered by their ids
     */
    abstract getMany(ids: number[]): Promise<T[]>

    /**
     * Retrieves entity
     */
    abstract get(id: number): Promise<T>;

    /**
     * Saves new entity
     */
    abstract save(entity: Omit<T, "id">): Promise<T>;

    /**
     * Updated existing entity
     */
    abstract update(id: number, entity: T): Promise<T>;

    /**
     * Deletes existing entity
     */
    abstract delete(id: number): Promise<void>;

    /**
     * Creates new database connection
     */
    openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

            request.onsuccess = () =>resolve(request.result);
            request.onerror = () => reject(request.error);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                const tables = ["playlists", "tracks", "media_files"]

                tables.forEach(table => {
                    if (!db.objectStoreNames.contains(table)) {
                        db.createObjectStore(table, { keyPath: "id", autoIncrement: true });
                    }    
                });        
            }
        });
    }
}