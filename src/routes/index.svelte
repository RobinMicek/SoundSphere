<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { Track } from "../lib/entity/track";
    import type { Repository } from "../lib/repository/repository";
    import { TrackRepository } from "../lib/repository/track-repository";
    import { onMount } from "svelte";
    import type { Playlist } from "../lib/entity/playlist";
    import { PlaylistRepository } from "../lib/repository/playlist-repository";
    import type { MediaFile } from "../lib/entity/media-file";
    import { MediaType } from "../lib/types/media-type";
    import { MediaFileRepository } from "../lib/repository/media-file-repository";
    
    const mediaFileRepository: Repository<MediaFile<MediaType>> = new MediaFileRepository();
    const playlistRepository: Repository<Playlist> = new PlaylistRepository();
    const trackRepository: Repository<Track> = new TrackRepository();

    let mediaFilesStore: Writable<MediaFile<MediaType>[]> = writable([]);
    let playlistsStore: Writable<Playlist[]> = writable([]);
    let tracksStore: Writable<Track[]> = writable([]);

    let mp3Upload: Blob = new Blob();

    async function loadMediaFiles() {
        try { 
            mediaFilesStore = await mediaFileRepository.getAll();
        } catch(e) {
            alert(e);
        }
    }

    async function addMediaFile() {
        try {
            mediaFileRepository.save({
                type: MediaType.MP3,
                blob: mp3Upload
            })
        } catch(e) {
            alert(e);
        }
    }

    function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files === null) {
            alert("Need to upload file")
            return;
        }

        mp3Upload = input.files?.[0];
    }

    async function deleteMediaFile(id:number) {
        try {
            mediaFileRepository.delete(id);
        } catch(e) {
            alert(e);
        }
        
    }

    async function loadPlaylists() {
        try {
            playlistsStore = await playlistRepository.getAll();
        } catch(e) {
            alert(e);
        }
        
    }

    async function addPlaylist() {
        try {
            playlistRepository.save({
                name: "My new playlist",
                trackIds: new Set<number>(),
                description: "Tohle je můj nový playlist",
                coverMediaFileId: 1
            });
        } catch(e) {
            alert(e);
        }
    }

    async function deletePlaylist(id:number) {
        try {
            playlistRepository.delete(id);
        } catch(e) {
            alert(e);
        }
    }

    async function loadTracks() {
        try {
            tracksStore = await trackRepository.getAll();
        } catch(e) {
            alert(e);
        }
    }

    async function addTrack() {
        try {
            trackRepository.save({
                name: "Return of Mouse Diva",
                author: "The Hellp",
                duration: 3600,
                audioMediaFileId: 123,
                addedAt: new Date()
            })
        } catch(e) {
            alert(e);
        }
    }

    async function deleteTrack(id: number) {
        try {
            trackRepository.delete(id);
        } catch(e) {
            alert(e);
        }
    }

    onMount(() => {
        loadMediaFiles();
        loadPlaylists();
        loadTracks();
    })
</script>

<h2>Media Files</h2>
<ul>
    <input type="file" onchange={handleFileUpload}>
    <button onclick={addMediaFile}>Add new mp3</button>
    {#each $mediaFilesStore as mediaFile}
        <li>
            {mediaFile.id} - {MediaType[mediaFile.type]}
            <audio src={URL.createObjectURL(mediaFile.blob)} controls></audio>
            <button onclick={() => deleteMediaFile(mediaFile.id)}>Delete</button>
        </li>
    {/each}
</ul>

<h2>Playlists</h2>
<ul>
    <button onclick={addPlaylist}>Add new playlist</button>
    {#each $playlistsStore as playlist}
        <li>
            {playlist.name} - {playlist.description}
            <button onclick={() => deletePlaylist(playlist.id)}>Delete</button>
        </li>
    {/each}
</ul>

<h2>Tracks</h2>
<ul>
    <button onclick={addTrack}>Add new track</button>
    {#each $tracksStore as track }
        <li>
            {track.author} - {track.name}
            <button onclick={() => deleteTrack(track.id)}>Delete</button>
        </li>
    {/each}
</ul>