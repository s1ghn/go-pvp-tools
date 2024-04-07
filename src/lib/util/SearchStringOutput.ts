import type { Pokemon } from "$lib/types/Pokemon";

/**
 * Display helper class to organize search string output
 */
export default class SearchStringOutput {
    public category: string;
    public value: string;
    public monsters: Pokemon[];

    constructor(category: string, value: string, monsters: Pokemon[]) {
        this.category = category;
        this.value = value;
        this.monsters = monsters;
    }
}