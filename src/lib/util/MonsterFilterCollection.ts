import type { Pokemon } from "$lib/types/Pokemon";
import pokemon from "$lib/data/pokemon.json";
import { __ } from "$lib/stores/translationStore";
import type leagues from "../config/leagues";

let localizedSpeciesIndexed: {
    [ monsterNameLocalized: string ]: number[];
} = {};

__.subscribe((t) => {
    // clear list when lang changes
    localizedSpeciesIndexed = {};

    // build a fast filter list
    for (let i = 0; i < pokemon.length; i++) {
        const translatedName = t(`pokemon_name_${pokemon[ i ].dex.toString().padStart(4, "0")}`);

        // push the pokemon list index to the fast filter list
        localizedSpeciesIndexed[ translatedName ] ??= [];
        localizedSpeciesIndexed[ translatedName ].push(i);
    }
});

export default class MonsterFilterCollection {
    public constructor(public monsters: Pokemon[]) {

    }

    /**
     * search by translated name
     */
    public searchByName = (search: string): MonsterFilterCollection => {
        // search speciesId in fast indexed List
        const exactMatches = Object.entries(localizedSpeciesIndexed)
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            .filter(([ name, _ ]) => name.toLowerCase().includes(search.toLowerCase()))
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            .flatMap(([ _, speciesIds ]) => speciesIds.map((speciesId) => this.monsters[ speciesId ]));

        // broader search: familyId is the same as any exact match
        const broaderMatches = this.monsters.filter(
            (monster) =>
                exactMatches.some(
                    (exactMatch) =>
                        // include the exact match
                        monster.speciesId === exactMatch.speciesId ||

                        // matches families
                        monster.familyId && exactMatch.familyId === monster.familyId
                )
        );

        return new MonsterFilterCollection(broaderMatches);
    };

    public filterByLeague = (league: (typeof leagues.rankings)[ number ] | null): MonsterFilterCollection => {
        // do nothing if no league is selected
        if (!league) {
            return new MonsterFilterCollection(
                this.monsters
            );
        }

        return new MonsterFilterCollection(
            this.monsters
                .filter((monster) => monster.leagues[ league ])
        );
    };

    public orderByRank = (league: (typeof leagues.rankings)[ number ] | null): MonsterFilterCollection => {
        // do nothing if no league is selected
        if (!league) {
            return new MonsterFilterCollection(
                this.monsters
            );
        }

        return new MonsterFilterCollection(
            this.monsters
                .sort((a, b) => {
                    const aRank = a.leagues[ league ]?.rank;
                    const bRank = b.leagues[ league ]?.rank;

                    if (aRank === undefined) {
                        return 1;
                    }

                    if (bRank === undefined) {
                        return -1;
                    }

                    return aRank - bRank;
                })
        );
    };
}