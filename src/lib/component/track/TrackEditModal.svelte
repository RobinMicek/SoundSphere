<script lang="ts">
    import Input from "$lib/component/form/Input.svelte";
    import {Save, X, AudioLines, Album, User,} from "@lucide/svelte";
    import Button from "$lib/component/form/Button.svelte";
    import type {Track} from "$lib/entity/track";

    export let modalText: string;
    export let initialTrackData: Omit<Track, "id"> | undefined;
    export let isLoading: boolean;
    export let onClose: () => void;
    export let onSubmit: (track: Track) => Promise<void>;

    let trackData: Omit<Track, "id"> = initialTrackData ?? {
        name: "",
        author: "",
        album: undefined,
        audioMediaFileId: -1,
        duration: 0,
        addedAt: new Date()
    }

</script>

<div class="modal-container">
    <div class="modal">
        <div class="modal-nav">
            <h2>{modalText}</h2>

            <Button
                    text=""
                    color="primary"
                    Icon={X}
                    onClick={onClose}
            />
        </div>

        <div class="modal-content">
            <form onsubmit={(event) => {
                if (!(event.target?.checkValidity())) return;
                event.preventDefault();
                onSubmit(trackData);
            }}>
                <Input
                    name="Name"
                    type="text"
                    required={true}
                    placeholder="Canon in D"
                    bind:value={trackData.name}
                    Icon={AudioLines}
                    onValueChange={(event) => {}}
                />

                <Input
                    name="Author"
                    type="text"
                    required={true}
                    placeholder="Johann Pachelbel"
                    bind:value={trackData.author}
                    Icon={User}
                    onValueChange={(event) => {trackData.author = trackData.author ?? ""}}
                />

                <Input
                    name="Album"
                    type="text"
                    required={false}
                    placeholder="Pachelbel's Greatest Hits"
                    bind:value={trackData.album}
                    Icon={Album}
                    onValueChange={(event) => {}}
                />

                <Button
                    text="Save"
                    color="accent"
                    type="submit"
                    disabled={isLoading}
                    fullSize={true}
                    Icon={Save}
                />
            </form>
        </div>


    </div>
</div>