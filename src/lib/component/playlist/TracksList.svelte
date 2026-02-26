<script lang="ts">
    import type {Playlist} from "$lib/entity/playlist";
    import {Play, Trash, AudioLines, Album, Clock, Edit} from "@lucide/svelte";
    import {secondsToString} from "$lib/util/time-convert";

    export let tracks: writable<Track[]>;
    export let onClickTrackEdit: (trackId: number) => Promise<void>;
    export let onClickTrackPlay: (trackId: number) => Promise<void>;
    export let onClickTrackDelete: (trackId: number) => Promise<void>;
</script>

<table class="tracks-list">
    <thead>
        <tr>
            <td></td>
            <td><AudioLines /></td>
            <td><Album /></td>
            <td><Clock /></td>
            <td></td>
            <td></td>
        </tr>
    </thead>

    <tbody>
        {#each $tracks as track}
            <tr>
                <td>
                    <button onclick={onClickTrackPlay(track.id)}>
                        <Play />
                    </button>
                </td>
                <td>{track.author ? track.author + " - " : ""}{track.name}</td>
                <td>{track.album ?? "Unknown"}</td>
                <td>{secondsToString(track.duration)}</td>
                <td>
                    <button onclick={onClickTrackEdit(track.id)}>
                        <Edit />
                    </button>
                </td>
                <td>
                    <button onclick={onClickTrackDelete(track.id)}>
                        <Trash />
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>