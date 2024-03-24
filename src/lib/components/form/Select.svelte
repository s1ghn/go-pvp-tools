<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";
</script>

<div>
    <Input let:classes>
        <select class={classes}>
            <slot />
        </select>
    </Input>
</div>
