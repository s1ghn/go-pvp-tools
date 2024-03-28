import langImport from "../lib/data/languages.json";

const localization = {
    languages: [
        "en",
        "fr",
        "de",
        "es",
        "it",
        "ja"
    ] as const,
};

export default localization;

export function getInUseLanguageIds(): number[] {
    return langImport.filter(lang => (localization.languages as readonly string[]).includes(lang.identifier!)).map(lang => +lang.id);
}