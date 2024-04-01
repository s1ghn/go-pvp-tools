import { writable } from "svelte/store";
import { browser } from "$app/environment";

const languageStore = writable(
    (browser && localStorage.getItem("language")) || "en"
);

languageStore.subscribe(value => {
    // Save the language to localStorage
    browser && localStorage.setItem("language", value);
});

export default languageStore;