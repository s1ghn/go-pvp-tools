<script lang="ts">
    import type {
        FilterConfigurations,
        GeneratedSearchQueryResults,
    } from "./../../../lib/types/SearchFilter.d.ts";
    import Textfield from "$lib/components/form/Textfield.svelte";
    import SettingsItem from "./../../../lib/components/SettingsItem.svelte";
    import Checkbox from "$lib/components/form/Checkbox.svelte";
    import leagues from "$lib/config/leagues";
    import { __ } from "$lib/stores/translationStore";
    import Button from "$lib/components/form/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import buildSearchString from "$lib/util/buildSearchString.js";
    import Icon from "$lib/components/Icon.svelte";
    import { mdiClipboard } from "@mdi/js";

    export let config: FilterConfigurations = {
        fromRank: 0,
        untilRank: 200,
        selectedLeagues: {
            great: true,
            ultra: true,
            master: true,
        },
        allLeaguesSelected: false,
        excludeCustomTags: [],
    };

    const dispatch = createEventDispatcher();

    let fromRank = config.fromRank.toString();
    let untilRank = config.untilRank.toString();
    let newExcludeTag = "";
    let searchStringResults: GeneratedSearchQueryResults | null = null;

    // number only fields
    $: fromRank = fromRank.replace(/\D/g, "");
    $: untilRank = untilRank.replace(/\D/g, "");

    function addCustomTag() {
        config.excludeCustomTags.push(newExcludeTag);
        config = config;
    }

    function removeTag(index: number) {
        config.excludeCustomTags.splice(index, 1);
        config = config;
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    function saveAndGenerate() {
        dispatch("saved");
        searchStringResults = buildSearchString(config);
    }
</script>

<div class="flex flex-wrap">
    <!-- Settings -->
    <div class="lg:basis-3/4">
        <div class="w-full divide-y">
            <SettingsItem>
                <div slot="label">League rank limits</div>

                <div class="flex flex-wrap">
                    <div class="lg:basis-1/2 p-2">
                        From Rank
                        <Textfield bind:value={fromRank} maxlength={4}
                        ></Textfield>
                    </div>
                    <div class="lg:basis-1/2 p-2">
                        Until Rank
                        <Textfield bind:value={untilRank} maxlength={4}
                        ></Textfield>
                    </div>
                </div>
            </SettingsItem>

            <SettingsItem>
                <div slot="label">Leagues</div>

                <div class="">
                    {#each leagues.rankings as league (league)}
                        <Checkbox bind:checked={config.selectedLeagues[league]}>
                            {$__(`combat_${league}_league`)}
                        </Checkbox>
                    {/each}
                </div>
            </SettingsItem>

            <SettingsItem>
                <div slot="label">Exclude Tags</div>

                <div>
                    <div class="flex gap-2">
                        <Textfield
                            bind:value={newExcludeTag}
                            placeholder="Tagname"
                        ></Textfield>

                        <Button on:click={addCustomTag}>Add</Button>
                    </div>

                    {#each config.excludeCustomTags as tag, i}
                        <Checkbox checked on:change={() => removeTag(i)}>
                            {tag}
                        </Checkbox>
                    {/each}
                </div>
            </SettingsItem>
        </div>

        <div class="text-end pt-8">
            <Button class="w-auto" on:click={saveAndGenerate}
                >Save & Generate</Button
            >
        </div>
    </div>

    <!-- Output -->
    <div class="lg:basis-1/4">
        <Textfield value={searchStringResults?.inclusive} readonly>
            <button
                slot="append"
                on:click={() =>
                    copyToClipboard(searchStringResults?.inclusive ?? "")}
            >
                <Icon icon={mdiClipboard}></Icon>
            </button>
        </Textfield>

        {#if searchStringResults?.inclusive?.length}
            <div class="text-sm text-orange-600">
                {searchStringResults.inclusive.length} Characters
            </div>
        {/if}
    </div>
</div>
