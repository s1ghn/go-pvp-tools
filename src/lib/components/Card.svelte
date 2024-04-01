<script>
    export let color = "bg-stone-200 dark:bg-stone-900";
</script>

<div class="{color} rounded-lg p-4 lg:p-8" {...$$restProps}>
    <slot />
</div>
