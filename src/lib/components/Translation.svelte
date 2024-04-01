<script lang="ts">
    import langStore from "$lib/stores/languageStore";

    export let key: string;

    let value = key;

    window.registered = window.registered ?? [];

    langStore.subscribe(async (lang) => {
        const response = await import(`$lib/translations/${lang}.json`);
        value = response[key] ?? key;
    });
</script>

{value}
