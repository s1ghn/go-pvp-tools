<script lang="ts">
	import LeagueSelector from "$lib/components/LeagueSelector.svelte";
	import type { Pokemon } from "$lib/types/Pokemon";
	import allMonsters from "$lib/data/pokemon.json";

	let monsters = allMonsters as Pokemon[];
</script>

<LeagueSelector bind:monsters></LeagueSelector>
