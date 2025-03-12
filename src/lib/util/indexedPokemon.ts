import type { Pokemon } from "$lib/types/Pokemon";
import pokemon from "$lib/data/pokemon.json";

const monsters = pokemon as Pokemon[];

export const indexedBySpeciesId: Record<string, Pokemon> = monsters.reduce((acc, mon) => {
    acc[ mon.speciesId ] = mon;
    return acc;
}, {} as Record<string, Pokemon>);

/**
 * indexed pokemon by family of species and form
 * 
 * NOTE: this is not familyId, but the family of species and form, so considering evolutions and parents
 */
export const groupedByEvolutionParents: Record<string, Pokemon[]> = monsters.reduce((acc, mon) => {
    function recursivelyAddChildren(m: Pokemon, rootSpeciesId: string): void {
        m?.family?.evolutions?.forEach(e => {
            const monFound = monsters.find(mo => mo.speciesId === e)!;
            recursivelyAddChildren(monFound, rootSpeciesId);
        });
    }

    // parent should always be the top key for the family
    if (mon.family.parent) {
        return acc;
    }

    acc[ mon.speciesId ] = [ mon ];
    recursivelyAddChildren(mon, mon.speciesId);

    return acc;
}, {} as Record<string, Pokemon[]>);