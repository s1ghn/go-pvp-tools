<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";

    export let size = "md";
    export let value: string | number = "";
</script>

<Input {size} let:classes>
    <input type="text" class={classes} bind:value {...$$restProps} />
</Input>
