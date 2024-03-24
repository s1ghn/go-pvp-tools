<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";

    export let checked: boolean = false;
</script>

<Input>
    <label>
        <input
            type="checkbox"
            class="form-checkbox"
            bind:checked
            {...$$restProps}
        />

        <slot />
    </label>
</Input>
