import { derived, writable } from "svelte/store";
import languageStore from "./languageStore";
import defaultTranslations from "$lib/translations/en.json";

// Create a store to update translation File Object
const translationStore = writable({} as Record<string, string>);

// Create subscriber to languageStore to asynchronously load translations
languageStore.subscribe(($language) => {
    import(`$lib/translations/${$language}.json`).then((translations) => {
        translationStore.set(translations);
    });
});

// final store is the one to use for svelte components
// this will load the translations from the translationStore
export const __ = derived(translationStore, ($translations) => {
    return (key: string) => {
        return $translations[ key ] || defaultTranslations[ key as keyof typeof defaultTranslations ] || key;
    };
});