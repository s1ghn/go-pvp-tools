import pokemonSpecies from "$lib/data/pokeapi/pokemon_species.json";
import regions from "$lib/data/pokeapi/regions.json";
import generations from "$lib/data/pokeapi/generations.json";
import translationStore from "$lib/stores/translationStore";
import _ from "lodash";

let translations: Record<string, string> = {};

translationStore.subscribe((store) => {
    translations = store;
});

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

/**
 * Get a list of filter applicable regions
 * @returns a list of regions with their translations
 */
export function getRegionTranslations(): Record<string, string> {
    return regions.reduce((acc, region) => {
        // watch out!
        let translation = translations[ `filter_key_${region.identifier}` ] ?? null;

        // FIXME: paldea, galar works too but needs manual translation 
        if (region.identifier === "paldea") {
            translation = "Paldea";
        }

        if (region.identifier === "galar") {
            translation = "Galar";
        }

        if (!translation) {
            return acc;
        }

        acc[ region.identifier ] = translation;
        return acc;
    }, {} as Record<string, string>);
}