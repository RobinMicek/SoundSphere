<script lang="ts">
    import Button from "$lib/component/form/Button.svelte";
    import {Upload} from "@lucide/svelte";

    export let onUpload: (files: File[]) => Promise<void>;
    let isUploading: boolean = false;

    let isDragging: boolean = false
    let fileInput: HTMLInputElement;

    let files: File[] = [];

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        isDragging = false;

        files = [...event.dataTransfer.files];
    }

    function handleSelect(event: Event) {
        files = [...event.target.files];
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();

        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    async function onConfirmUpload() {
        isUploading = true;

        await onUpload(files);

        // Clear the already uploaded files
        files = [];

        isUploading = false;
    }

    // For accessibility
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            fileInput.click();
        }
    }
</script>

<div class="track-upload">
    <div
        class="dropzone"
        class:dragging={isDragging}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        on:click={() => fileInput.click()}
        on:keydown={handleKeyPress}
        role="button"
        tabindex="0"
    >

        <p class="note centered bold">Drag & drop files here</p>
    </div>

    {#if files.length}
        <ul>
            {#each files as file}
                <li><span class="bold">{file.name}</span> ({Math.round(file.size / 1024)} KB)</li>
            {/each}
        </ul>

        <Button
            text="Upload"
            type="secondary"
            disabled={isUploading}
            fullSize={true}
            Icon={Upload}
            onClick={onConfirmUpload}
        />

    {/if}

    <input
        type="file"
        bind:this={fileInput}
        on:change={handleSelect}
        multiple
        hidden
        accept=".mp3,audio/mpeg"
    />

</div>