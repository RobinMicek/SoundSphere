<script lang="ts">
    import {SquarePen, Trash} from "@lucide/svelte";
    import Button from "$lib/component/form/Button.svelte";
    import TracksList from "$lib/component/track/TracksList.svelte";
    import PlaylistTrackUpload from "$lib/component/playlist/PlaylistTrackUpload.svelte";

    export let playlist: Playlist;
    export let coverArtPromise: () => Promise<Blob>;
    export let tracks: writable<Track[]>;
    export let onClickEdit: () => Promise<void>;
    export let onClickDelete: () => Promise<void>;
    export let onClickTrackEdit: (trackId: number) => Promise<void>;
    export let onClickTrackPlay: (trackId: number) => Promise<void>;
    export let onClickTrackDelete: (trackId: number) => Promise<void>;
    export let onUploadNewTracks: (files: File[]) => Promise<void>;
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
        {:catch err}
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
            onClickTrackPlay={onClickTrackPlay}
            onClickTrackDelete={onClickTrackDelete}
        />
    {/if}

    <PlaylistTrackUpload
        onUpload={onUploadNewTracks}
    />

</div>