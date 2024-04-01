<script lang="ts">
    interface $$Props extends FormElement {}

    import Input from "$lib/components/form/Input.svelte";

    export let value: string | number = "";

    const safeToUseProps = {
        ...$$restProps,
        size: null,
    };
</script>

<Input let:class={classes} {...$$restProps}>
    <input type="text" class={classes} bind:value {...safeToUseProps} />

    <slot name="append" />
</Input>
