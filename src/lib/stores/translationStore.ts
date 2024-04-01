import { derived, writable } from "svelte/store";
import languageStore from "./languageStore";
import defaultTranslations from "$lib/translations/en.json";

const loadedTranslation: {
    [ key: string ]: string;
} = defaultTranslations;

export default writable({
    transla
});