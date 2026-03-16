<script lang="ts">
    import type {PlaylistService} from "$lib/service/playlist-service";
    import type {TrackService} from "$lib/service/track-service";
    import type {Track} from "$lib/entity/track";
    import {onDestroy, onMount} from "svelte";
    import type {PersistentStore} from "$lib/types/persistent-store";
    import type {CurrentlyPlayingTrack} from "$lib/types/music-player";
    import SmallMusicPlayer from "$lib/component/music-player/SmallMusicPlayer.svelte";
    import FullscreenMusicPlayer from "$lib/component/music-player/FullscreenMusicPlayer.svelte";
    import {triggerAlert} from "$lib/store/alert-store";
    import {clamp} from "$lib/util/clamp";
    import {initAudio} from "$lib/util/audio-analyzer";

    const { currentlyPlayingTrackStore, playlistService, trackService } = $props<{
        currentlyPlayingTrackStore: PersistentStore<CurrentlyPlayingTrack>
        playlistService: PlaylistService;
        trackService: TrackService;
    }>();

    // Using states otherwise the effects and listeners wont work correctly
    // ↓ These are just for reactivity, we dont touch these directly, they are updated via listeners
    let isPlaying: boolean = $state();
    let volume: number = $state(1);
    let isMuted: boolean = $state(false);
    let progress: number = $state(0);
    let playlistCoverImageBlobPromise: () => Promise<Blob>;
    // ↑ These are just for reactivity, we dont touch these directly, they are updated via listeners

    let isFullscreenPlayerOpened: boolean = $state(false);

    let audio: HTMLAudioElement = $state(new Audio());

    let currentTrack: Track = $state();
    let currentTrackUrl: string = $state();

    function handleToggleFullscreenPlayer(): void {
        isFullscreenPlayerOpened = !isFullscreenPlayerOpened;

    }

    async function handlePlayPreviousTrack(): Promise<void> {
        const playlistId = currentlyPlayingTrackStore.get().playlistId;
        const currentTrackId = currentlyPlayingTrackStore.get().trackId;

        if (!playlistId || !currentTrackId) return;

        playlistService.getPreviousTrack(playlistId, currentTrackId)
            .then((previousTrack: Track) => currentlyPlayingTrackStore.set({
                playlistId: playlistId,
                trackId: previousTrack.id
            }))
            .catch((e) => triggerAlert("Could not play previous track", e.message, "error"))
    }

    async function handlePlayNextTrack(): Promise<void> {
        const playlistId = currentlyPlayingTrackStore.get().playlistId;
        const currentTrackId = currentlyPlayingTrackStore.get().trackId;

        if (!playlistId || !currentTrackId) return;

        playlistService.getNextTrack(playlistId, currentTrackId)
            .then((nextTrack: Track) => currentlyPlayingTrackStore.set({
                playlistId: playlistId,
                trackId: nextTrack.id
            }))
            .catch((e) => triggerAlert("Could not play previous track", e.message, "error"))
    }

    function handleMute(): void {
        audio.muted = !audio.muted;

        audio.volume = audio.muted ? 0 : 1; // For sync with audio slider
    }

    function handleChangeVolume(event: Event): void {
        const target = event.target as HTMLInputElement;
        audio.volume = clamp(Number(target.value), 0, 1)
    }

    async function handleTogglePlay(): Promise<void> {
        try {
            if (audio.paused) {
                await audio.play();
            } else {
                audio.pause();
            }
        } catch (_) {}
    }

    function handleProgressChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newProgress: number = clamp(Number(target.value), 0, 1);

        if (audio.duration) {
            audio.currentTime = newProgress * audio.duration;
        }
    }

    async function loadTrack(trackId: number) {
        trackService.get(trackId)
            .then((track: Track) => {
                currentTrack = track;
                return trackService.getAudioBlob(currentTrack.id);
            })
            .then((blob: Blob) => {
                currentTrackUrl = URL.createObjectURL(blob);
                audio.src = currentTrackUrl;

                return audio.play();
            })
            .catch((e) => {
                // This error happens then the track is trying to be played automatically without previous user interaction
                // Happens when loading track from local storage (previously played) on page load
                // If this happens, do nothing, since we didnt want to play track automatically in the first place, so it ok
                if (e?.name === "NotAllowedError") {
                    return;
                }

                triggerAlert("Cannot play this track", e.message, "error");
            });
    }

    // handle play new song
    $effect(() => {
        if (!$currentlyPlayingTrackStore) return;

        loadTrack(currentlyPlayingTrackStore.get().trackId);
    });

    onMount(() => {
        // Create audio analyzer for the visualizer
        initAudio(audio);
    })

    // destroy track blob url when this component is destroyed
    onDestroy(() => {
        if (currentTrackUrl) URL.revokeObjectURL(currentTrackUrl);
    })
</script>

<audio
    bind:this={audio}
    ontimeupdate={() => {
        progress = audio.currentTime / audio.duration || 0;
    }}
    onvolumechange={() => {
        volume = audio.volume;
        isMuted = audio.muted;
    }}
    onpause={() => isPlaying = false}
    onplay={() => isPlaying = true}
    onended={() => {
        audio.currentTime = 0;
        handlePlayNextTrack();
    }}
></audio>

<div class="music-player">
    {#if isFullscreenPlayerOpened}

        <FullscreenMusicPlayer
            playlistCoverImageBlobPromise={playlistService.getCoverArtBlob($currentlyPlayingTrackStore.playlistId)}
            currentTrack={currentTrack}
            progress={progress}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            isFullscreenPlayerOpened={isFullscreenPlayerOpened}

            handleTogglePlay={handleTogglePlay}
            handlePlayPreviousTrack={handlePlayPreviousTrack}
            handlePlayNextTrack={handlePlayNextTrack}
            handleChangeVolume={handleChangeVolume}
            handleMute={handleMute}
            handleToggleFullscreenPlayer={handleToggleFullscreenPlayer}
            handleProgressChange={handleProgressChange}
        />

    {:else}
        <SmallMusicPlayer
            currentTrack={currentTrack}
            progress={progress}
            isPlaying={isPlaying}
            volume={volume}
            isMuted={isMuted}
            isFullscreenPlayerOpened={isFullscreenPlayerOpened}

            handleTogglePlay={handleTogglePlay}
            handlePlayPreviousTrack={handlePlayPreviousTrack}
            handlePlayNextTrack={handlePlayNextTrack}
            handleChangeVolume={handleChangeVolume}
            handleMute={handleMute}
            handleToggleFullscreenPlayer={handleToggleFullscreenPlayer}
            handleProgressChange={handleProgressChange}
        />
    {/if}
</div>
