import { getInUseLanguageIds } from "../config/localization";
import pokemon from "../lib/data/gm_pokemon.json";
import nameTranslations from "../lib/data/pokemon_species_names.json";
import type { League, Pokemon } from "../types/Pokemon";
import greatLeague from "../lib/data/bl_great.json";
import ultraLeague from "../lib/data/bl_ultra.json";
import masterLeague from "../lib/data/bl_master.json";
import fs from "fs";
import path from "path";

/**
 * Build the data for the project
 */
function action() {
    // build pokemon list
    const exportTo = __dirname + "/../lib/data/build/pokemon.json";
    const pokemonList: Pokemon[] = [];

    // filter out all ignored languages for mons
    const relevantTranslations = nameTranslations.filter(
        t => getInUseLanguageIds().includes(t.local_language_id ? +t.local_language_id : 0)
    );

    for (const mon of pokemon) {
        // search for translations
        const monTranslations = relevantTranslations.filter(
            t => +t.pokemon_species_id === mon.dex
        );

        // if translations are missing show warning
        if (monTranslations.length === 0) {
            console.warn(`Missing translations for ${mon.dex}`);
        }

        pokemonList.push({
            dex: mon.dex,
            speciesId: mon.speciesId,
            familyId: mon.family?.id ?? null,
            leagues: Object.fromEntries(([ "great", "ultra", "master" ]).map(league => {
                let leagueData = null;

                switch (league) {
                    case "great":
                        leagueData = greatLeague;
                        break;
                    case "ultra":
                        leagueData = ultraLeague;
                        break;
                    default:
                        leagueData = masterLeague;
                }

                const found = leagueData.find(d => d.speciesId === mon.speciesId);

                return [ league, found
                    ? {
                        score: found.score,
                    }
                    : null
                ];
            })) as {
                    [ league in League ]: {
                        score: number,
                    } | null
                },
            translations: Object.fromEntries(monTranslations.map(t => [
                t.local_language_id,
                {
                    name: t.name ?? "",
                }
            ])),
        });
    }

    // write to file and create folders along the way
    fs.mkdirSync(path.dirname(exportTo), { recursive: true });
    fs.writeFileSync(exportTo, JSON.stringify(pokemonList, null, 4));
}

action();