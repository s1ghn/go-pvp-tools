import type LeaguePokemon from "./LeaguePokemon";

type StringAccumulator = {
    name: string;
};

type Options = {
    shadow: boolean;
    // this makes all pokemons not included
    negate: boolean;
};

export default class SearchString {
    public pokemons: LeaguePokemon[];

    public constructor(pokemons: LeaguePokemon[]) {
        this.pokemons = pokemons;
    }

    public generate(options: Partial<Options> = {}): string {
        const config = {
            shadow: false,
            negate: false,
            ...options
        };
        const accumulator: StringAccumulator[] = [];

        for (const pokemon of this.pokemons) {
            // base string is +${pokemon name}
            // + being all evolutions in PoGo
            accumulator.push({ name: pokemon.translate()! });
        }

        return (config.shadow ? "crypto&" : "") + accumulator.reduce((acc, { name }, ind) => `${acc}${ind ? "," : ""}+${name}`, "");
    }
}