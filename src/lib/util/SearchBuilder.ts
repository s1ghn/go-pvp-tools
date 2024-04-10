import { __ } from "$lib/stores/translationStore";
import type { Pokemon } from "$lib/types/Pokemon";
import SearchStringOutput from "./SearchStringOutput";

// TODO: Seperate League Strings, remove filter generation selection

type Config = {
    /**
     * only include either the better shadow or regular,
     * but not both
     */
    noMixedShadowForms: boolean;
};

let translate = (key: string) => key;

__.subscribe((t) => {
    translate = t;
});

/**
 * Creates a pkmn go compatible search string
 */
export default class SearchBuilder {
    public constructor(public monsters: Pokemon[], protected config: Partial<Config> = {}) {

    }

    public outputStrings(): SearchStringOutput[] {
        const { monsters } = this;

        // handle shadow flag:
        // remember pokemons that are in the list and have both shadow and non-shadow forms
        // for this build a map that contains all forms (shadow and non-shadow) of a dex number
        const shadowTranslation = translate("filter_key_shadow");
        const shadowFiltered: Map<number, { [ key: string ]: boolean; }> = new Map();
        monsters.forEach((monster) => {
            if (!shadowFiltered.has(monster.dex)) {
                shadowFiltered.set(monster.dex, {});
            }

            const dexEntry = shadowFiltered.get(monster.dex)!;
            dexEntry[
                // actually want the opposite filter to be used
                // so include the non included & category
                monster.isShadow
                    ? `!${shadowTranslation}`
                    : shadowTranslation
            ] = true;
        });

        return [
            new SearchStringOutput(
                "Pokemon",
                this.buildCategorizedANDSearch(
                    monsters,
                    (monster) => {
                        const filter = shadowFiltered.get(monster.dex)!;

                        // matches both => uncategorized
                        if (Object.values(filter).length > 1) {
                            return null;
                        }

                        console.log(monster.speciesId);

                        return Object.keys(filter)[ 0 ];
                    },
                    true
                ),
                monsters
            )
        ];
    }

    // eslint-disable-next-line no-unused-vars
    private buildCategorizedANDSearch(monsters: Pokemon[], categoryExtractor: (monster: Pokemon) => string | null, binaryCategory = false): string {
        const categories = new Map<string, Pokemon[]>();
        const uncategorized: Pokemon[] = [];
        const orParts: string[] = [];

        monsters.forEach((monster) => {
            const category = categoryExtractor(monster);

            if (!category) {
                return uncategorized.push(monster);
            }

            if (!categories.has(category)) {
                categories.set(category, []);
            }

            categories.get(category)!.push(monster);
        });

        categories.forEach((mons, category) => {
            // adds or statements
            orParts.push([
                // include uncategorized monsters
                ...uncategorized.map(this.getSearchStringFromMonster),

                // include specific monsters in category
                ...mons.map(this.getSearchStringFromMonster),

                // include negated category
                // can also be bool category meaning category or !category
                // if so, negation is handled 
                // defaults to !category
                binaryCategory ? category : `!${category}`,
            ].join(","));
        });

        return orParts.join("&");
    }

    private getSearchStringFromMonster(monster: Pokemon): string {
        const name = translate(`pokemon_name_${monster.dex.toString().padStart(4, "0")}`);

        return `+${name}`;
    }
}