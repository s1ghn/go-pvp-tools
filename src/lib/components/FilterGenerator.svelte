<script>
    // @ts-ignore
    import { mdiContentCopy } from "@mdi/js";
    import Textfield from "./form/Textfield.svelte";
    import Icon from "./Icon.svelte";

    export let filterString = "";

    const copyToClipboard = async () => {
        navigator.clipboard.writeText(filterString);
    };
</script>

<div>
    <Textfield
        size="lg"
        placeholder="Your generated Pokemon Go search filter will appear here."
        readonly
    >
        <div slot="append">
            <Icon
                icon={mdiContentCopy}
                class="cursor-pointer"
                on:click={copyToClipboard}
            />
        </div>
    </Textfield>
</div>
