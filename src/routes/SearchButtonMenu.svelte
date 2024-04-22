<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import { slide } from "svelte/transition";

    export let menuOpened: Boolean = false;
    export let menuItems: string[] = [];
    export let onClick: (value: string) => void;
</script>

<div>
    <Button
        class="bg-stone-300 dark:bg-stone-600 h-full w-12"
        on:click={() => (menuOpened = !menuOpened)}
    >
        <slot name="label" />
    </Button>

    {#if menuOpened}
        <div
            class="absolute z-10 right-4 top-full bg-stone-300 dark:bg-stone-600 rounded-lg py-2 left-4 sm:left-auto min-w-44 shadow-md shadow-stone-400 dark:shadow-stone-950"
            transition:slide
        >
            {#each menuItems as value (value)}
                <button
                    class="appearance-none w-full px-4 py-2 flex items-center cursor-pointer hover:bg-stone-400 hover:dark:bg-stone-500"
                    on:click={() => onClick(value)}
                >
                    <slot name="menuLabels" {value} />
                </button>
            {/each}
        </div>
    {/if}
</div>
