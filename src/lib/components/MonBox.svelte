<script lang="ts">
    import { base } from "$app/paths";
    import { __ } from "$lib/stores/translationStore";
    import type { Pokemon } from "$lib/types/Pokemon";
    import monsterImageUrl from "$lib/util/monsterImageUrl";
    import typeColor from "$lib/util/typeColor";

    export let monster: Pokemon;

    const type1color = typeColor(monster.types[0]);
    const type2color = typeColor(monster.types[1]) ?? type1color;

    const monImageUrl = monsterImageUrl(monster);
</script>

<div
    class="flex items-center gap-2 lg:gap-4 p-2 bg-gradient-to-r from-10% to-90% shadow-stone-500 dark:shadow-stone-950 shadow-md rounded-lg text-stone-900 dark:text-stone-100"
    style="
    --tw-gradient-from: {type1color};
    --tw-gradient-to: {type2color};
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
"
>
    <!-- Image -->
    <div class="relative z-0 size-18 p-1">
        <!-- Circle bg -->
        <!-- <div
            class="rounded-full absolute -z-10 inset-3 size-10 shadow-sm bg-stone-100 shadow-stone-600 dark:bg-stone-800 dark:shadow-stone-800"
        ></div> -->

        <!-- Shadow bg -->
        {#if monster.isShadow}
            <div
                class="absolute -z-10 -inset-1 bg-no-repeat bg-center bg-contain rounded-full"
                style="background-image: url({base}/data/materials/shadow.png)"
            ></div>
        {/if}

        <div
            class="size-16 bg-contain bg-center bg-no-repeat"
            style="background-image: url({monImageUrl});"
        ></div>
    </div>

    <div class="flex-grow">
        <!-- Name -->
        <div
            class="font-extrabold drop-shadow-outlined"
            title={monster.speciesId}
        >
            {$__(`pokemon_name_${monster.dex.toString().padStart(4, "0")}`)}
            #{monster.dex}

            {#if monster.isShadow}
                (Shadow)
            {/if}
        </div>

        <div class="break-all">
            {monster.speciesId}
        </div>
    </div>

    <!-- Leagues + ranking -->
    <div class="flex flex-col flex-shrink-0">
        {#each Object.entries(monster.leagues).filter(([name, league]) => !!league) as [name, league]}
            <div
                class="backdrop-brightness-125 dark:backdrop-brightness-75 rounded-full my-1 ms-auto py-1 px-2 inline-flex"
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
