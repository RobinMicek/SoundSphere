<script lang="ts">
    import { Music } from "@lucide/svelte";
    import type { Playlist } from "$lib/entity/playlist";

    let { playlist, coverArtPromise, numberOfTracksPromise, onClick }: { playlist: Playlist, coverArtPromise: Promise<Blob>, numberOfTracksPromise: Promise<number>, onClick: () => Promise<void>;} = $props();
</script>

<div class="playlist-item">

    <button onclick={onClick} type="button">
        {#await coverArtPromise}
            <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
        {:then coverArt}
            {#await coverArt.text()}
                <img src="/placeholder-300x300.png" alt="Playlist cover art placeholder">
            {:then coverArtText}
                <img src={coverArtText} alt={`Playlist ${playlist.id}} cover art`}>
            {:catch err}
                <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
            {/await}
        {:catch err}
            <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
        {/await}

    </button>

    <h2>{playlist.name}</h2>

    <p>{playlist.description}</p>

    <div class="icon">
        <Music />
        {#await numberOfTracksPromise}
            Loading...
        {:then numberOfTracks}
            {numberOfTracks}
        {:catch err}
            Could not count tracks
        {/await}
    </div>
</div>
