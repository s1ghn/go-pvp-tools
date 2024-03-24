<script lang="ts">
    export let size: "sm" | "md" | "lg" = "md";

    let classNames = {
        sm: "p-1",
        md: "p-3",
        lg: "p-5",
    };
</script>

<div class="input-group">
    <slot classes={classNames[size]} />
</div>
