<script lang="ts">
	import Textfield from "./../lib/components/form/Textfield.svelte";
	import MonGrid from "./../lib/components/mon-grid.svelte";
	import Select from "$lib/components/form/Select.svelte";
	import languages from "$lib/data/languages.json";
	import language from "$lib/stores/language";
	import great from "$lib/data/bl_great.json";
	import ultra from "$lib/data/bl_ultra.json";
	import master from "$lib/data/bl_master.json";
	import LeaguePokemon from "$lib/util/LeaguePokemon";
	import SearchString from "$lib/util/SearchString";
	import Checkbox from "$lib/components/form/Checkbox.svelte";

	const leagues = {
		bf_great_overall: "Great League",
		bf_ultra_overall: "Ultra League",
		bf_master_overall: "Master League",
	};
	const typyLeagues: { [key: string]: string } = leagues;
	const lang = language;

	let selectedLeagues = Array(Object.keys(leagues).length).fill(true);
	let maxCount = 150;
	let useCrypto = false;

	$: topMons = Object.keys(leagues)
		.filter((_, index) => selectedLeagues[index])
		.reduce((prev, cur) => {
			let rankSrc: (typeof great)[0][] = [];

			switch (cur) {
				case "bf_great_overall":
					rankSrc = great;
					break;
				case "bf_ultra_overall":
					rankSrc = ultra;
					break;
				case "bf_master_overall":
					rankSrc = master;
			}

			// sort mons by score
			const sorted = rankSrc.sort((a, b) => b.score - a.score);

			// cap the number of mons to maxCount
			const capped = sorted.slice(0, maxCount);

			// convert to custom Pokemon class
			const custom = capped.map(
				(mon) =>
					new LeaguePokemon(mon, {
						lang: $lang,
					}),
			);

			// filter out mons that are already present in prev
			const unique = custom.filter(
				(mon) =>
					// must be unique (no duplicates)
					!prev.some(
						(prevMon) => prevMon.gm.speciesId === mon.gm.speciesId,
					) &&
					// shadow?
					mon.isShadow === useCrypto,
			);

			// append the unique mons to prev
			return prev.concat(unique);
		}, [] as LeaguePokemon[]);
	$: searchString = new SearchString(topMons);
</script>

<h1>Test</h1>

<div class="flex gap-3">
	<!-- Select Language -->
	<select bind:value={$lang}>
		{#each Object.entries(languages) as [key, value]}
			<option value={value.identifier}>{value.identifier}</option>
		{/each}
	</select>

	<!-- Select Leagues -->
	{#each Object.keys(leagues) as value, key}
		<div>
			<input
				id={`league_${key}`}
				type="checkbox"
				bind:checked={selectedLeagues[key]}
			/>
			<label for={`league_${key}`}>{typyLeagues[value]}</label>
		</div>
	{/each}

	<!-- Max Count -->
	<Textfield bind:value={maxCount}></Textfield>

	<!-- Crypto -->
	<Checkbox bind:checked={useCrypto}>Use Crypto</Checkbox>
</div>

<!-- Output String -->
<div>
	<Textfield
		size="lg"
		readonly
		value={searchString.generate({
			shadow: useCrypto,
		})}
	></Textfield>
</div>

<MonGrid pokemons={topMons}></MonGrid>
