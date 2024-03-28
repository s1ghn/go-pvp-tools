<script lang="ts">
    import language from "$lib/stores/languageStore";
    import type LeaguePokemon from "$lib/util/LeaguePokemon";

    export let pokemons: LeaguePokemon[] = [];
    export let search: string = "";

    $: monsFiltered = pokemons.filter((mon) => {
        const searchString = new RegExp(search, "i");
        return searchString.test(mon.translate() ?? mon.gm.speciesName);
    });

    const lang = language;
</script>

<div class="grid grid-cols-4 gap-4 my-2 p-2">
    {#each monsFiltered as mon}
        <div>
            <!-- {@debug translation} -->
            <div>#{mon.gm.dex}</div>
            <div>Score: {mon.bl.score}</div>
            <div>{mon.bl.speciesId}</div>
            <div style:color={mon?.translate() ? "black" : "red"}>
                {mon?.translate() ?? mon.gm.speciesName}
                {#if mon.isShadow}
                    (Shadow)
                {/if}
            </div>

            {#each mon.evolutions as evolution}
                {evolution}
            {/each}

            {mon.options.league}
        </div>
    {/each}
</div>
