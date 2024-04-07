<script lang="ts">
    import leagues from "$lib/config/leagues";
    // @ts-ignore
    import { mdiContentCopy } from "@mdi/js";
    import Textfield from "./form/Textfield.svelte";
    import Icon from "./Icon.svelte";
    import Checkbox from "./form/Checkbox.svelte";
    import { __ } from "$lib/stores/translationStore";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { browser } from "$app/environment";
    import Button from "./form/Button.svelte";
    import type SearchStringOutput from "$lib/util/SearchStringOutput";
    import SearchBuilder from "$lib/util/SearchBuilder";
    import allMonsters from "$lib/data/pokemon.json";
    import type { Pokemon } from "$lib/types/Pokemon";
    import MonsterFilterCollection from "$lib/util/MonsterFilterCollection";

    const monsters = allMonsters as Pokemon[];

    let maxCount: string = "200";
    let selectedLeagues: {
        [K in (typeof leagues.rankings)[number]]?: boolean;
    } = {};
    let allLeaguesSelected = false;
    let excludeCustomTags = writable<string[]>([]);
    let newExcludeTag = "";
    let dialogueOpen = false;
    let searchStringOutput: SearchStringOutput[];

    function toggleAllLeagues() {
        leagues.rankings.forEach((league, index) => {
            selectedLeagues[league] = true;
        });
        allLeaguesSelected = true;
    }

    function checkLeagueSelection() {
        if (allLeaguesSelected) {
            toggleAllLeagues();
        } else {
            selectedLeagues = {};
        }
    }

    // should toggle allLeaguesSelected when either all leagues are selected or none
    function checkAllSelection() {
        let allSelected = !leagues.rankings.find((league) => {
            if (!selectedLeagues[league]) {
                return true;
            }

            return false;
        });

        if (allSelected) {
            return (allLeaguesSelected = true);
        }

        allLeaguesSelected = false;
    }

    // addTagToList
    function addTagToList() {
        excludeCustomTags.set([...$excludeCustomTags, newExcludeTag]);
        newExcludeTag = "";
    }

    function removeTagFromList(tag: string) {
        excludeCustomTags.set(
            $excludeCustomTags.filter((value) => value !== tag),
        );
    }

    function generateSearchString() {
        const filteredMonsters = new MonsterFilterCollection(
            monsters,
        ).filterByLeague(
            Object.entries(selectedLeagues)
                .filter(([, value]) => value)
                .map(([key]) => key) as (typeof leagues.rankings)[number][],
            +maxCount,
        ).monsters;

        searchStringOutput = new SearchBuilder(
            filteredMonsters,
        ).outputStrings();
        dialogueOpen = true;
    }

    $: maxCount = maxCount.replace(/[^0-9]/g, "");

    onMount(() => {
        toggleAllLeagues();

        // load excludeCustomTags from localStorage
        const storedTags = localStorage.getItem("excludeCustomTags");
        if (storedTags) {
            excludeCustomTags.set(JSON.parse(storedTags));
        }

        excludeCustomTags.subscribe((value) => {
            localStorage.setItem("excludeCustomTags", JSON.stringify(value));
        });
    });
</script>

<div class="">
    <h2 class="text-2xl mb-4">Generate Searchstring</h2>

    <!-- Max count -->
    <div class="flex-auto mb-4">
        <Textfield bind:value={maxCount}>
            <div
                slot="prepend"
                class="whitespace-nowrap text-stone-400 font-bold select-none"
            >
                Max Count
            </div>
        </Textfield>
    </div>

    <!-- Leagues -->
    <h3 class="text-lg mb-4">Filter Leagues</h3>
    <div class="mb-4 p-2 dark:bg-stone-800 bg-stone-300 rounded-lg">
        <Checkbox
            bind:checked={allLeaguesSelected}
            on:change={checkLeagueSelection}
        >
            All
        </Checkbox>
        {#each leagues.rankings as league (league)}
            <Checkbox
                bind:checked={selectedLeagues[league]}
                on:change={checkAllSelection}
                >{$__(`combat_${league}_league`)}</Checkbox
            >
        {/each}
    </div>

    <!-- Exclude custom Tags -->
    <h3 class="text-lg mb-4">Exclude custom Tags</h3>
    <div class="mb-4 p-2 dark:bg-stone-800 bg-stone-300 rounded-lg">
        <div class="flex gap-2">
            <Textfield bind:value={newExcludeTag}>
                <div
                    slot="prepend"
                    class="whitespace-nowrap text-stone-400 font-bold select-none"
                >
                    Add Tag
                </div>
            </Textfield>

            <Button on:click={addTagToList}>Add</Button>
        </div>

        {#each $excludeCustomTags as tag}
            <Checkbox checked on:change={() => removeTagFromList(tag)}>
                {tag}
            </Checkbox>
        {/each}
    </div>

    <!-- Generate Button -->
    <Button id="GenerateSearchString" on:click={generateSearchString}>
        Generate search string
    </Button>

    <!-- Output -->
    <div
        class="{dialogueOpen
            ? 'fixed'
            : 'hidden'} backdrop-blur-md inset-0 flex items-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="GenerateSearchString"
    >
        <!-- {@debug searchStringOutput} -->
        {#if searchStringOutput}
            {#each searchStringOutput as output (output.category)}
                <Textfield value={output.value}></Textfield>
            {/each}
        {/if}
    </div>
</div>
