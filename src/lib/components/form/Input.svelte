<script lang="ts">
    interface $$Props extends FormElement {}

    type RequiredFormElement = Required<$$Props>;

    export let size: RequiredFormElement["size"] = "md";

    const sizeClass = {
        sm: "",
        md: "p-2 -m-2",
        lg: "p-4 -m-4",
    }[size];
</script>

<div class="{sizeClass} m-0 inline-flex rounded-md border-2 w-full">
    <slot
        class="{sizeClass} bg-transparent font:stone-700 font-semibold outline-none w-full"
    />
</div>
