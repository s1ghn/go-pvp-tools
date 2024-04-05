<script lang="ts">
    import type { HTMLSelectAttributes } from "svelte/elements";

    import Input from "$lib/components/form/Input.svelte";

    interface $$Props extends HTMLSelectAttributes {
        options: { value: number | string; text: string }[];
    }

    export let value: $$Props["value"] = null;
    export let options: $$Props["options"] = [];
</script>

<div>
    <Input let:class={classes}>
        <select class="{classes} cursor-pointer" bind:value {...$$restProps}>
            {#each options as option}
                <option value={option.value}>{option.text}</option>
            {/each}
        </select>
    </Input>
</div>
