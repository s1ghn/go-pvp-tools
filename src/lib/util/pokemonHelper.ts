import { __ } from "$lib/stores/translationStore";
import type { Pokemon } from "$lib/types/Pokemon";
import { getOriginalRegion } from "./regions";

export type CategorizedForms = {
    shadow?: string[],
    regions?: string[],
};

let translate = (key: string) => key;
let shadowFilterKeyTranslated = "";

__.subscribe((translator) => {
    translate = translator;
    shadowFilterKeyTranslated = translate('filter_key_shadow');
});

/**
 * extracts detected forms from Pokemon list and groups them into keyword filter category (translated)
 */
export function extractFormsCategorized(pokemon: Pokemon[]): CategorizedForms {
    const categorized: CategorizedForms = {};

    pokemon.forEach(mon => {
        // shadow
        const shadowForm = mon.isShadow ? shadowFilterKeyTranslated : `!${shadowFilterKeyTranslated}`;
        addFormToCategory(categorized, 'shadow', shadowForm);

        // regions
        // either can be special regional variant or just the original region
        const region = mon.regionalVariant ?? getOriginalRegion(mon.dex);
        addFormToCategory(categorized, 'regions', region);
    });

    return categorized;
}

/**
 * Helper function to add a form to the regions category
 */
function addFormToCategory(registrar: CategorizedForms, key: keyof Required<CategorizedForms>, form: string): void {
    registrar[ key ] ??= [];
    if (!registrar[ key ]?.includes(form)) {
        registrar[ key ]?.push(form);
    }
}