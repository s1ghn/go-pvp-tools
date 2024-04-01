<script lang="ts">
    import type { Pokemon } from "$lib/types/Pokemon";
    import languageStore from "$lib/stores/languageStore";
    import { onMount } from "svelte";
    import throttle from "lodash/throttle";
    import MonBox from "./MonBox.svelte";

    export let monsters: Pokemon[] = [];

    let gridElement: HTMLElement;
    let windowScrollHeight = 0;
    let loadMonstersCount = 100;

    const scrollHandler = throttle(() => {
        const threshold = 500;

        gridElement?.getBoundingClientRect().bottom <=
            window.innerHeight + threshold &&
            // load more monsters
            (loadMonstersCount += 40);
    }, 600);

    // determine monsters on screen
    $: visibleMonsters = monsters.slice(0, loadMonstersCount);

    onMount(() => {
        window.addEventListener("scroll", scrollHandler);
    });
</script>

<div
    class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-8"
    bind:this={gridElement}
>
    {#each visibleMonsters as mon (`${mon.speciesId}-${$languageStore}`)}
        <MonBox monster={mon} />
    {/each}
</div>
