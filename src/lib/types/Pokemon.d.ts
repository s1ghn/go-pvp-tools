import type localization from "../config/localization";
import type filterableRegions from "$lib/config/filterableRegions";
import type Regions from "$lib/data/pokeapi/regions.json";

type PokemonTypes = "bug" | "dark" | "dragon" | "electric" | "fairy" | "fighting" | "fire" | "flying" | "ghost" | "grass" | "ground" | "ice" | "normal" | "poison" | "psychic" | "rock" | "steel" | "water";

type Pokemon = {
    dex: number,
    speciesId: string,
    familyId: string | null,
    types: [ PokemonTypes, PokemonTypes | "none" ],
    isShadow: boolean,
    isMega: boolean,
    region: string,
    regionalVariant: keyof typeof filterableRegions | null,
    family: {
        parent: string?,
        evolutions: string[]?,
    },
    leagues: {
        // eslint-disable-next-line no-unused-vars
        [ _ in League ]: {
            score: number,
            rank: number,
            optimalIVs: {
                atk: number,
                def: number,
                hp: number,
            } | null,
            optimalLevel: number | null,
        } | null
    };
};

type EvolutionsListLocalized = {
    [ familyId: string ]: {
        [ lang: string ]: string[];
    };
};

type League = "great" | "ultra" | "master";

type PokemonFamilyList = {
    [ familyId: keyof typeof localization.languages ]: string[];
}[];