import { writable } from "svelte/store";
import { browser } from "$app/environment";

const store = writable((browser && localStorage.getItem("language")) || "en");

store.subscribe(value => {
    // Save the language to localStorage
    browser && localStorage.setItem("language", value);
});

export default store;