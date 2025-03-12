import localization from "../lib/config/localization";
import { pokemonAndRankingFileHandler, translationHandler } from "./file-handlers";
import forms from "../lib/config/forms.ts";
import csvToJson from "./file-handlers/csv";

const formAsRegexpOr = Object.keys(forms).join("|");

export default {
    "game_master": {
        "files": {
            "game_master": "https://github.com/PokeMiners/game_masters/raw/master/latest/latest.json",
        },
        outDir: __dirname + "/../lib/data",
    },
    // data from pokeapi not in gamerip
    "pokeapi": {
        "files": {
            "pokemon_species": "https://github.com/PokeAPI/pokeapi/raw/master/data/v2/csv/pokemon_species.csv",
            "generations": "https://github.com/PokeAPI/pokeapi/raw/master/data/v2/csv/generations.csv",
            "regions": "https://github.com/PokeAPI/pokeapi/raw/master/data/v2/csv/regions.csv"
        },
        outDir: __dirname + "/../lib/data/pokeapi",
        handler: csvToJson,
    },
    "pokemon": {
        "files": {
            "pokemon_list": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/gamemaster/pokemon.json",
            "rankings_great": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-1500.json",
            "rankings_ultra": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-2500.json",
            "rankings_master": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-10000.json",
        },
        "handler": pokemonAndRankingFileHandler,
    },
    // translations from game
    // must be handled very specifically due to bad JSON structure
    // more in cli-fetch.ts
    "translations": {
        "files": Object.fromEntries(Object.entries(localization.languages).map(([ short, name ]) => [
            short,
            `https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Texts/Latest%20APK/JSON/i18n_${name}.json`
        ])),
        outDir: __dirname + "/../lib/translations",
        handler: translationHandler,
    },
    // assets like images
    "mon_images": {
        "repository": "PokeMiners/pogo_assets",
        "dataType": "githubTreeSource",
        "outDir": __dirname + "/../../static/data/mon_images",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": `Images\\/Pokemon - 256x256\\/Addressable Assets\\/pm\\d+\\.?(${formAsRegexpOr})?\\.icon\\.png$`,
    },
    "cup_images": {
        "repository": "PokeMiners/pogo_assets",
        "dataType": "githubTreeSource",
        "outDir": __dirname + "/../../static/data/cup_images",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": /Images\/Combat\/pogo_.*_league\.png$/,
    },
    "materials": {
        "files": {
            "shadow": "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Raids/shadow_icon.png",
        },
        "outDir": __dirname + "/../../static/data/materials",
    },
};