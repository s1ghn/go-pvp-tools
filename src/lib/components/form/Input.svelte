<script lang="ts">
    interface $$Props extends FormElement {}

    type RequiredFormElement = Required<$$Props>;

    export let size: RequiredFormElement["size"] = "md";

    const sizeClass = {
        sm: "",
        md: "p-2",
        lg: "p-4",
    }[size];
</script>

<div class="{sizeClass} inline-flex rounded-md border-2 w-full">
    <slot class="bg-transparent font-semibold outline-none w-full" />
</div>
