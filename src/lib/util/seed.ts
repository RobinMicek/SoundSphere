/**
 * Generates 32-bit integer hash out of string using polynomial hash algorithm
 */
export function generatePolynomialdHash(text: string): number {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0; // convert to 32-bit integer
    }

    return hash;
}