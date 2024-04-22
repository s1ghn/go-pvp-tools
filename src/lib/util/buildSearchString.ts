import type { FilterConfigurations, GeneratedSearchQueryResults } from "$lib/types/SearchFilter";
import { indexedByFormFamily } from "./indexedPokemon";
import filterableRegions from "$lib/config/filterableRegions";
import { __ } from "$lib/stores/translationStore";

const noRegionKey = Object.keys(filterableRegions).map(a => `!${a}`).join('&');
let translate = (key: string) => key;
let shadowFilterKeyTranslated = "";

__.subscribe((translator) => {
    translate = translator;
    shadowFilterKeyTranslated = translate('filter_key_shadow');
});

/**
 * Can be converted into a filter search for a specific pokemon
 */
type FilterBuilderInformation = {
    /**
     * Wether this should be included
     */
    isActive: boolean,
    /**
     * all form information unique to this pokemon
     */
    forms: string[],
};

/**
 * Contains dexed form combinations that are parseable by the PokemonGo search engine
 */
type FormRegistrar = {
    [ dex: string ]: FilterBuilderInformation[],
};

/**
 * Build PokemonGo Compatible Search strings from the given filters
 */
export default function buildSearchString(filters: FilterConfigurations): GeneratedSearchQueryResults {
    const dexedPokemonLiterals: {
        [ dex: string ]: string[];
    } = {};

    const formRegistrar: FormRegistrar = {};

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    Object.entries(indexedByFormFamily).forEach(([ _, monsters ]) => {
        let matchesLeagueFilter = false;
        let matchOnNotLatestEvolution = false;
        let lastMatchedSpeciesId: string | null = null;

        // decide on how to include the pokemon,
        // if the whole family is relevant add a "+" - which would mean search all evolutions of this form
        // on the contrary: include all pokemons up until the evolution that is not relevant
        monsters.forEach(mon => {
            const leagueRelevant = Object.entries(mon.leagues).some(([ league, data ]) => {
                // no league data = always irrelevant
                if (!data) {
                    return false;
                }

                // league is not selected in filters = always filter out
                if (!filters.selectedLeagues[ league as keyof typeof filters.selectedLeagues ]) {
                    return false;
                }

                // league rank is not between filter rank settings
                if (data.rank < filters.fromRank || data.rank > filters.untilRank) {
                    return false;
                }

                return true;
            });

            if (leagueRelevant) {
                matchesLeagueFilter = true;
                lastMatchedSpeciesId = mon.speciesId;
            } else if (matchesLeagueFilter) {
                matchOnNotLatestEvolution = true;
            }
        });

        // add form information to registrar
        const anyMonster = monsters[ 0 ]!;
        const shadowForm = anyMonster.isShadow ? shadowFilterKeyTranslated : `!${shadowFilterKeyTranslated}`;
        const regionalForm = anyMonster.regionalVariant ?? noRegionKey;

        formRegistrar[ anyMonster.dex ] ??= [];
        formRegistrar[ anyMonster.dex ].push({
            isActive: false,
            forms: [ shadowForm, regionalForm ],
        });

        if (!matchesLeagueFilter) {
            return;
        }

        // toggle form information to active
        formRegistrar[ anyMonster.dex ][ formRegistrar[ anyMonster.dex ].length - 1 ].isActive = true;

        // add the general pokemon search name string
        // with translated monster names
        // if not already present for dex number
        // which should be non form specific
        if (!dexedPokemonLiterals[ anyMonster.dex ]) {
            dexedPokemonLiterals[ anyMonster.dex ] = matchOnNotLatestEvolution
                ? monsters.slice(0, monsters.findIndex(mon => mon.speciesId === lastMatchedSpeciesId) + 1)
                    .map(mon => translate(`pokemon_name_${mon.dex.toString().padStart(4, "0")}`))
                : [ `+${translate(`pokemon_name_${anyMonster.dex.toString().padStart(4, "0")}`)}` ];
        }
    });

    // go through form registrar and group forms into a string
    const allLiterals: string[] = [];
    let allNonFormSpecificPokemon: string[] = [];
    const inclusiveCategories: Record<string, string[]> = {};

    for (const dex in dexedPokemonLiterals) {
        const literal = dexedPokemonLiterals[ dex ];

        allLiterals.push(...literal);

        // build unique index to assign other pokemon to
        // and later use distribution with the literals
        const formId = buildFormId(formRegistrar[ dex ]!);

        if (formId === null) {
            allNonFormSpecificPokemon = allNonFormSpecificPokemon.concat(literal);
            continue;
        }

        // concat literals
        inclusiveCategories[ formId ] ??= [];
        inclusiveCategories[ formId ] = inclusiveCategories[ formId ].concat(literal);
    }

    const excludeTags = filters.excludeCustomTags.map(a => `!${a}`).join("&");

    return {
        inclusive: [
            allLiterals.join(','),
            buildFormSearchString(Object.fromEntries(
                // literals need to all be negated
                Object.entries(inclusiveCategories)
                    .map(([ key, literals ]) => [ key, literals.map(l => `!${l}`) ])
            )),
            excludeTags,
        ].filter(a => a !== '').join('&'),
        unsure: '',
        exclusive: '',
    };
}

