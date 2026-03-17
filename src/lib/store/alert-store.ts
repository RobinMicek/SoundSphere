import { writable } from 'svelte/store';
import {ALERT_TIMEOUT_MS, LOG_ALERTS_IN_CONSOLE} from "../constants";

export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
    id: number; // unique id for each alert
    title: string;
    description: string | null;
    type: AlertType;
}

const alerts = writable<Alert[]>([]);

let nextId = 1;

export function triggerAlert(title: string, description: string | null = null, type: AlertType = 'info',  duration: number = ALERT_TIMEOUT_MS) {
    const id = nextId++;
    const newAlert: Alert = {
        id,
        title,
        description,
        type
    };

    alerts.update((all) => [...all, newAlert]);

    if (LOG_ALERTS_IN_CONSOLE) {
        switch (type) {
            case "success": console.log(title, description); break;
            case "info": console.log(title, description); break;
            case "error": console.error(title, description); break;
        }
    }

    setTimeout(() => {
        // remove alert after duration
        alerts.update((all) => all.filter((a) => a.id !== id));
    }, duration);
}

export default alerts;