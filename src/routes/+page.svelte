<script lang="ts">
	import AppTab from "./AppTab.svelte";
	import type { Pokemon } from "$lib/types/Pokemon";
	import languageStore from "$lib/stores/languageStore";
	import { onMount } from "svelte";
	import throttle from "lodash/throttle";
	import MonBox from "$lib/components/MonBox.svelte";
	import MonsterFilterCollection from "$lib/util/MonsterFilterCollection";
	import Textfield from "$lib/components/form/Textfield.svelte";
	import monData from "$lib/data/pokemon.json";
	import debounce from "lodash/debounce";

	const monsters = monData as Pokemon[];

	let gridElement: HTMLElement;
	let windowScrollHeight = 0;
	let loadMonstersCount = 100;

	const scrollHandler = throttle(() => {
		const threshold = 500;

		gridElement?.getBoundingClientRect().bottom <=
			window.innerHeight + threshold &&
			// load more monsters
			(loadMonstersCount += 40);
	}, 600);

	const searchHandler = debounce((event: Event) => {
		searchString = (event.target as HTMLInputElement).value;
	}, 300);

	let searchString = "";

	// determine monsters on screen
	$: visibleMonsters = new MonsterFilterCollection(monsters)
		.searchByName(searchString)
		.monsters.slice(0, loadMonstersCount);

	onMount(() => {
		window.addEventListener("scroll", scrollHandler);
	});
</script>

<AppTab>
	<div slot="header" class="p-4">
		<!-- Search -->
		<Textfield placeholder="Search Pokemon..." on:input={searchHandler} />
	</div>

	<div class="max-w-screen-2xl px-4">
		<div
			class="grid auto-rows-max md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
			bind:this={gridElement}
		>
			{#each visibleMonsters as mon (`${mon.speciesId}-${$languageStore}`)}
				<MonBox monster={mon} />
			{/each}
		</div>
	</div>
</AppTab>
