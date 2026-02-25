<script lang="ts">
    import {ComponentIcon} from "@lucide/svelte";

    export let text: string;
    export let type: "primary" | "secondary" | "accent" | "destructive" = "secondary";
    export let fullSize: boolean = false;
    export let disabled: boolean = false;
    export let Icon: ComponentIcon;
    export let onClick: () => void;
</script>

<button type="button" onclick={onClick} class={`btn ${type} ${fullSize ? "full-size" : ""}`} disabled={disabled}>
    {#if Icon}
        <div class="icon">
            <Icon />
            {text}
        </div>
    {:else}
        {text}
    {/if}
</button>