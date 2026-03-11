import type {Subscriber, Unsubscriber} from "svelte/store";

export interface PersistentStore<T> {
    subscribe: {
        (this: void, run: Subscriber<T | null>, invalidate?: (() => void) | undefined): Unsubscriber;
        (this: void, run: Subscriber<T | null>, invalidate?: (() => void) | undefined): Unsubscriber;
    }
    set: (value: T | null) => void;
    remove: () => void;
    get: () => T | null;
}
