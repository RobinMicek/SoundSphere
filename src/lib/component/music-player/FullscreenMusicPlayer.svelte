<script lang="ts">
    import {secondsToString} from "$lib/util/time-convert";
    import {ArrowLeftToLine, ArrowRightToLine, ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX} from "@lucide/svelte";
    import type {Track} from "$lib/entity/track";

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

    <div class="visualizer">
        <canvas></canvas>
    </div>

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