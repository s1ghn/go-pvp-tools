<script lang="ts">
    interface $$Props extends FormElement {}

    type RequiredFormElement = Required<$$Props>;

    export let s: RequiredFormElement["s"] = "md";

    const sizeClass = {
        sm: "p-1",
        md: "p-2",
        lg: "p-4",
    }[s];
</script>

<div class="inline-flex rounded-md border-2 w-full">
    <slot
        class="{sizeClass} flex items-center bg-transparent font:stone-700 font-semibold outline-none w-full"
    />
</div>
