<script lang="ts">
    export let isFullScreenPlayerOpened: boolean;
    export let handleToggleFullscreenPlayer: () => void;
</script>

<div class="fullscreen-player">
    This will be full screen music player
    <button onclick={handleToggleFullscreenPlayer}>Close</button>
</div>