<script lang="ts">
    export let color = "bg-stone-200 dark:bg-stone-900";

    const classes = $$restProps.class;
    const restProps = {
        ...$$restProps,
    };

    delete restProps.class;
</script>

<div class="{color} rounded-lg p-4 lg:p-8 {classes}" {...restProps}>
    <slot />
</div>
