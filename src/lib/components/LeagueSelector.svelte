<script lang="ts">
    import languageStore from "$lib/stores/languageStore";
    import Select from "./form/Select.svelte";
    import type { Pokemon } from "$lib/types/Pokemon";
    import Card from "./Card.svelte";
    import MonGrid from "./MonGrid.svelte";
    import { __ } from "$lib/stores/translationStore";
    import FilterGenerator from "./FilterGenerator.svelte";
    import localization from "$lib/config/localization";

    export let monsters: Pokemon[] = [];

    const langKeys = Object.keys(
        localization.languages,
    ) as (keyof typeof localization.languages)[];
</script>

<div class="flex my-4 lg:my-8">
    <!-- Filters -->
    <div class="basis-1/4">
        <Card class="mb-4">
            <!-- Select Language -->
            <h2 class="text-2xl mb-4">Select Language</h2>

            <Select
                bind:value={$languageStore}
                options={langKeys.map((l) => {
                    const langTexts = {
                        en: "🇺🇸 English",
                        de: "🇩🇪 German",
                        fr: "🇫🇷 French",
                        es: "🇪🇸 Spanish",
                        it: "🇮🇹 Italian",
                        ja: "🇯🇵 Japanese",
                    };

                    return {
                        value: l,
                        text: langTexts[l],
                    };
                })}
            ></Select>
        </Card>

        <!-- Generate output string -->
        <Card>
            <FilterGenerator></FilterGenerator>
        </Card>
    </div>

    <div class="flex-1 flex flex-col px-4 lg:px-8 gap-4">
        <MonGrid {monsters} />
    </div>
</div>
