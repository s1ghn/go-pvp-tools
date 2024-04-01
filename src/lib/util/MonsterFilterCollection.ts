import languageStore from "$lib/stores/languageStore";
import type { EvolutionsListLocalized, Pokemon } from "$lib/types/Pokemon";
import evolutionsData from "$lib/data/build/evolution-names-localized.json";

const evolutions = evolutionsData as EvolutionsListLocalized;

let lang = "en";

languageStore.subscribe((l) => {
    lang = l;
});

export default class MonsterFilterCollection {
    public constructor(public monsters: Pokemon[]) {

    }

    /**
     * search by name
     */
    public searchByName = (search: string): MonsterFilterCollection => {
        const newMonsters = this.monsters.filter((mon) => {
            let result = mon.translations[ lang ].name
                .toLowerCase()
                .includes(search.toLowerCase());

            // if found or no family id, return
            if (result || !mon.familyId) {
                return result;
            }

            // also search evolutions
            const evol = evolutions[ mon.familyId ];

            if (!evol) {
                console.warn(`No evolution family found for ${mon.familyId}`);
                return false;
            }

            result = evol[ lang ].some((ev) => ev.toLowerCase().indexOf(search.toLowerCase()) !== -1);

            return result;
        });

        this.monsters = newMonsters;

        return this;
    };
}