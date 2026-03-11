import {get as getStoreValue, writable} from "svelte/store";
import {getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem} from "../util/local-storage";
import type {PersistentStore} from "../types/persistent-store";

/**
 * Create a persistent Svelte store backed by localStorage.
 *
 * This look so overkill, because I stole it from one of my other projects (github.com/robinmicek/sendinel) :)
 *
 * @param key - localStorage key
 * @param initial - default value if nothing is stored
 * @param maxAgeMs - optional maximum age in ms. If exceeded, the stored value is invalidated.
 */
export function createPersistentStore<T>(key: string, initial: T | null, maxAgeMs?: number): PersistentStore<T> {
    // Loader with expiration check
    function load(): T | null {
        if (maxAgeMs) {
            const data = getLocalStorageItem<{ value: T; timestamp: number } | null>(key, null);
            if (!data) return initial;

            const now = Date.now();
            if (now - data.timestamp > maxAgeMs) {
                removeLocalStorageItem(key);
                return initial;
            }
            return data.value;
        } else {
            return getLocalStorageItem<T | null>(key, initial);
        }
    }

    const store = writable<T | null>(load());

    return {
        subscribe: store.subscribe,
        set: (value: T | null) => {
            store.set(value);
            if (value !== null) {
                if (maxAgeMs) {
                    setLocalStorageItem(key, { value, timestamp: Date.now() });
                } else {
                    setLocalStorageItem(key, value);
                }
            } else {
                removeLocalStorageItem(key);
            }
        },
        remove: () => {
            store.set(null);
            removeLocalStorageItem(key);
        },
        get: (): T | null => {
            // Check in-memory first
            let value = getStoreValue(store);

            if (value === null) {
                value = load();
                if (value !== null) {
                    store.set(value); // rehydrate memory
                }
            }
            return value;
        }
    };
}