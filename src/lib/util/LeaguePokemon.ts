import languages from "$lib/data/languages.json" assert { type: "json" };
import pokemonTranslations from "$lib/data/pokemon_species_names.json";
import gmPokemon from "$lib/data/gm_pokemon.json";
import rankings from "$lib/data/bl_great.json";
import language from "$lib/stores/language";

let lang = "en";
language.subscribe(value => lang = value);

type Opts = {
    league: "great" | "ultra" | "master";
    lang: string;
};

type Area = "Alola" | "Galar";

export default class LeaguePokemon {
    public gm: typeof gmPokemon[ 0 ];
    public bl: typeof rankings[ 0 ];
    public options: Opts = { league: "great", lang: "en" };


    public get isShadow(): boolean {
        return this.gm.speciesId.includes("_shadow");
    }

    constructor(blPokemon: typeof rankings[ 0 ], opts: Partial<Opts> = {}) {
        this.gm = gmPokemon.find((mon) => mon.speciesId === blPokemon.speciesId)!;
        this.bl = blPokemon;
        this.options = {
            ...{
                league: "great",
                lang: "en",
            },
            ...opts
        };
    }

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
}