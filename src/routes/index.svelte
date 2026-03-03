<script lang="ts">
    import {getContext, onMount} from 'svelte';
    import {writable, type Writable} from "svelte/store";
    import {PLAYLIST_SERVICE_CONTEXT} from "$lib/context";
    import type {PlaylistService} from "$lib/service/playlist-service";
    import type {Playlist} from "$lib/entity/playlist";
    import {navigate} from 'sv-router/generated';
    import PlaylistsGridItem from "$lib/component/playlist/PlaylistsGridItem.svelte";
    import PlaylistEditModal from "$lib/component/playlist/PlaylistEditModal.svelte";
    import {Plus} from "@lucide/svelte";
    import Button from "$lib/component/form/Button.svelte";
    import {triggerAlert} from "$lib/store/alert-store";

    const playlistService = getContext<PlaylistService>(PLAYLIST_SERVICE_CONTEXT);

    let playlists: Writable<Playlist[]> = writable([]);

    let isCreateNewPlaylistModalOpened: boolean = false;
    let isCreateNewPlaylistModalLoading: boolean = false;

    async function loadPlaylists(): Promise<void> {
        playlistService.getAll()
            .then(arr => playlists.set(arr))
            .catch((err => triggerAlert("Failed to load playlists", err.message, "error")));
    }

    async function addPlaylist(name: string, description: string): Promise<void> {
        playlistService.create({
            name: name,
            description: description,
            trackIds: []
        })
            .then((newPlaylist: Playlist) => {
                playlists.update(arr => [...arr.filter(playlist => playlist.id !== newPlaylist.id), newPlaylist]);
                triggerAlert("New playlist successfully created", "", "success");
            })
            .catch((err) => triggerAlert("Failed to create playlist", err.message, "error"));
    }

    onMount(() => {
        loadPlaylists();
    });
</script>

<div class="button-group right">
    <Button
        text="New playlist"
        type="secondary"
        Icon={Plus}
        onClick={() => isCreateNewPlaylistModalOpened = true}
    />
</div>

{#if $playlists.length < 1}
    <p class="centered bold note">Oh Naur. You don't have any playlists. How sad. <br> Create one by clicking the button above.</p>
{/if}

{#if isCreateNewPlaylistModalOpened}
    <PlaylistEditModal
        modalText="New playlist"
        bind:isLoading={isCreateNewPlaylistModalLoading}
        onClose={() => {isCreateNewPlaylistModalOpened = false}}
        onSubmit={(playlist) => {
            isCreateNewPlaylistModalLoading = true;
            addPlaylist(playlist.name, playlist.description)
                .then(() => {
                    isCreateNewPlaylistModalOpened = false;
                })
                .finally(() => isCreateNewPlaylistModalLoading = false);
        }}
    />
{/if}

<div class="playlist-grid">
    {#each $playlists as playlist}
        <PlaylistsGridItem
            playlist={playlist}
            coverArtPromise={playlistService.getCoverArtBlob(playlist.id)}
            numberOfTracksPromise="{playlistService.getTrackCount(playlist.id)}"
            onClick={() => navigate(`/playlist/:id`, { params: { id: playlist.id } })}
        />
    {/each}
</div>