import type { FilterConfigurations, GeneratedSearchQueryResults } from "$lib/types/SearchFilter";
import { groupedByEvolutionParents } from "./indexedPokemon";
import filterableRegions from "$lib/config/filterableRegions";
import { __ } from "$lib/stores/translationStore";
import { getOriginalRegion, getRegionTranslations } from "./regions";
import type { Pokemon } from "$lib/types/Pokemon";
import pokemon from "$lib/data/pokemon.json";
import leagues from "$lib/config/leagues";
import _ from "lodash";

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
    let dexSearch: Number[] = [];
    let formSearch: {
        [ dex: string ]: {
            /**
             * null if both shadow and non shadow
             */
            shadow: boolean | null,
            regions: string[],
        };
    } = {};

    // group by speciesId
    // as well es dex number for fast accessing
    // for later operations
    let [ groupedByDex, groupedBySpeciesId ] = monsters.reduce((acc, mon) => {
        acc[ 0 ][ mon.dex ] = [ ...(acc[ 0 ][ mon.dex ] ?? []), mon ];
        acc[ 1 ][ mon.speciesId ] = mon;

        return acc;
    }, [ [], {} ] as [ Pokemon[][], Record<string, Pokemon> ]);

    function getDexOfParents(m: Pokemon): Number[] {
        return [
            ...m.family?.parent && groupedBySpeciesId[ m.family.parent ]!
                ? getDexOfParents(groupedBySpeciesId[ m.family.parent ]!) ?? []
                : [],
            m.dex
        ];
    }

    for (const mon of monsters) {
        // filter out unreleased
        if (mon.released === false) {
            continue;
        }

        // filter out pokemons considering filter settings
        if (
            !Object.entries(filters.selectedLeagues)
                // only selected leagues
                .filter(
                    ([ _, selected ]) => selected
                )
                // should be captured for current pkmn
                // and should be below rank set in filters
                .some(
                    ([ league, _ ]) => {
                        const rank = mon.leagues[ league as keyof typeof mon.leagues ];

                        return rank
                            && league in filters.selectedLeagues
                            && rank.rank >= filters.fromRank
                            && rank.rank <= filters.untilRank;
                    }
                )
            // Object.keys(mon.leagues)
        ) {
            continue;
        }

        const dexNumbers = getDexOfParents(mon);

        // push to general dex based search string
        dexSearch.push(...dexNumbers);

        // build form based search string
        dexNumbers.forEach(dexNumber => {
            const index = dexNumber.toString();
            formSearch[ index ] ??= {
                shadow: null,
                regions: [],
            };

            formSearch[ index ].shadow = formSearch[ index ].shadow === null
                ? mon.isShadow
                : null;

            // push region if not already exists
            const region = mon.regionalVariant ?? getOriginalRegion(mon.dex);
            if (!formSearch[ index ].regions.includes(region)) {
                formSearch[ index ].regions.push(region);
            }
        });
    }

    // build the actual search string
    // add unique dex numbers for family of all accepted monsters
    const regionTranslations = getRegionTranslations();

    let allMons: Number[] = _.uniq(dexSearch);
    let cryptoDex: Number[] = [];
    let nonCryptoDex: Number[] = [];
    Object.entries(formSearch)
        .forEach(([ dex, form ]) => {
            if (form.shadow === null) {
                return;
            }

            if (form.shadow) {
                cryptoDex.push(+dex);
                return;
            }

            nonCryptoDex.push(+dex);
        });

    console.log(regionTranslations);

    // build form search string
    const regionStrings = Object.entries(formSearch)
        // group filter prefix for region and shadow with all monsters applicable
        .map(
            ([ dex, form ]): string | null => {
                // if there are multiple regions, niantics filter logic does not allow searching for multiple atm
                // thus we dont include it
                if (form.regions.length !== 1) {
                    return null;
                }

                const region = form.regions[ 0 ];

                // if no more further regions exists for this dex number, we can skip as well
                if (groupedByDex[ +dex ].length === 1) {
                    return null;
                }

                const regionKey = regionTranslations[ region ];

                // if region translation does not exist, it means its does not work for filtering multiple mons
                // (niantic bug 👀)
                if (!regionKey) {
                    return null;
                }

                return `!${dex},${regionKey}`;
            }
        )
        .filter(a => a !== null);

    const search = [
        allMons.join(','),
        '!' + shadowFilterKeyTranslated + ',' + cryptoDex.join(','),
        shadowFilterKeyTranslated + ',' + nonCryptoDex.join(','),
        ...regionStrings,
    ].join('&');

    return {
        inclusive: search,
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