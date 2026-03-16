<script lang="ts">
    import {secondsToString} from "$lib/util/time-convert";
    import {ArrowLeftToLine, ArrowRightToLine, ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX} from "@lucide/svelte";
    import type {Track} from "$lib/entity/track";
    import {clamp} from "$lib/util/clamp";
    import {onDestroy, onMount} from "svelte";
    import {getAnalyser} from "$lib/util/audio-analyzer";

    export let playlistCoverImageBlobPromise: () => Promise<Blob>;
    export let currentTrack: Track;
    export let progress: number;
    export let isPlaying: boolean;
    export let volume: number;
    export let isMuted: boolean;
    export let isFullscreenPlayerOpened: boolean;
    export let handleTogglePlay: () => Promise<void>;
    export let handlePlayPreviousTrack: () => Promise<void>;
    export let handlePlayNextTrack: () => Promise<void>;
    export let handleChangeVolume: (event: Event) => void;
    export let handleMute: () => void;
    export let handleToggleFullscreenPlayer: () => void;
    export let handleProgressChange: () => void;

    const BAR_SPACING = 2;
    const BAR_WIDTH = 10;
    const MIN_BAR_HEIGHT = 2;

    const MIN_SMOOTHING = 0.3;
    const MAX_SMOOTHING = 0.95;
    const REFERENCE_VISUALIZER_HEIGHT = 500; // Does not need to be precise, its used to calculate smoothing constant

    const FFT_SIZE = 256;

    let analyzer: AnalyserNode;
    let resizeObserver: ResizeObserver; // Used to calculate canvas dimensions on window resize

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let canvasWidth: number;
    let canvasHeight: number;

    let animationFrameId: number;

    function updateVisualizer() {
        if (!analyzer || !ctx || !canvas) return;

        const NUM_BARS = Math.floor(canvasWidth / (BAR_WIDTH + BAR_SPACING));
        const MAX_BAR_HEIGHT = canvasHeight;
        const MIDDLE_OF_CANVAS_HEIGHT = canvasHeight / 2;

        analyzer.fftSize = FFT_SIZE;

        const freqData = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(freqData);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < NUM_BARS; i++) {
            const startFrequencyIndex = i * (freqData.length / NUM_BARS);
            const endFrequencyIndex = (i + 1) * (freqData.length / NUM_BARS);

            let sum = 0;
            let count = 0;

            // Calculate average of frequencies
            for (let x = Math.floor(startFrequencyIndex); x < Math.ceil(endFrequencyIndex); x++) {
                sum += freqData[x] ?? 0;
                count++;
            }

            const avg = sum / count;

            const barHeight = clamp(avg, MIN_BAR_HEIGHT, MAX_BAR_HEIGHT);
            const x = i * (BAR_WIDTH + BAR_SPACING);
            const y = MIDDLE_OF_CANVAS_HEIGHT - barHeight;

            const hue = (i / NUM_BARS) * 360;
            ctx.fillStyle = `hsl(${hue},100%,50%)`;

            // Draw top half
            ctx.fillRect(x, y, BAR_WIDTH, barHeight);

            // Draw bottom half mirrored
            ctx.fillRect(x, MIDDLE_OF_CANVAS_HEIGHT, BAR_WIDTH, barHeight);

        }

        animationFrameId = requestAnimationFrame(updateVisualizer);
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;

        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        // Calculate smoothing based on canvas height
        analyzer.smoothingTimeConstant = clamp(canvasHeight / REFERENCE_VISUALIZER_HEIGHT, MIN_SMOOTHING, MAX_SMOOTHING);
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        analyzer = getAnalyser();

        resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas)
        resizeCanvas();

        updateVisualizer();
    })

    onDestroy(() => {
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId)
    })
</script>

<div class="fullscreen-player">

    <div class="minimize-player">
        <button onclick={handleToggleFullscreenPlayer}>
            {#if isFullscreenPlayerOpened} <ChevronDown /> {:else} <ChevronUp /> {/if}
        </button>
    </div>

    <div class="header">
        {#await playlistCoverImageBlobPromise}
            <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
        {:then coverArt}
            {#await coverArt.text()}
                <img src="/placeholder-300x300.png" alt="Playlist cover art placeholder">
            {:then coverArtText}
                <img src={coverArtText} alt={`Playlist cover art`}>
            {:catch err}
                <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
            {/await}
        {:catch err}
            <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
        {/await}

        <div class="info">
            <p class="name">{currentTrack?.name}</p>
            <p class="author">{currentTrack?.author}</p>
            <p class="album">{currentTrack?.album}</p>
        </div>
    </div>

    <canvas
        class="visualizer"
        bind:this={canvas}
    ></canvas>

    <div class="track-info">
        <p class="track-time">
            {#if currentTrack}
                {secondsToString(currentTrack.duration * progress)} / {secondsToString(currentTrack.duration)}
            {:else}
                00:00 / 00:00
            {/if}
        </p>

        <!-- Step determines how smooth the progress is -->
        <input
            type="range"
            value={progress}
            step="0.001"
            max="1"
            oninput={handleProgressChange}
        >
    </div>

    <div class="control-panel">
        <div class="volume">
            <button onclick={handleMute}>
                {#if isMuted} <VolumeX /> {:else} <Volume2 /> {/if}
            </button>

            <input
                type="range"
                step="0.01"
                min="0"
                max="1"
                bind:value={volume}
                oninput={handleChangeVolume}
            />
        </div>

        <div class="controls">
            <button onclick={handlePlayPreviousTrack}>
                <ArrowLeftToLine />
            </button>
            <button onclick={handleTogglePlay}>
                {#if isPlaying} <Pause /> {:else} <Play /> {/if}
            </button>

            <button onclick={handlePlayNextTrack}>
                <ArrowRightToLine />
            </button>
        </div>
    </div>
</div>