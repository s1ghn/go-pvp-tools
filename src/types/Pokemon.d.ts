import type localization from "../config/localization";

type Pokemon = {
    dex: number,
    speciesId: string,
    familyId: string | null,
    leagues: {
        [ league in League ]: {
            score: number,
        } | null
    },
    translations: {
        [ lang: string ]: {
            name: string,
        };
    };
};

type League = "great" | "ultra" | "master";

type PokemonFamilyList = {
    [ familyId: keyof typeof localization.languages ]: string[];
}[];