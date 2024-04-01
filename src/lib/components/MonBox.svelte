<script lang="ts">
    import { __ } from "$lib/stores/translationStore";
    import type { Pokemon } from "$lib/types/Pokemon";
    import typeColor from "$lib/util/typeColor";

    export let monster: Pokemon;

    const type1color = typeColor(monster.types[0]);

    const monImageUrl = `/data/mon_images/pokemon_icon_${monster.dex.toString().padStart(3, "0")}_00.png`;
</script>

<div class="flex flex-wrap align-center gap-2">
    <!-- Status row -->
    <div class="w-full flex justify-center -mt-3">
        <!-- Leagues + ranking -->
        <div class="">
            {#each Object.entries(monster.leagues).filter(([name, league]) => !!league) as [name, league]}
                <div
                    class="backdrop-brightness-125 dark:backdrop-brightness-75 rounded-full mx-1 ms-auto py-1 px-2 inline-flex"
                >
                    <img
                        src="/data/cup_images/pogo_{name}_league.png"
                        alt={name}
                        width="14"
                        loading="lazy"
                        class=""
                    />
                    <div class="text-xs font-bold ps-1">
                        #{league?.rank}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Image -->
    <div
        class="w-8 aspect-square bg-contain bg-center bg-no-repeat"
        style="background-image: url({monImageUrl});"
    ></div>

    <!-- Name -->
    <div class="flex-1 h-auto self-center">
        {$__(`pokemon_name_${monster.dex.toString().padStart(4, "0")}`)}

        {#if monster.isShadow}
            (Shadow)
        {/if}
    </div>
</div>
