<script lang="ts">
	import Textfield from "./../lib/components/form/Textfield.svelte";
	import Select from "$lib/components/form/Select.svelte";
	import SearchString from "$lib/util/SearchString";
	import Checkbox from "$lib/components/form/Checkbox.svelte";
	import localization from "../config/localization";
	import languageStore from "$lib/stores/languageStore";
	import FilterGenerator from "$lib/components/FilterGenerator.svelte";
	import Card from "$lib/components/Card.svelte";
	import LeagueSelector from "$lib/components/LeagueSelector.svelte";
	import type { Pokemon } from "$lib/types/Pokemon";
	import allMonsters from "$lib/data/pokemon.json";

	const langKeys = Object.keys(
		localization.languages,
	) as (keyof typeof localization.languages)[];

	let monsters: Pokemon[] = allMonsters;
</script>

<Card>
	<div class="flex items-center gap:4 lg:gap-8">
		<div class="flex-initial">
			<h2 class="text-2xl mb-4">Select Language</h2>

			<!-- Select Language -->
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
		</div>

		<div class="flex-1">
			<!-- Output String -->
			<FilterGenerator></FilterGenerator>
		</div>
	</div>
</Card>

<LeagueSelector bind:monsters></LeagueSelector>
