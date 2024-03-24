import { CSVImportableSchema } from "../Schema.ts";

export default class PokemonSpeciesNames extends CSVImportableSchema {
    public name: string = "pokemon_species_names";
    public columns: Column[] = [
        {
            name: "pokemon_species_id",
            type: "NUMERIC",
            primary: true,
        },
        {
            name: "pokemon_species_id",
            type: "NUMERIC",
            primary: true,
        },
    ];
}