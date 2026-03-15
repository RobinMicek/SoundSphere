<script lang="ts">
    import {getContext, onMount} from 'svelte';
    import {writable, type Writable} from "svelte/store";
    import {CURRENTLY_PLAYING_TRACK_STORE_CONTEXT, PLAYLIST_SERVICE_CONTEXT, TRACK_SERVICE_CONTEXT} from "$lib/context"
    import type {PlaylistService} from "$lib/service/playlist-service";
    import type {TrackService} from "$lib/service/track-service";
    import type {Track} from "$lib/entity/track";
    import {navigate, route} from 'sv-router/generated';
    import type {Playlist} from "$lib/entity/playlist";
    import PlaylistDetail from "$lib/component/playlist/PlaylistDetail.svelte";
    import Button from "$lib/component/form/Button.svelte";
    import {CornerUpLeft} from "@lucide/svelte";
    import PlaylistEditModal from "$lib/component/playlist/PlaylistEditModal.svelte";
    import {triggerAlert} from "$lib/store/alert-store";
    import TrackEditModal from "$lib/component/track/TrackEditModal.svelte";
    import type {PersistentStore} from "$lib/types/persistent-store";
    import type {CurrentlyPlayingTrack} from "$lib/types/music-player";

    const playlistService = getContext<PlaylistService>(PLAYLIST_SERVICE_CONTEXT);
    const trackService = getContext<TrackService>(TRACK_SERVICE_CONTEXT);

    const currentlyPlayingTrackStore = getContext<PersistentStore<CurrentlyPlayingTrack>>(CURRENTLY_PLAYING_TRACK_STORE_CONTEXT);

    let isEditPlaylistModalOpened: boolean = false;
    let isEditPlaylistModalLoading: boolean = false;

    let currentlyEditedTrackId: number = -1; // This is set by function that opens edit modal and is used to select initial track data from the tracks array
    let isEditTrackModalOpened: boolean = false;
    let isEditTrackModalLoading: boolean = false;

    const params = route.getParams(`/playlist/:playlistId`);
    const playlistId = Number(params.playlistId);

    let playlist: Playlist;
    let tracks: Writable<Track[]> = writable([]);

    async function loadPlaylist(id: number) {
        playlistService.get(id)
            .then(p => playlist = p)
            .catch(e => triggerAlert("Failed to load playlist data", e.message, "error"))
    }

    async function deletePlaylist(id: number) {
        playlistService.get(id)
            // Delete all tracks in playlist
            .then(playlist =>
                Promise.all(playlist.trackIds.map(trackId => trackService.delete(trackId)))
            )
            .then(() => playlistService.delete(id))
            .then(() => {
                triggerAlert("Playlist successfully deleted", "", "success");
                navigate("/");
            })
            .catch(e => triggerAlert("Failed to delete playlist", e.message, "error"));
    }

    async function editPlaylist(id: number, playlistData: Playlist): Promise<void> {
        playlistService.update(id, playlistData)
            .then(p => playlist = p)
            .catch(e => triggerAlert("Failed to update playlist", e.message, "error"))
    }

    async function loadTracks(playlistId: number): Promise<void> {
        playlistService.getAllTracks(playlistId)
            .then(arr => tracks.set(playlistService.sortTracks(arr)))
            .catch(e => triggerAlert("Failed to load tracks", e.message, "error"))
    }

    async function addNewTracks(playlistId: number, files: File[]): Promise<void> {
        files.forEach(file => {
            trackService.create(file)
                .then((savedTrack: Track) => {
                    playlistService.addTrack(playlistId, savedTrack.id);
                    tracks.update(arr => playlistService.sortTracks([...arr, savedTrack]));
                })
                .catch(e => triggerAlert("Failed to add new tracks", e.message , "error"));
        });
    }

    async function deleteTrack(playlistId: number, trackId: number) {
        trackService.delete(trackId)
            .then(() => {
                playlist.trackIds = [...playlist.trackIds.filter(arr => arr.id != trackId)];
                playlistService.update(playlistId, playlist);

                tracks.update(arr => playlistService.sortTracks([...arr.filter(track => track.id !== trackId)]));

                triggerAlert("Track successfully deleted", "", "success");
            })
            .catch(e => triggerAlert("Failed to delete track", e.message, "error"));
    }

    async function editTrack(trackId: number, trackData: Track) {
        trackService.update(trackId, trackData)
            .then(updatedTrack =>
                tracks.update(tracks =>
                    playlistService.sortTracks([...tracks.filter(arr => arr.id !== trackId), updatedTrack])
                )
            )
            .catch(e => triggerAlert("Failed to update track data", e.message, "error"))
    }

    onMount(() => {
        loadPlaylist(playlistId);
        loadTracks(playlistId);
    });
</script>

{#if isEditPlaylistModalOpened}
    <PlaylistEditModal
        modalText="Edit playlist"
        initialPlaylistData={playlist}
        isLoading={isEditPlaylistModalLoading}
        onClose={() => {isEditPlaylistModalOpened = false}}
        onSubmit={(playlistData) => {
        isEditPlaylistModalOpened = true;
        editPlaylist(playlist.id, playlistData)
            .then(() => isEditPlaylistModalOpened = false)
            .finally(() => isEditPlaylistModalLoading = false)
        }}
    />
{/if}

{#if isEditTrackModalOpened}
    <TrackEditModal
        modalText="Edit track"
        initialTrackData={$tracks.filter(arr => arr.id === currentlyEditedTrackId)[0]}
        isLoading={isEditTrackModalLoading}
        onClose={() => {isEditTrackModalOpened = false}}
        onSubmit={(trackData) => {
        isEditTrackModalOpened = true;
        editTrack(currentlyEditedTrackId,  trackData)
            .then(() => isEditTrackModalOpened = false)
            .finally(() => isEditTrackModalLoading = false)

        }}
    />
{/if}


<Button
    text="All playlists"
    type="secondary"
    Icon={CornerUpLeft}
    onClick={() => navigate("/")}
/>

{#if playlist}
    <PlaylistDetail
        playlist={playlist}
        coverArtPromise={playlistService.getCoverArtBlob(playlist.id)}
        tracks={tracks}
        onClickEdit={() => isEditPlaylistModalOpened = true}
        onClickDelete={() => deletePlaylist(playlist.id)}
        onUploadNewTracks={(files) => addNewTracks(playlist.id, files)}
        onClickTrackDelete={(trackId) => deleteTrack(playlist.id, trackId)}
        onClickTrackEdit={(trackId) => {currentlyEditedTrackId = trackId; isEditTrackModalOpened = true;}}
        onClickTrackPlay={(trackId) => currentlyPlayingTrackStore.set({playlistId, trackId})}
    />
{/if}
