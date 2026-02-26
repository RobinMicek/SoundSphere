<script lang="ts">
    import type {Playlist} from "$lib/entity/playlist";
    import Input from "$lib/component/form/Input.svelte";
    import {TextAlignStart, FolderPen, Save, X} from "@lucide/svelte";
    import Button from "$lib/component/form/Button.svelte";

    export let modalText: string;
    export let initialPlaylistData: Omit<Playlist, "id"> | undefined;
    export let isLoading: boolean;
    export let onClose: () => void;
    export let onSubmit: (playlist: Playlist) => Promise<void>;

     let playlistData: Omit<Playlist, "id"> = initialPlaylistData ?? {
        name: "",
        description: "",
        trackIds: [],
        coverMediaFileId: -1
    }

</script>

<div class="modal-container">
    <div class="modal">
        <div class="modal-nav">
            <h2>{modalText}</h2>

            <Button
                text=""
                type="primary"
                Icon={X}
                onClick={onClose}
            />
        </div>

        <div class="modal-content">

            {#if isLoading}
                <p>Loading...</p>
            {:else}
                <form onsubmit={(event) => {event.preventDefault(); onSubmit(playlistData)}}>
                    <Input
                        name="Name"
                        type="text"
                        required={true}
                        placeholder="My awesome playlist"
                        bind:value={playlistData.name}
                        Icon={FolderPen}
                        onValueChange={(event) => {}}
                    />

                    <Input
                        name="Description"
                        type="text"
                        required={true}
                        isTextArea={true}
                        placeholder="This is my awesome playlist"
                        bind:value={playlistData.description}
                        Icon={TextAlignStart}
                        onValueChange={(event) => {}}
                    />

                    <Button
                        text="Save"
                        type="accent"
                        disabled={isLoading}
                        fullSize={true}
                        Icon={Save}
                        onClick={() => {onSubmit(playlistData)}}
                    />
                </form>
            {/if}
        </div>


    </div>
</div>