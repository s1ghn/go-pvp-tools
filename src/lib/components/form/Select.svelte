<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";

    interface $$Props extends FormElement {
        value?: number | string;
        options: { value: number | string; text: string }[];
    }

    export let value: $$Props["value"] = "";
    export let options: $$Props["options"] = [];
</script>

<div>
    <Input let:class={classes}>
        <select class="{classes} cursor-pointer shadow-md" bind:value>
            {#each options as option}
                <option value={option.value}>{option.text}</option>
            {/each}
        </select>
    </Input>
</div>
