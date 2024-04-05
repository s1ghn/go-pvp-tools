<script lang="ts">
    import type { Pokemon } from "$lib/types/Pokemon";
    import languageStore from "$lib/stores/languageStore";
    import { onMount } from "svelte";
    import throttle from "lodash/throttle";
    import MonBox from "./MonBox.svelte";
    import MonsterFilterCollection from "$lib/util/MonsterFilterCollection";
    import Textfield from "./form/Textfield.svelte";

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

    let searchString = "";

    // determine monsters on screen
    $: visibleMonsters = new MonsterFilterCollection(monsters)
        .searchByName(searchString)
        .monsters.slice(0, loadMonstersCount);

    onMount(() => {
        window.addEventListener("scroll", scrollHandler);
    });
</script>

<div>
    <!-- Search -->
    <Textfield placeholder="Search Pokemon..." bind:value={searchString} />
</div>
<div
    class="grid auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-4"
    bind:this={gridElement}
>
    {#each visibleMonsters as mon (`${mon.speciesId}-${$languageStore}`)}
        <MonBox monster={mon} />
    {/each}
</div>
