<script lang="ts">
    import {SquarePen, Trash} from "@lucide/svelte";
    import Button from "$lib/component/form/Button.svelte";
    import TracksList from "$lib/component/playlist/TracksList.svelte";

    export let playlist: Playlist;
    export let coverArtPromise: () => Promise<Blob>;
    export let tracks: writable<Track[]>;
    export let onClickEdit: () => Promise<void>;
    export let onClickDelete: () => Promise<void>;
    export let onClickTrackEdit: (trackId: number) => Promise<void>;
    export let onClickTrackPlay: (playlistId: number, trackId: number) => Promise<void>;
    export let onClickTrackDelete: (playlistId: number, trackId: number) => Promise<void>;
</script>

<div class="playlist">
    <div class="header">
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
        {:catch err}y
            <img src="/placeholder-playlist-cover-art.svg" alt="Playlist cover art placeholder">
        {/await}

        <div class="info">
            <h1>{playlist.name}</h1>

            <p>{playlist.description}</p>
        </div>
    </div>

    <div class="button-group left">
        <Button
            text="Edit"
            type="accent"
            Icon={SquarePen}
            onClick={onClickEdit}
        />

        <Button
            text="Delete"
            type="destructive"
            Icon={Trash}
            onClick={onClickDelete}
        />
    </div>

    {#if $tracks.length > 0}
        <TracksList
            tracks={tracks}
            onClickTrackEdit={onClickTrackEdit}
            onClickTrackPlay={(trackId) => onClickTrackPlay(playlist.id, trackId)}
            onClickTrackDelete={(trackId) => onClickTrackDelete(playlist.id, trackId)}
        />
    {:else}
        <p class="note centered bold">
            There are no tracks in this playlist! <br><br> Add Some.
        </p>
    {/if}

</div>