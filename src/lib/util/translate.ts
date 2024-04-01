import languageStore from "$lib/stores/languageStore";
import engTranslation from "$lib/translations/en.json";
import type localization from "../../config/localization";

let lang: keyof typeof localization.languages = "en";
let langPromise: Promise<{
    [ key: string ]: string;
}> | null = null;
let langFileContents: {
    [ key: string ]: string;
} = engTranslation;

languageStore.subscribe(async (l) => {
    const la = l as keyof typeof localization.languages;
    lang = la;
    langPromise = import(`$lib/translations/${lang}.json`);
});

export default async function translate(key: string): Promise<string> {
    if (langPromise) {
        langFileContents = await langPromise;
        langPromise = null;
    }
    return langFileContents[ key ] || key;
}