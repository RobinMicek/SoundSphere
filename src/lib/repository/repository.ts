import type { Writable } from "svelte/store";

abstract class Repository<T> {
    /** 
     * Returns reactive store with all entites (this store gets updated as entites change)
     */
    abstract getAll(): Writable<T>;

    /**
     * Retrieves entity
     */
    abstract get(id: number): T;

    /**
     * Saves new entity
     */
    abstract save(entity: T): T;

    /**
     * Updated existing entity
     */
    abstract update(id: number, entity: T): T;

    /**
     * Deletes existing entity
     */
    abstract delete(id: number): T;
}