/**
 * creates a unique group name, that is destructable 
 * into filter parts but can also be used as a key
 * 
 * i.E. "(shadow&alola),(!shadow&galar)"
 */
function buildFormId(registrarForms: FilterBuilderInformation[]): string | null {
    // create a parenthesis string unique for filtering this form
    // strip out form groups which appear in all forms for
    // all other forms
    // so i.e. (shadow&alola),(!shadow&alola),(shadow&galar) => (shadow&galar)
    const formGroupsPossible = [
        // shadow
        [ shadowFilterKeyTranslated, `!${shadowFilterKeyTranslated}` ],
        // regional
        [ noRegionKey, ...Object.keys(filterableRegions) ],
    ];

    // Step 1: Forms in Form group
    registrarForms.forEach((formEntry, formEntryIndex) => {
        const forms = formEntry.forms;

        for (const formIndex in forms) {
            // form index is the same index as form group
            const form = forms[ formIndex ];
            const otherForms = formEntry.forms.filter((_, i) => i !== +formIndex);
            const formGroup = formGroupsPossible.findIndex(group => group.includes(form));
            let formsMissing = formGroupsPossible[ formGroup ].length;
            let formRegistryIndicesMatching: number[] = [];
            let foundForms: string[] = [];

            // operations on other forms than self
            for (const otherEntryIndex in registrarForms) {
                const otherEntry = registrarForms[ +otherEntryIndex ];
                const matchingForm = otherEntry.forms[ +formIndex ];

                // should match all other forms
                const matchesOtherForms = otherForms.every(
                    (otherForm) => otherEntry.forms.includes(otherForm)
                );

                if (!matchesOtherForms) {
                    continue;
                }

                // the current form might also exist in other entries,
                // meaning all the captured forms are the same
                // in theory this should not happen, but it might if
                // a pokemon form is uncaptured and thus was not filtered
                // if so, this form should be removed entirely
                // (remove by removing all forms)
                if (foundForms.includes(matchingForm)) {
                    registrarForms[ formEntryIndex ].forms = [];
                    continue;
                }

                // if this contains a form non active,
                // stripping this form will not be possible
                // because the other form must does still exist as a pokemon
                if (!otherEntry.isActive) {
                    break;
                }

                // ATP this counts as success
                // capture this form
                formsMissing--;
                foundForms.push(matchingForm);
                formRegistryIndicesMatching.push(+otherEntryIndex);

                // if reaching 0, remove form from all found entries
                if (formsMissing === 0) {
                    registrarForms = registrarForms.map(
                        (form, index) => ({
                            ...form,
                            forms: formRegistryIndicesMatching.includes(index)
                                ? otherForms
                                : form.forms,
                        })
                    );
                }
            }
        }
    });

    // Step 2: remove duplicates where all forms are equal
    registrarForms.forEach((formEntry, formEntryIndex) => {
        registrarForms.forEach((otherEntry, otherEntryIndex) => {
            if (formEntryIndex === otherEntryIndex) {
                return;
            }

            const matches = formEntry.forms.every(form => otherEntry.forms.includes(form));

            if (matches) {
                registrarForms[ formEntryIndex ].forms = [];
            }
        });
    });

    return registrarForms
        .filter(form => form.isActive && form.forms.length > 0)
        .map(form => `(${form.forms.join('&')})`)
        .join(',') || null;
}

/**
 * Resolves parenthesis keys from form registrars
 * into a search string including
 * all pokemon literals assigned to it
 */
function buildFormSearchString(formRegistrar: Record<string, string[]>): string {
    return Object.entries(formRegistrar)
        .map(([ key, literals ]) => {

            // split parenthesis key back into structural form groups
            const formGroups = key.split('(')
                .map(
                    a => a.split(')')[ 0 ].split("&")
                )
                .filter(a => a.filter(b => !!b).length > 0);

            // distribute literals to form group strings
            // using cartesian product of literals + each form group
            function reducedStringCartesian(a: string[], b?: string[], ...rest: string[][]): string[] {
                if (!b) {
                    return a;
                }

                return reducedStringCartesian(
                    a.flatMap(
                        aElement => b.map(bElement => {
                            return `${aElement},${bElement}`;
                        })
                    ),
                    ...rest
                );
            }

            return literals.map((literal) => {
                const cartesian = reducedStringCartesian([ literal ], ...formGroups);

                // There is an issue with the PoGo Search Engine
                // where attribute,!attribute does not actually
                // list both attributes but none instead
                // this must be addressed by removing the entire combination
                const cartesianFiltered = cartesian.map(c => {
                    const pool = c.split(',');

                    const withoutNegation = a.indexOf('!') === 0 ? a.slice(1) : a;

                    return !cartesian.some(b => b.includes(withoutNegation) && b !== a);
                });

                return cartesianFiltered.join("&");
            }).join('&');
        })
        .join('&');
}