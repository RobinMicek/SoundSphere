<script lang="ts">
	import { getContext } from 'svelte';
    import { writable, type Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { PLAYLIST_SERVICE_CONTEXT } from "../lib/context"
    import type { PlaylistService } from "../lib/service/playlist-service";
    import type { Playlist } from "../lib/entity/playlist";

    const playlistService = getContext<PlaylistService>(PLAYLIST_SERVICE_CONTEXT);

    let playlists: Writable<Playlist[]> = writable([]);

    async function loadPlaylists(): Promise<void> {
        try {
            playlists.set(await playlistService.getAll());
        } catch (e) {
            alert(e);
        }
    }

    onMount(() => {
        loadPlaylists();
    });
</script>

<h1>Playlists</h1>
{#each $playlists as playlist}
    <img src={""} alt="">
    <p>Name: {playlist.name}</p>
{/each}