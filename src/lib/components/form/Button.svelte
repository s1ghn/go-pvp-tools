<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface $$Props extends HTMLButtonAttributes {
        s?: "sm" | "md" | "lg";
    }

    export let s: "sm" | "md" | "lg" = "md";

    const sizeClass = {
        sm: "p-1 rounded-sm",
        md: "p-2 rounded-md",
        lg: "p-4 rounded-lg",
    }[s];
</script>

<button class="{sizeClass} bg-orange-600 text-white" on:click>
    <slot />
</button>
