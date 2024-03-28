<script>
    // @ts-ignore
    import Icon from "mdi-svelte";
    // @ts-ignore
    import { mdiContentCopy } from "@mdi/js";
    import Textfield from "./form/Textfield.svelte";
</script>

<div>
    <Textfield
        size="lg"
        placeholder="Your generated Pokemon Go search filter will appear here."
        readonly
    >
        <div slot="append">
            <Icon path={mdiContentCopy} />
        </div>
    </Textfield>
</div>
