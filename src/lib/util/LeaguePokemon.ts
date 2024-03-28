import languages from "$lib/data/languages.json" assert { type: "json" };
import pokemonTranslations from "$lib/data/pokemon_species_names.json";
import gmPokemon from "$lib/data/gm_pokemon.json";
import rankings from "$lib/data/bl_great.json";
import language from "$lib/stores/languageStore";

let lang = "en";
language.subscribe(value => lang = value);

type Opts = {
    league: "great" | "ultra" | "master";
    lang: string;
};

export default class LeaguePokemon {
    /**
     * the index of the pokemon in the gamemaster list.
     * (Important for efficient search functions)
     */
    public gmIndex: number;
    public bl: typeof rankings[ 0 ];
    public options: Opts = { league: "great", lang: "en" };

    private _evolutions: typeof gmPokemon[ 0 ][] | null = null;

    public get gm(): typeof gmPokemon[ 0 ] {
        return gmPokemon[ this.gmIndex ];
    }

    public get isShadow(): boolean {
        return this.gm.speciesId.includes("_shadow");
    }

    public get evolutions(): typeof gmPokemon[ 0 ][] {
        this._evolutions ??= this.getAllAncestors();

        return this._evolutions;
    }

    constructor(blPokemon: typeof rankings[ 0 ], opts: Partial<Opts> = {}) {
        this.gmIndex = gmPokemon.findIndex((mon) => mon.speciesId === blPokemon.speciesId)!;
        this.bl = blPokemon;
        this.options = {
            ...{
                league: "great",
                lang: "en",
            },
            ...opts
        };
    }

    /**
     * translate the name to the specified language
     * 
     * @todo cache
     */
    public translate(language: string = lang): string | null {
        try {
            return pokemonTranslations.find(
                (mon) => + mon.pokemon_species_id === this.gm.dex
                    && mon.local_language_id === languages.find(
                        (lang) => lang.identifier === language)!.id
            )!.name ?? null;
        } catch (e) {
            return null;
        }
    }

    private getAllAncestors(): typeof gmPokemon[ 0 ][] {
        const ancestors: typeof gmPokemon[ 0 ][] = [];

        // the data source should imply being sorted by dex numbers,
        // so evolutions should always come after their parents
        // and parents should always come before their evolutions
        // note that different forms may appear inbetween, so
        // it might not be the one immediately before / after
        let nextParentId: string | undefined = this.gm.family?.parent;
        let i = this.gmIndex;

        // find all ancestors
        console.log(nextParentId, i);
        while (nextParentId) {
            i--;

            // should appear in the evolutions
            if (!gmPokemon[ i ].family?.evolutions?.includes(nextParentId)) {
                continue;
            }

            nextParentId = gmPokemon[ i ].family?.parent;
            ancestors.push(gmPokemon[ i ]);
        }

        // find all descendants
        const nextEvoId: string[] | undefined = this.gm.family?.evolutions;
        i = this.gmIndex;

        while (nextEvoId?.length) {
            i++;

            const match = nextEvoId.findIndex(
                (evo) => evo === gmPokemon[ i ].speciesId
            );

            if (match === -1) {
                continue;
            }

            // remove from the list of to find evolutions
            // and add to the list of ancestors
            nextEvoId.splice(match, 1);
            ancestors.push(gmPokemon[ i ]);
        }

        return ancestors;
    }
}