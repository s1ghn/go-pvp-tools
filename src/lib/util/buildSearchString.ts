import type { FilterConfigurations, GeneratedSearchQueryResults } from "$lib/types/SearchFilter";
import { groupedByEvolutionParents } from "./indexedPokemon";
import filterableRegions from "$lib/config/filterableRegions";
import { __ } from "$lib/stores/translationStore";
import { getOriginalRegion } from "./regions";
import type { Pokemon } from "$lib/types/Pokemon";
import pokemon from "$lib/data/pokemon.json";
import leagues from "$lib/config/leagues";

const monsters = pokemon as Pokemon[];

let translate = (key: string) => key;
let shadowFilterKeyTranslated = "";

__.subscribe((translator) => {
    translate = translator;
    shadowFilterKeyTranslated = translate('filter_key_shadow');
});

type FilterableForms = {
    shadow: string,
    regional: string,
};

/**
 * Build PokemonGo Compatible Search strings from the given filters
 */
export default function buildSearchString(filters: FilterConfigurations): GeneratedSearchQueryResults {
    const dexedPokemonLiterals: {
        [ dex: string ]: Pokemon[];
    } = {};

    // group by speciesId
    // as well es dex number for fast accessing
    // for later operations
    let [ groupedByDex, groupedBySpeciesId ] = monsters.reduce((acc, mon) => {
        acc[ 0 ][ mon.dex ] = [ ...(acc[ 0 ][ mon.dex ] ?? []), mon ];
        acc[ 1 ][ mon.speciesId ] = [ ...(acc[ 1 ][ mon.speciesId ] ?? []), mon ];

        return acc;
    }, [ [], {} ] as [ Pokemon[][], Record<string, Pokemon[]> ]);

    // walk through all monsters from bottom to top,
    // performing operations and shortening next items to look into
    while (groupedByDex.length) {
        const mons = groupedByDex.pop()!;

        // resolve highest evolution from family structure
        // then walk through until most top parent is reached
        // evaluate forms for pokemon (see later comments)
        // and add form strings for every pokemon up until the highest evolution matching league

        // 1st step: gather all end evolutions forms, from the most top parent
        // this is to guarantee that the whole family is included
        function findLatestEvolutions(m: Pokemon): Pokemon[] {
            const evolutions = m.family.evolutions?.map(e => groupedBySpeciesId[ e ]!)[ 0 ];
            if (!evolutions) {
                return [ m ];
            }

            return evolutions.flatMap(findLatestEvolutions);
        }
        function findTopMostParent(m: Pokemon): Pokemon {
            if (!m.family.parent) {
                return m;
            }

            return findTopMostParent(groupedBySpeciesId[ m.family.parent ]![ 0 ]);
        }

        const latestEvolutions = mons.flatMap(findTopMostParent).flatMap(findLatestEvolutions);
        const dexNumbersToStrip: number[] = [];

        // forms gathered for pokemon in league or not
        const existingForms: FilterableForms[] = [];
        const activeForms: FilterableForms[] = [];

        for (const mon of latestEvolutions) {
            function findFormsForPokemonAndParents(m: Pokemon, include: null | boolean = null): Pokemon[] {
                // check if pokemon is in filter to proceed building search string
                include ??= leagues.rankings.some((league) => {
                    // no league data = always irrelevant
                    if (!m.leagues[ league ]) {
                        return false;
                    }

                    // league is not selected in filters = always filter out
                    if (!filters.selectedLeagues[ league as keyof typeof filters.selectedLeagues ]) {
                        return false;
                    }

                    // league rank is not between filter rank settings
                    const data = m.leagues[ league ]!;
                    if (data.rank < filters.fromRank || data.rank > filters.untilRank) {
                        return false;
                    }

                    return true;
                });


                const shadowForm = mon.isShadow ? shadowFilterKeyTranslated : `!${shadowFilterKeyTranslated}`;
                const regionalForm = mon.regionalVariant ?? getOriginalRegion(mon.dex);

                if ()
                    const forms = formRegistrar[ m.dex ] ?? [];
                const parent = m.family.parent ? findTopMostParent(groupedBySpeciesId[ m.family.parent ]![ 0 ]) : null;

                if (parent) {
                    return [ ...forms, ...findFormsForPokemonAndParents(parent) ];
                }

                return forms;
            }

            // forms

            // include to existing if not already present
            if (!existingForms.includes([ shadowForm, regionalForm ])) {
                existingForms.push([ shadowForm, regionalForm ]);
            }

            if (!include) {
                continue;
            }

            // include to active if not already present
            if (!shadowFormsActive.includes(shadowForm)) {
                shadowFormsActive.push(shadowForm);
            }
            if (!regionalFormsActive.includes(regionalForm)) {
                regionalFormsActive.push(regionalForm);
            }


        }

        // search through parents and evolutions
    }

    Object.entries(monsters).forEach(([ _, mon ]) => {
        let matchesLeagueFilter = false;
        let matchOnNotLatestEvolution = false;
        let lastMatchedSpeciesId: string | null = null;

        // filter settings should operate on dex level


        // find evolutions that match the filter
        // and add all pokemons up to that evolution to the list
        if (!mon.family.parent) {
            let viableForFilter = [];

            function filterEvolutions(m: Pokemon): Pokemon[] {
                const evolutions = m.family.evolutions?.map(e => monsters.find(mo => mo.speciesId === e)!);
                if (!evolutions) {
                    return [ m ];
                }

                return [ m, ...evolutions.flatMap(filterEvolutions) ];
            }
        }
        mons.forEach(mon => {
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
        const regionalForm = anyMonster.regionalVariant ?? getOriginalRegion(anyMonster.dex);

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
    // Step 1: Forms in Form group
    registrarForms.forEach((formEntry, formEntryIndex) => {
        const forms = formEntry.forms;

        for (const formIndex in forms) {
            const form = forms[ formIndex ];

            // create a parenthesis string unique for filtering this form
            // strip out form groups which appear in all forms for
            // all other forms
            // so i.e. (shadow&alola),(!shadow&alola),(shadow&galar) => alola,(shadow&galar)
            const formGroupsPossible = [
                // shadow
                [ shadowFilterKeyTranslated, `!${shadowFilterKeyTranslated}` ],
                // regions
                [ getOriginalRegion(form), ...Object.keys(filterableRegions) ],
            ];

            // form index is the same index as form group
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
                // this must be addressed by stripping both
                // and if these were the only two attributes
                // filter out the complete cartesian form
                const cartesianFiltered = cartesian.reduce((acc, cur) => {
                    // remove both negated and non negated when found
                    const withoutDuplicates = cur.split(',').reduce((a, c) => {
                        const reversedForm = c.indexOf('!') === 0 ? c.slice(1) : `!${c}`;
                        const reversedFoundIndex = a.indexOf(reversedForm);

                        if (reversedFoundIndex !== -1) {
                            a.splice(reversedFoundIndex, 1);
                            return a;
                        }

                        a.push(c);
                        return a;
                    }, [] as string[]).join(',');

                    if (withoutDuplicates === '') {
                        return acc;
                    }

                    acc.push(withoutDuplicates);
                    return acc;
                }, [] as string[]);

                return cartesianFiltered.join("&");
            }).join('&');
        })
        .join('&');
}