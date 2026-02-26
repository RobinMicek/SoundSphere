<script lang="ts">
    import { fly } from "svelte/transition";
    import alerts from "$lib/store/alert-store";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import InfoIcon from "@lucide/svelte/icons/info";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<div class="alerts-container">
    {#each $alerts as alert(alert.id)}
        <div class="alert"
             in:fly={{ y: -20, duration: 300 }}
             out:fly={{ y: -20, duration: 300 }}
        >
            <div class="icon {`${alert.type === 'error' ? 'error' : ''}`}">
                {#if alert.type === "success"}
                    <CheckCircle2Icon />
                {:else if alert.type === "error"}
                    <AlertCircleIcon />
                {:else}
                    <InfoIcon />
                {/if}

                {alert.title}
            </div>

            {#if alert.description && alert.description.length > 0}
                <p>{alert.description}</p>
            {/if}
        </div>
    {/each}
</div>