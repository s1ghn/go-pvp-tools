<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface $$Props extends HTMLInputAttributes {
        s?: "sm" | "md" | "lg";
    }

    import Input from "$lib/components/form/Input.svelte";

    export let value: $$Props["value"] = "";
    export let s: $$Props["s"] = "md";
</script>

<Input let:class={classes} {s}>
    <label class="flex w-full items-center">
        <slot name="prepend" />

        <input
            type="text"
            class="{classes} flex-1"
            bind:value
            on:input
            on:focus
            {...$$restProps}
        />

        <slot name="append" />
    </label>
</Input>
