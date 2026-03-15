<script lang="ts">
	import {setContext, type Snippet} from 'svelte';
	import {CURRENTLY_PLAYING_TRACK_STORE_CONTEXT, PLAYLIST_SERVICE_CONTEXT, TRACK_SERVICE_CONTEXT} from "$lib/context";
	import type {MediaFile} from "$lib/entity/media-file";
	import type {Playlist} from "$lib/entity/playlist";
	import type {Track} from "$lib/entity/track";
	import {MediaFileRepository} from "$lib/repository/media-file-repository";
	import {PlaylistRepository} from "$lib/repository/playlist-repository";
	import type {Repository} from "$lib/repository/repository";
	import {TrackRepository} from "$lib/repository/track-repository";
	import type {PlaylistService} from "$lib/service/playlist-service";
	import {PlaylistServiceImpl} from "$lib/service/playlist-service-impl";
	import type {MediaType} from "$lib/types/media-type";
	import {TrackServiceImpl} from "$lib/service/track-service-impl";
	import Alerts from "$lib/component/alert/Alerts.svelte";
	import MusicPlayer from "$lib/component/music-player/MusicPlayer.svelte";
	import type {PersistentStore} from "$lib/types/persistent-store";
	import type {CurrentlyPlayingTrack} from "$lib/types/music-player";
	import {createPersistentStore} from "$lib/store/store-factory";

	// Repositories
	const playlistRepository: Repository<Playlist> = new PlaylistRepository();
	const trackRepository: Repository<Track> = new TrackRepository();
	const mediaFileRepository: Repository<MediaFile<MediaType>> = new MediaFileRepository();

	// Services
	const playlistService: PlaylistService = new PlaylistServiceImpl(playlistRepository, trackRepository, mediaFileRepository);
	const trackService: trackService = new TrackServiceImpl(trackRepository, mediaFileRepository);

	// Stores
	const currentlyPlayingTrackStore: PersistentStore<CurrentlyPlayingTrack> = createPersistentStore<CurrentlyPlayingTrack>("currently-playing-track", null);

	// Context
	setContext(PLAYLIST_SERVICE_CONTEXT, playlistService);
	setContext(TRACK_SERVICE_CONTEXT, trackService)
	setContext(CURRENTLY_PLAYING_TRACK_STORE_CONTEXT, currentlyPlayingTrackStore)

	let { children }: { children: Snippet } = $props();

</script>

<div class="main-layout">
  	<header>
		<div></div>

    	<img src="/logo.png" alt="Logo">

		<nav></nav>
  	</header>

  	<main>
		<Alerts />
	    {@render children()}
  	</main>

  	<footer>
    	<MusicPlayer
			currentlyPlayingTrackStore={currentlyPlayingTrackStore}
			playlistService={playlistService}
			trackService={trackService}
		/>
  	</footer>
</div>
