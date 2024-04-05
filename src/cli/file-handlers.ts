import type { Pokemon, PokemonTypes } from "../lib/types/Pokemon";
import fs from "fs";
import path from "path";
import type dataSources from "./data-sources";

/**
 * Creates a structure for pokemon with rankings
 */
export function pokemonAndRankingFileHandler(srcList: {
    // eslint-disable-next-line no-unused-vars
    [ _ in keyof typeof dataSources[ "pokemon" ][ "files" ] ]: string;
}) {
    const pokemon = JSON.parse(srcList[ "pokemon_list" ]) as {
        dex: number,
        speciesId: string,
        family: {
            id: string,
        } | null,
        types: [ string, string ],
    }[];

    type LeagueRanking = {
        speciesId: string,
        score: number,
    };

    const greatLeague = JSON.parse(srcList[ "rankings_great" ]) as LeagueRanking[];
    const ultraLeague = JSON.parse(srcList[ "rankings_ultra" ]) as LeagueRanking[];
    const masterLeague = JSON.parse(srcList[ "rankings_master" ]) as LeagueRanking[];

    // build pokemon list
    const exportTo = __dirname + "/../lib/data";
    const pokemonList: Pokemon[] = [];

    for (const mon of pokemon) {
        // push to pokemon list
        pokemonList.push({
            dex: mon.dex,
            speciesId: mon.speciesId,
            familyId: mon.family?.id ?? null,
            types: mon.types as [ PokemonTypes, PokemonTypes ],
            isShadow: mon.speciesId.includes("_shadow"),
            leagues: Object.fromEntries(Object.entries({
                "great": greatLeague,
                "ultra": ultraLeague,
                "master": masterLeague,
            }).map(([ name, data ]) => {
                const foundIndex = data.findIndex(d => d.speciesId === mon.speciesId);
                const found = data[ foundIndex ];

                return [ name, found
                    ? {
                        rank: foundIndex + 1,
                        score: found.score,
                    }
                    : null
                ];
            })) as Pokemon[ "leagues" ],
        });
    }

    // write to file
    writeToFile(JSON.stringify(pokemonList), path.join(exportTo, "pokemon.json"));
}

/**
 * Creates a [key: string]: string organized json file for pokeminer translations
 */
export function translationHandler(srcList: {
    // eslint-disable-next-line no-unused-vars
    [ K in keyof typeof dataSources[ "translations" ][ "files" ] ]: string;
}) {
    for (const lang in srcList) {
        const original = JSON.parse(srcList[ lang ]) as {
            data: string[];
        };

        // data contains pairs of translation key and value
        const transformed = original.data.reduce((acc, cur, index) => {
            const isKey = index % 2 === 0;

            if (!isKey) {
                return acc;
            }

            acc[ cur ] = original.data[ index + 1 ];

            return acc;
        }, {} as Record<string, string>);

        // write to file
        writeToFile(JSON.stringify(transformed), path.join(__dirname + "/../lib/translations", lang + ".json"));
    }
}

/**
 * This should write to a file and create missing folders along the way
 */
export function writeToFile(data: string | Uint8Array, filePath: string) {
    const folder = path.dirname(filePath);

    // write to file, create missing folders along the way
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFileSync(filePath, data);
}