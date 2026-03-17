<script lang="ts">
    import type {Track} from "$lib/entity/track";
    import {Play, Pause, ArrowLeftToLine, ArrowRightToLine, Volume2, VolumeX, ChevronUp, ChevronDown} from "@lucide/svelte";
    import {secondsToString} from "$lib/util/time-convert";

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

<div class="small-player">
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

    <div class="track-info">
        <p class="track-name">{currentTrack?.author ? currentTrack.author + " - " : ""}{currentTrack?.name}</p>

        <!-- Step determines how smooth the progress is -->
        <input
            type="range"
            value={progress}
            step="0.001"
            max="1"
            oninput={handleProgressChange}
            disabled={currentTrack == null}
        >

        <p class="track-time">
            {#if currentTrack}
                {secondsToString(currentTrack.duration * progress)} / {secondsToString(currentTrack.duration)}
            {:else}
                00:00 / 00:00
            {/if}
        </p>
    </div>

    <div class="controls">
        <button onclick={handlePlayPreviousTrack} disabled={currentTrack == null}>
            <ArrowLeftToLine />
        </button>
        <button onclick={handleTogglePlay} disabled={currentTrack == null}>
            {#if isPlaying} <Pause /> {:else} <Play /> {/if}
        </button>

        <button onclick={handlePlayNextTrack} disabled={currentTrack == null}>
            <ArrowRightToLine />
        </button>

        <button onclick={handleToggleFullscreenPlayer}>
            {#if isFullscreenPlayerOpened} <ChevronDown /> {:else} <ChevronUp /> {/if}
        </button>
    </div>
</div>