import type { Pokemon } from "$lib/types/Pokemon";

type Config = {
    /**
     * Whether to include these Pokemon or exclude,
     * making the search add negating prefixes.
     */
    inclusive: boolean;

};

/**
 * Creates a pkmn go compatible search string
 */
export default class SearchBuilder {
    public constructor(public monsters: Pokemon[], private config: Partial<Config> = {}) {

    }

    public outputStrings(): string[] {
        const { monsters } = this;
        const monsterStringParts: (string | string[])[] = [];
        const potentialStringLength = 0;

        return monsters.map((monster) => {
            return monster.dex.toString().padStart(4, "0");
        });
    }
}