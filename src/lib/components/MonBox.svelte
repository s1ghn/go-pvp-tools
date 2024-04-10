<script lang="ts">
    import { base } from "$app/paths";
    import { __ } from "$lib/stores/translationStore";
    import type { Pokemon } from "$lib/types/Pokemon";
    import typeColor from "$lib/util/typeColor";

    export let monster: Pokemon;

    const type1color = typeColor(monster.types[0]);
    const type2color = typeColor(monster.types[1]) ?? type1color;

    const monImageUrl = `${base}/data/mon_images/pokemon_icon_${monster.dex.toString().padStart(3, "0")}_00.png`;
</script>

<div
    class="flex gap-2 lg:gap-4 h-20 p-2 bg-gradient-to-r from-10% to-90% shadow-stone-500 shadow-md rounded-lg"
    style="
    --tw-gradient-from: {type1color};
    --tw-gradient-to: {type2color};
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
"
>
    <!-- Image -->
    <div class="relative z-0 size-18 p-3">
        <!-- Circle bg -->
        <!-- <div
            class="rounded-full absolute -z-10 inset-3 size-10 shadow-sm bg-stone-100 shadow-stone-600 dark:bg-stone-800 dark:shadow-stone-800"
        ></div> -->

        <!-- Shadow bg -->
        {#if monster.isShadow}
            <div
                class="absolute size-14 -z-10 inset-3 bg-no-repeat bg-center bg-contain rounded-full"
                style="background-image: url({base}/data/materials/shadow.PNG)"
            ></div>
        {/if}

        <div
            class="size-12 bg-contain bg-center bg-no-repeat"
            style="background-image: url({monImageUrl});"
        ></div>
    </div>

    <div class="flex-1">
        <!-- Name -->
        <div class="flex-1 h-auto self-center">
            <div class="font-bold">
                #{monster.dex}
                {$__(`pokemon_name_${monster.dex.toString().padStart(4, "0")}`)}

                {#if monster.isShadow}
                    (Shadow)
                {/if}
            </div>

            <div class="text-sm">
                {monster.speciesId}
            </div>
        </div>

        <!-- Status row -->
        <div class="w-full flex">
            <!-- Leagues + ranking -->
            <div class="">
                {#each Object.entries(monster.leagues).filter(([name, league]) => !!league) as [name, league]}
                    <div
                        class="backdrop-brightness-125 dark:backdrop-brightness-75 rounded-full mx-1 ms-auto py-1 px-2 inline-flex"
                    >
                        <img
                            src="{base}/data/cup_images/pogo_{name}_league.png"
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
    </div>
</div>
