<script lang="ts">
    import type { Pokemon } from "$lib/types/Pokemon";
    import languageStore from "$lib/stores/languageStore";
    import translationStore from "$lib/stores/translationStore";
    import Translation from "./Translation.svelte";

    export let monster: Pokemon;

    const monImageUrl = `/data/mon_images/pokemon_icon_${monster.dex.toString().padStart(3, "0")}_00.png`;
    const isShadow: boolean =
        monster.speciesId.indexOf("_shadow") === monster.speciesId.length - 7;
</script>

<div class="flex gap-2">
    <!-- Image -->
    <div
        class="w-8 aspect-square bg-contain bg-center bg-no-repeat"
        style="background-image: url({monImageUrl});"
    ></div>

    <!-- Name -->
    <div class="flex-1">
        <Translation
            key="pokemon_name_{monster.dex.toString().padStart(4, '0')}"
        ></Translation>

        {#if isShadow}
            (Shadow)
        {/if}
    </div>

    <div>
        <!-- Leagues + ranking -->
        <div class="flex">
            {#each Object.entries(monster.leagues).filter(([name, league]) => !!league) as [name, league]}
                <div>
                    <img
                        src="/data/cup_images/pogo_{name}_league.png"
                        alt={name}
                        width="24"
                        loading="lazy"
                    />
                    <div>{league?.score}</div>
                </div>
            {/each}
        </div>
    </div>
</div>
