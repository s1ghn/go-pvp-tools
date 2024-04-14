import { browser } from "$app/environment";
import { writable } from "svelte/store";

const initialTheme = browser ? (localStorage.getItem("theme") as "light" | "dark" | "auto" ?? "auto") : "auto";
const appThemeStore = writable(initialTheme);

appThemeStore.subscribe(value => {
    if (!browser) return;

    // write localStorage
    if (value === "auto") {
        localStorage.removeItem("theme");
    } else {
        localStorage.setItem("theme", value);
    }

    // Apply the theme
    if (
        value === "dark" ||
        (value === "auto" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add(value);
        return;
    }

    document.documentElement.classList.remove("dark");
});

export default appThemeStore;