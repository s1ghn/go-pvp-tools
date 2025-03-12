<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface $$Props extends HTMLInputAttributes {
        checked?: boolean;
    }

    let { checked = $bindable(false), ...otherProps } = $props() as $$Props;
</script>

<label class="block w-100 cursor-pointer select-none p-1">
    <input type="checkbox" class="form-checkbox" bind:checked {...otherProps} />

    <slot />
</label>
