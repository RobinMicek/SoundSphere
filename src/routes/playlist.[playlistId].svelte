<script lang="ts">
    import {getContext, onMount} from 'svelte';
    import {writable, type Writable} from "svelte/store";
    import {PLAYLIST_SERVICE_CONTEXT, TRACK_SERVICE_CONTEXT} from "$lib/context"
    import type {PlaylistService} from "$lib/service/playlist-service";
    import type {TrackService} from "$lib/service/track-service";
    import type {Track} from "$lib/entity/track";
    import {route} from 'sv-router/generated';

    const playlistService = getContext<PlaylistService>(PLAYLIST_SERVICE_CONTEXT);
    const trackService = getContext<TrackService>(TRACK_SERVICE_CONTEXT);

    const params = route.getParams(`/playlist/:playlistId`);
    const playlistId = Number(params.playlistId);

    let tracks: Writable<Track[]> = writable([]);

    async function loadTracks(playlistId: number): Promise<void> {
        playlistService.getAllTracks(playlistId)
            .then(arr => tracks.set(arr))
            .catch(alert);
    }

    async function handleFileChange(event): Promise<void> {
        await addNewTrack(event.target.files[0]);
    }

    async function addNewTrack(file: File): Promise<void> {
        trackService.create(file)
            .then((savedTrack: Track) => {
                playlistService.addTrack(playlistId, savedTrack.id);
                tracks.update(arr => [...arr, savedTrack]);
            })
            .catch(console.error);
    }

    onMount(() => {
        loadTracks(playlistId);
    });
</script>

<h1>Playlists #{playlistId}</h1>

<input type="file" accept=".mp3" onchange={handleFileChange} >

{#each $tracks as track}
    <p>
        Name: {track.name}
        | Author: {track.author}
        | Duration: {track.duration}
    </p>
{/each}