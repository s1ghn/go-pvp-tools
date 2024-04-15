<script lang="ts">
    import SearchFilterConfigurator from "./SearchFilterConfigurator.svelte";
    import leagues from "$lib/config/leagues";
    // @ts-ignore
    import Textfield from "$lib/components/form/Textfield.svelte";
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import { __ } from "$lib/stores/translationStore";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Button from "$lib/components/form/Button.svelte";
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
    <SearchFilterConfigurator></SearchFilterConfigurator>
</div>
