export default {
    "gm_pokemon": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/battlefrontiergreat/overall/rankings-2500.json",
    "bl_great": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-1500.json",
    "bl_ultra": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-2500.json",
    "bl_master": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-10000.json",
    "pokemon_species_names": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv",
    "languages": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/languages.csv",
    "mon_images": {
        "repository": "PokeMiners/pogo_assets",
        "dataType": "githubTreeSource",
        "outDir": __dirname + "/../../static/data/mon_images",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": /Images\/Pokemon\/pokemon_icon_[0-9]*_00\.png$/,
    },
    "country_flags": {
        "repository": "hampusborgos/country-flags",
        "dataType": "githubTreeSource",
        "branch": "main",
        "outDir": __dirname + "/../../static/data/flags",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": /svg\/.*\.svg$/,
    }
};