<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PLAYLIST_SERVICE_CONTEXT } from "../lib/context"
	import { setContext } from 'svelte';
    import type { MediaFile } from "../lib/entity/media-file";
    import type { Playlist } from "../lib/entity/playlist";
    import type { Track } from "../lib/entity/track";
    import { MediaFileRepository } from "../lib/repository/media-file-repository";
    import { PlaylistRepository } from "../lib/repository/playlist-repository";
    import type { Repository } from "../lib/repository/repository";
    import { TrackRepository } from "../lib/repository/track-repository";
    import type { PlaylistService } from "../lib/service/playlist-service";
    import { PlaylistServiceImpl } from "../lib/service/playlist-service-impl";
    import type { MediaType } from "../lib/types/media-type";

	// Repositories
	const playlistRepository: Repository<Playlist> = new PlaylistRepository();
	const trackRepository: Repository<Track> = new TrackRepository();
	const mediaFileRepository: Repository<MediaFile<MediaType>> = new MediaFileRepository();

	// Services
	const playlistService: PlaylistService = new PlaylistServiceImpl(playlistRepository, trackRepository, mediaFileRepository);

	// Context
	setContext(PLAYLIST_SERVICE_CONTEXT, playlistService);

	let { children }: { children: Snipper } = $props();
</script>

<div class="main-layout">
  	<header>
    	<img id="logo" src="/logo.png" alt="Logo">

		<nav>
			<a href="">Button</a>
			<p>Text</p>
		</nav>
  	</header>

  	<main>
	    {@render children()}
  	</main>

  	<footer>
    	<h1>Footer</h1>
  	</footer>
</div>
