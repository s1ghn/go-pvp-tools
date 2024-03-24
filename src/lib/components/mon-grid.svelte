<script lang="ts">
    import language from "$lib/stores/language";
    import type LeaguePokemon from "$lib/util/LeaguePokemon";

    export let pokemons: LeaguePokemon[] = [];

    const lang = language;
</script>

<div class="grid grid-cols-4 gap-4 my-2 p-2">
    {#each pokemons as mon}
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
        </div>
    {/each}
</div>
