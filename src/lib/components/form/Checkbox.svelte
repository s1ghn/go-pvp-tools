<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface $$Props extends HTMLInputAttributes {
        checked?: boolean;
    }

    export let checked: boolean = false;
</script>

<label class="block w-100 cursor-pointer select-none p-1">
    <input
        type="checkbox"
        class="form-checkbox"
        bind:checked
        on:change
        {...$$restProps}
    />

    <slot />
</label>
