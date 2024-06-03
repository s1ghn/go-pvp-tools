import pokemonSpecies from "$lib/data/pokeapi/pokemon_species.json";
import regions from "$lib/data/pokeapi/regions.json";
import generations from "$lib/data/pokeapi/generations.json";

export function getOriginalRegion(dexNo: number): string {
    // assume first match in pokemon list is the original released one
    // thus being the correct region
    const species = pokemonSpecies.find((p) => +p.id === dexNo);

    if (!species) {
        throw new Error(`no pokemon with identifiable region found for ${dexNo}`);
    }

    const generation = generations.find((g) => g.id === species.generation_id);

    if (!generation) {
        throw new Error(`no pokedex region found for ${dexNo}`);
    }

    const region = regions.find((r) => r.id === generation.main_region_id)?.identifier;

    if (!region) {
        throw new Error(`no region found for ${dexNo}`);
    }

    return region;
}