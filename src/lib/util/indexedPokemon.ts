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
export const indexedByFormFamily: Record<string, Pokemon[]> = monsters.reduce((acc, mon) => {
    function handleEntry(m: Pokemon): Record<string, Pokemon[]> {
        acc[ mon.speciesId ] ??= [];
        acc[ mon.speciesId ].push(m);

        m.family.evolutions?.forEach(e => {
            const monFound = monsters.find(mo => mo.speciesId === e)!;
            handleEntry(monFound);
        });

        return acc;
    }

    if (mon.family.evolutions) {
        return acc;
    }

    acc = handleEntry(mon);
    return acc;
}, {} as Record<string, Pokemon[]>);