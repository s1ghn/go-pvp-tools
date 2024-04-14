<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Select from "$lib/components/form/Select.svelte";
    import localization from "$lib/config/localization";
    import appThemeStore from "$lib/stores/appThemeStore";
    import languageStore from "$lib/stores/languageStore";
    import SettingsItem from "./SettingsItem.svelte";

    const langKeys = Object.keys(
        localization.languages,
    ) as (keyof typeof localization.languages)[];
</script>

<div class="flex flex-col items-center justify-center">
    <h2 class="text-2xl mb-4">App Settings</h2>

    <div class="max-w-xl w-full lg:w-lg">
        <Card class="divide-y">
            <!-- Select Language -->
            <SettingsItem>
                <div slot="label">Language</div>

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
            </SettingsItem>

            <SettingsItem>
                <div slot="label">Dark mode</div>

                <Select
                    options={[
                        { value: "light", text: "Light" },
                        { value: "dark", text: "Dark" },
                        { value: "auto", text: "System" },
                    ]}
                    bind:value={$appThemeStore}
                ></Select>
            </SettingsItem>
        </Card>
    </div>
</div>
