export default {
    "bf_great_overall": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/battlefrontiergreat/overall/rankings-2500.json",
    "bf_ultra_overall": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/battlefrontierultra/overall/rankings-2500.json",
    "bf_master_overall": "https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/battlefrontiermaster/overall/rankings-10000.json",
    "pokemon_species_names": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv",
    "languages": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/languages.csv",
    "mon_images": {
        "repository": "PokeMiners/pogo_assets",
        "dataType": "githubTreeSource",
        // only the base image, no shiny no event
        // means: /pokemon_icon_${dex_no}_00.png
        "filter": /Images\/Pokemon\/pokemon_icon_[0-9]*_00\.png$/,
    }
};