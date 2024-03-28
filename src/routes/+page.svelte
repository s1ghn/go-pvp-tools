<script lang="ts">
	import Textfield from "./../lib/components/form/Textfield.svelte";
	import MonGrid from "./../lib/components/mon-grid.svelte";
	import Select from "$lib/components/form/Select.svelte";
	import SearchString from "$lib/util/SearchString";
	import Checkbox from "$lib/components/form/Checkbox.svelte";
	import localization from "../config/localization";
	import languageStore from "$lib/stores/languageStore";
	import FilterGenerator from "$lib/components/FilterGenerator.svelte";

	// let selectedLeagues =
	let maxCount = 150;
	let useCrypto = false;
	let specificPokemon = "";
</script>

<div class="dark:bg-stone-900 rounded-lg p-4 lg:p-8">
	<div class="flex items-center gap:4 lg:gap-8">
		<div class="flex-initial">
			<h2 class="text-2xl mb-4">Select Language</h2>

			<!-- Select Language -->
			<Select
				bind:value={$languageStore}
				options={localization.languages.map((l) => {
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
</div>
