<script lang="ts">
    import languageStore from "$lib/stores/languageStore";
    import type { Pokemon } from "$lib/types/Pokemon";
    import Card from "./Card.svelte";
    import MonGrid from "./MonGrid.svelte";
    import Textfield from "./form/Textfield.svelte";
    import MonsterFilterCollection from "$lib/util/MonsterFilterCollection";

    export let monsters: Pokemon[] = [];

    let searchString: string = "";

    $: filteredMons = new MonsterFilterCollection(monsters).searchByName(
        searchString,
    ).monsters;
</script>

<div class="flex my-4 lg:my-8">
    <!-- Filters -->
    <div class="basis-1/4">
        <Card>
            <!-- Search -->
            <Textfield
                placeholder="Search Pokemon..."
                bind:value={searchString}
            />
        </Card>
    </div>

    <div class="flex-1">
        <MonGrid monsters={filteredMons} />
    </div>
</div>
