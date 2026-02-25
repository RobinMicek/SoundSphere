<script lang="ts">
    import {ComponentIcon} from "@lucide/svelte";

    export let name: string;
    export let type: string;
    export let required: boolean = false;
    export let isTextArea: boolean = false;
    export let placeholder: string;
    export let value: string;
    export let Icon: ComponentIcon;
    export let onValueChange: (event: Event) => void;

    // For binding label with input field
    const id = "input_" + Math.random().toString();
</script>

<div class="input-field">
    {#if Icon}
        <div class="icon">
            <Icon />
            <label for={id}>{name}</label>
        </div>
    {:else}
        <label for={id}>{name}</label>
    {/if}

    {#if isTextArea}
        <textarea id={id} placeholder={placeholder} bind:value={value} onchange={onValueChange} required={required}></textarea>
    {:else}
        <input id={id} type={type} placeholder={placeholder} bind:value={value} onchange={onValueChange} required={required}>
    {/if}
</div>