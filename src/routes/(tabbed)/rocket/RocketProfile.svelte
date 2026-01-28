<script lang="ts">
    import { base } from "$app/paths";
    import typeColor, { typeColors } from "$lib/util/typeColor";
    
    interface Pokemon {
        name: string;
        templateId?: string;
        type1: string;
        type2?: string;
        doubleWeaknesses: string[];
        singleWeaknesses: string[];
    }
    
    interface Slot {
        pokemon: Pokemon[];
    }
    
    interface Profile {
        id: string;
        name: string;
        title: string;
        quote: string;
        photoUrl?: string;
        slots: {
            slot1: Slot;
            slot2: Slot;
            slot3: Slot;
        };
    }
    
    export let profile: Profile;
    export let variant: 'boss' | 'leader' | 'grunt' = 'grunt';
    export let compact: boolean = false;
    
    // Extract dex number from template ID like "EXTENDED_V0053_POKEMON_PERSIAN"
    function getDexFromTemplate(templateId?: string): number | null {
        if (!templateId) return null;
        const match = templateId.match(/V(\d+)_POKEMON/);
        return match ? parseInt(match[1]) : null;
    }
    
    // Get Pokemon image URL
    function getPokemonImageUrl(pokemon: Pokemon): string {
        const dex = getDexFromTemplate(pokemon.templateId);
        if (dex) {
            return `${base}/data/mon_images/pm${dex}.icon.png`;
        }
        // Fallback to LeekDuck CDN
        return `https://cdn.leekduck.com/assets/img/pokemon_icons_crop/pm0.icon.png`;
    }
    
    // Get type color for gradient
    function getTypeGradient(pokemon: Pokemon): string {
        const type1 = pokemon.type1?.toLowerCase() as keyof typeof typeColors;
        const type2 = pokemon.type2?.toLowerCase() as keyof typeof typeColors;
        const color1 = typeColor(type1) || '#666';
        const color2 = type2 ? (typeColor(type2) || color1) : color1;
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    }
    
    const variantStyles = {
        boss: 'border-red-500 bg-gradient-to-br from-red-900/20 to-stone-900/20',
        leader: 'border-purple-500 bg-gradient-to-br from-purple-900/20 to-stone-900/20',
        grunt: 'border-stone-500 bg-gradient-to-br from-stone-800/20 to-stone-900/20'
    };
    
    const slots = [
        { num: 1, data: profile.slots.slot1 },
        { num: 2, data: profile.slots.slot2 },
        { num: 3, data: profile.slots.slot3 }
    ];
</script>

<div class="rounded-xl border-2 {variantStyles[variant]} overflow-hidden shadow-lg">
    <!-- Header with photo and info -->
    <div class="flex items-center gap-3 p-3 bg-stone-100 dark:bg-stone-800">
        <!-- Character Photo -->
        {#if profile.photoUrl}
            <img 
                src={profile.photoUrl} 
                alt={profile.name}
                class="size-16 rounded-full object-cover bg-stone-200 dark:bg-stone-700 shadow-md"
                loading="lazy"
            />
        {:else}
            <div class="size-16 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center text-2xl">
                {variant === 'boss' ? '👔' : variant === 'leader' ? '🎖️' : '👊'}
            </div>
        {/if}
        
        <!-- Name and title -->
        <div class="flex-grow min-w-0">
            <h3 class="font-bold text-stone-800 dark:text-stone-100 truncate">
                {profile.name}
            </h3>
            <p class="text-xs text-stone-500 dark:text-stone-400">
                {profile.title}
            </p>
            {#if profile.quote && !compact}
                <p class="text-xs italic text-stone-400 dark:text-stone-500 mt-1 line-clamp-2">
                    "{profile.quote}"
                </p>
            {/if}
        </div>
    </div>
    
    <!-- Pokemon Lineup -->
    <div class="p-3 bg-stone-50 dark:bg-stone-900">
        <div class="grid grid-cols-3 gap-2">
            {#each slots as slot}
                <div class="space-y-1">
                    <!-- Slot header -->
                    <div class="text-xs font-semibold text-center text-stone-400 dark:text-stone-500">
                        Slot {slot.num}
                        {#if slot.num === 3 && variant === 'boss'}
                            <span class="text-yellow-500">⭐</span>
                        {/if}
                    </div>
                    
                    <!-- Pokemon in slot -->
                    <div class="space-y-1">
                        {#each slot.data.pokemon as pokemon}
                            <div 
                                class="rounded-lg p-1 flex flex-col items-center shadow-sm"
                                style="background: {getTypeGradient(pokemon)};"
                                title="{pokemon.name} ({pokemon.type1}{pokemon.type2 ? '/' + pokemon.type2 : ''})"
                            >
                                <img 
                                    src={getPokemonImageUrl(pokemon)}
                                    alt={pokemon.name}
                                    class="size-10 object-contain drop-shadow-md"
                                    loading="lazy"
                                    on:error={(e) => { e.currentTarget.src = 'https://cdn.leekduck.com/assets/img/pokemon_icons_crop/pm0.icon.png'; }}
                                />
                                <span class="text-xs font-medium text-white drop-shadow-md truncate w-full text-center">
                                    {#if compact}
                                        {pokemon.name.split(' ')[0]}
                                    {:else}
                                        {pokemon.name}
                                    {/if}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
        
        <!-- Weaknesses (for non-compact view) -->
        {#if !compact && slots[0].data.pokemon[0]?.singleWeaknesses?.length > 0}
            <div class="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700">
                <span class="text-xs text-stone-400">Counter types: </span>
                <span class="text-xs text-stone-600 dark:text-stone-300">
                    {[...new Set(slots.flatMap(s => s.data.pokemon.flatMap(p => [...p.singleWeaknesses, ...p.doubleWeaknesses])))].slice(0, 5).join(', ')}
                </span>
            </div>
        {/if}
    </div>
</div>
