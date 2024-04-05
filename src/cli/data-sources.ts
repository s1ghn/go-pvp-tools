import localization from "../lib/config/localization";
import { pokemonAndRankingFileHandler, translationHandler } from "./file-handlers";

export default {
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
    "mon_images": {
        "repository": "PokeMiners/pogo_assets",
        "dataType": "githubTreeSource",
        "outDir": __dirname + "/../../static/data/mon_images",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": /Images\/Pokemon\/pokemon_icon_[0-9]*_00\.png$/,
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
            "shadow_icon": "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Raids/shadow_icon.png",
        },
        "outDir": __dirname + "/../../static/data/materials",
    },
};