/**
 * Converts second to minutes and seconds string
 * e.g. 61 => 1:01
 */
export function secondsToString(seconds: number): string {
    seconds = Math.round(seconds); // Get rid of milliseconds
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}