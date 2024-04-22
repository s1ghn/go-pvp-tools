<script lang="ts">
	import SearchButtonMenu from "./SearchButtonMenu.svelte";
	import AppTab from "./AppTab.svelte";
	import type { Pokemon } from "$lib/types/Pokemon";
	import languageStore from "$lib/stores/languageStore";
	import throttle from "lodash/throttle";
	import MonBox from "$lib/components/MonBox.svelte";
	import MonsterFilterCollection from "$lib/util/MonsterFilterCollection";
	import Textfield from "$lib/components/form/Textfield.svelte";
	import monData from "$lib/data/pokemon.json";
	import debounce from "lodash/debounce";
	import leagues from "$lib/config/leagues";
	import Button from "$lib/components/form/Button.svelte";
	import { mdiSort, mdiClose, mdiFilter } from "@mdi/js";
	import Icon from "$lib/components/Icon.svelte";
	import { slide } from "svelte/transition";
	import { __ } from "$lib/stores/translationStore";
	import { base } from "$app/paths";

	type SortKeys = "dex" | (typeof leagues.rankings)[number];

	const monsters = monData as Pokemon[];
	const sortKeys: SortKeys[] = ["dex", ...Object.values(leagues.rankings)];

	const scrollHandler = throttle((event: Event) => {
		// percentage of page height
		const threshold = 1.5;
		const target = event.target as HTMLElement;
		const pageHeight = window.innerHeight;

		target.scrollHeight - target.scrollTop <= pageHeight * threshold &&
			// load more monsters
			(loadMonstersCount += 60);
	}, 600);

	let loadMonstersCount = 50;
	let searchString = "";
	let searchStringDebounced = "";
	let sortByLeague: (typeof leagues.rankings)[number] | null = null;
	let sortByValue: "dex" | false = false;
	let sortMenuOpened = false;
	let filterBy: string | null = null;

	function setSortBy(sortKey: string) {
		const key = sortKey as SortKeys;

		if (key === "dex") {
			sortByLeague = null;
			sortByValue = "dex";
		} else if (leagues.rankings.includes(key)) {
			sortByLeague = key;
			sortByValue = false;
		}
	}

	function clearSearch() {
		searchString = "";
		sortByLeague = null;
		sortByValue = false;
	}

	// debounced search converter
	$: debounce(() => {
		searchStringDebounced = searchString;
	}, 600)();

	// determine monsters on screen
	$: visibleMonsters = (() => {
		const mons = new MonsterFilterCollection(monsters)
			.filterByLeague(filterBy as (typeof leagues.rankings)[number])
			.searchByName(searchStringDebounced)
			.orderByRank(sortByLeague)
			.monsters.slice(0, loadMonstersCount);

		// sort by dex if specified
		if (sortByValue === "dex") {
			mons.sort((a, b) => a.dex - b.dex);
		}

		return mons;
	})();

	$: clearable = searchString.length > 0 || sortByLeague !== null;
</script>

<AppTab on:scroll={scrollHandler}>
	<div slot="header" class="relative p-4 flex gap-2">
		<!-- Search -->
		<Textfield
			placeholder="Search Pokemon..."
			bind:value={searchString}
			on:focus={() => (sortMenuOpened = false)}
		>
			<div slot="append">
				{#if clearable}
					<button on:click={clearSearch} class="p-2">
						<Icon icon={mdiClose}></Icon>
					</button>
				{/if}
			</div>
		</Textfield>

		<!-- Filter -->
		<SearchButtonMenu
			menuItems={Array.from(leagues.rankings)}
			onClick={(val) => (filterBy = val)}
		>
			<div slot="label">
				<Icon icon={mdiFilter}></Icon>
			</div>

			<div slot="menuLabels" let:value>
				{#each leagues.rankings as league (league)}
					{#if league === value}
						{$__(`combat_${league}_league`)}
					{/if}
				{/each}
			</div>
		</SearchButtonMenu>

		<!-- Sorting -->
		<div>
			<Button
				class="bg-stone-300 dark:bg-stone-600 h-full w-12"
				on:click={() => (sortMenuOpened = !sortMenuOpened)}
			>
				{#if sortByLeague}
					<img
						src="{base}/data/cup_images/pogo_{sortByLeague}_league.png"
						alt={sortByLeague}
						width="20"
						loading="lazy"
						class="m-auto"
					/>
				{:else}
					<Icon icon={mdiSort}></Icon>
				{/if}
			</Button>

			{#if sortMenuOpened}
				<div
					class="absolute z-10 right-4 top-full bg-stone-300 dark:bg-stone-600 rounded-lg py-2 left-4 sm:left-auto min-w-44 shadow-md shadow-stone-400 dark:shadow-stone-950"
					transition:slide
				>
					{#each sortKeys as key (key)}
						<button
							class="appearance-none w-full px-4 py-2 flex items-center cursor-pointer hover:bg-stone-400 hover:dark:bg-stone-500"
							on:click={() => setSortBy(key)}
						>
							{#if key === "dex"}
								Pokedex Number
							{:else}
								{$__(`combat_${key}_league`)}
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="px-4">
		<div
			class="grid auto-rows-max md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			{#each visibleMonsters as mon (`${mon.speciesId}-${$languageStore}`)}
				<MonBox monster={mon} />
			{/each}
		</div>
	</div>
</AppTab>
