<script lang="ts">
    import {ComponentIcon} from "@lucide/svelte";

    export let text: string;
    export let color: "primary" | "secondary" | "accent" | "destructive" = "secondary";
    export let type: "button" | "submit" = "button";
    export let fullSize: boolean = false;
    export let disabled: boolean = false;
    export let Icon: ComponentIcon;
    export let onClick: () => void;
</script>

<button type={type} onclick={onClick} class={`btn ${color} ${fullSize ? "full-size" : ""}`} disabled={disabled}>
    {#if Icon}
        <div class="icon">
            <Icon />
            {text}
        </div>
    {:else}
        {text}
    {/if}
</button>