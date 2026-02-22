<script lang="ts">
	import { getContext } from 'svelte';
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { PLAYLIST_SERVICE_CONTEXT } from "$lib/context"
    import type { PlaylistService } from "$lib/service/playlist-service";
    import type { Playlist } from "$lib/entity/playlist";
    import { navigate } from 'sv-router/generated';

    const playlistService = getContext<PlaylistService>(PLAYLIST_SERVICE_CONTEXT);

    let playlists: Writable<Playlist[]> = writable([]);

    async function loadPlaylists(): Promise<void> {
        try {
            playlists.set(await playlistService.getAll());
        } catch (e) {
            alert(e);
        }
    }

    async function addPlaylist(): Promise<void> {
        try {
            const newPlaylist = await playlistService.create({
                name: "new playlist",
                description: "my new playlist",
                trackIds: []
            });

            playlists.update(arr => [...arr, newPlaylist]);

        } catch (e) {
            alert(e);
        }
    }

    onMount(() => {
        loadPlaylists();
    });
</script>

<h1>Playlists</h1>
<button onclick={addPlaylist}>Add new playlist</button>
<ul>
    {#each $playlists as playlist}
        <li>
            <img src={""} alt="">
            <p>Name: {playlist.name}</p>
            <button onclick={() => navigate(`/playlist/:playlistId`, { params: { playlistId: playlist.id }})}>View</button>
        </li>
    {/each}
</ul>