<script lang="ts">
    import { base } from "$app/paths";
    import rocketLineups from "$lib/data/rocket-lineups.json";
    import RocketProfile from "./RocketProfile.svelte";
    
    // Group grunts by type for better organization
    const gruntsByType: Record<string, typeof rocketLineups.grunts> = {};
    rocketLineups.grunts.forEach(grunt => {
        const type = grunt.name.match(/(\w+)-type/i)?.[1]?.toLowerCase() || 'other';
        if (!gruntsByType[type]) gruntsByType[type] = [];
        gruntsByType[type].push(grunt);
    });
    
    const typeOrder = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'other'
    ];
    
    const sortedGruntTypes = Object.keys(gruntsByType).sort((a, b) => {
        return typeOrder.indexOf(a) - typeOrder.indexOf(b);
    });
</script>

<div class="space-y-8 pb-8">
    <!-- Header -->
    <div class="text-center">
        <h1 class="text-2xl font-bold text-stone-800 dark:text-stone-100">
            Team GO Rocket Lineups
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Last updated: {new Date(rocketLineups.leekduckUpdated || rocketLineups.lastUpdated).toLocaleDateString()}
        </p>
        <p class="text-xs text-stone-400 dark:text-stone-500">
            Source: <a href={rocketLineups.source} target="_blank" class="underline hover:text-blue-500">LeekDuck</a>
        </p>
    </div>

    <!-- Giovanni -->
    {#if rocketLineups.giovanni}
        <section>
            <h2 class="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">👔</span> The Boss
            </h2>
            <RocketProfile profile={rocketLineups.giovanni} variant="boss" />
        </section>
    {/if}

    <!-- Leaders -->
    {#if rocketLineups.leaders.length > 0}
        <section>
            <h2 class="text-xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">🎖️</span> Leaders
            </h2>
            <div class="grid gap-4 md:grid-cols-3">
                {#each rocketLineups.leaders as leader}
                    <RocketProfile profile={leader} variant="leader" />
                {/each}
            </div>
        </section>
    {/if}

    <!-- Grunts -->
    <section>
        <h2 class="text-xl font-bold text-stone-700 dark:text-stone-300 mb-4 flex items-center gap-2">
            <span class="text-2xl">👊</span> Grunts
        </h2>
        
        <div class="space-y-6">
            {#each sortedGruntTypes as type}
                {@const grunts = gruntsByType[type]}
                <div>
                    <h3 class="text-lg font-semibold text-stone-600 dark:text-stone-400 mb-2 capitalize">
                        {type === 'other' ? 'Special' : type + '-type'}
                    </h3>
                    <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {#each grunts as grunt}
                            <RocketProfile profile={grunt} variant="grunt" compact />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </section>
</div>
