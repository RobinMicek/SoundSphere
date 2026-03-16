// Doing this separately from the actual audio visualizer to make sure only one instance of audio context
// exits at any given time. Multiple context cause the audio to clip.

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;

/**
 * Sets audio context and connects it to analyzer
 */
export async function initAudio(audio: HTMLAudioElement): Promise<void> {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

        analyser = audioCtx.createAnalyser();

        source = audioCtx.createMediaElementSource(audio);

        source.connect(audioCtx.destination);
        source.connect(analyser);
    }

    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
}

/**
 * Returns audio analyzer
 */
export function getAnalyser() {
    return analyser;
}