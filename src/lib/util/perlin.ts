import { createNoise2D } from 'simplex-noise';
import {mulberry32 } from "$lib/util/mulberry";
import {SVG_NAMESPACE} from "$lib/constants";

/**
 * Generates seeded x by y perlin noise grid
 */
export function generatePerlinGrid(width: number, height: number, seed: number = 0, scale: number = 0.2): number[][] {
    const noise2D = createNoise2D(mulberry32(seed));

    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            const value = noise2D(x * scale, y * scale);
            row.push(value);
        }
        grid.push(row);
    }
    return grid;
}

/**
 * Maps numbers between -1 and 1 to values 0 - 255
 * @author ChatGPT
 */
export function perlinToColorRGB(value: number): [number, number, number] {
    value = Math.max(-1, Math.min(1, value));
    const t = (value + 1) / 2; // normalize 0-1

    // Red ramps up quickly, then slowly saturates
    const r = Math.round(Math.min(255, Math.max(0, Math.pow(t, 0.3) * 255)));

    // Green has a bell curve peak in the middle
    const g = Math.round(Math.min(255, Math.max(0, Math.exp(-Math.pow((t - 0.5) * 5, 2)) * 255)));

    // Blue drops sharply at first, then slowly fades
    const b = Math.round(Math.min(255, Math.max(0, (1 - Math.pow(t, 2)) * 255)));
    
    return [r, g, b];
}


/**
 * Creates SVG grid with colored cells determined by color function
 * Takes grid of the same size with numbers and function that maps those numbers into rgs colors
 */
export function createSVGColoredGrid(values: number[][], colorFunction: (value: number) => [number, number, number], cellSize: number = 1): string {
    const gridColors: string[][] = values.map((row) =>
        row.map((cell) => {
            const rgb: [number, number, number] = colorFunction(cell);
            return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        })
    );

    const numberOfRows: number = values.length;
    const numberOfCols: number = values[0].length;

    // Create SVG container
    const svg: HTMLElement = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("height", (numberOfRows * cellSize).toString())
    svg.setAttribute("width", (numberOfCols * cellSize).toString())

    // Fill SVG with colored rectangles
    for (let y = 0; y < numberOfRows; y++) {
        for (let x = 0; x < numberOfCols; x++) {
            const rectangle: SVGRectElement = document.createElementNS(SVG_NAMESPACE, "rect");
            rectangle.setAttribute("x", (x * cellSize).toString());
            rectangle.setAttribute("y", (y * cellSize).toString());
            rectangle.setAttribute("width", cellSize.toString());
            rectangle.setAttribute("height", cellSize.toString());
            rectangle.setAttribute("fill", gridColors[y][x]);
            svg.appendChild(rectangle)
        }
    }

    // Serialize to xml string
    const serializer: XMLSerializer = new XMLSerializer();
    const svgString: string = serializer.serializeToString(svg);

    return `data:image/svg+xml;base64,${btoa(svgString)}`

}