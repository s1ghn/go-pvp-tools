import langImport from "../lib/data/languages.json";

const localization = {
    languages: {
        "en": "english",
        "fr": "french",
        "de": "german",
        "es": "spanish",
        "it": "italian",
        "ja": "japanese",
    },
};

export default localization;

export function getInUseLanguageIds(): number[] {
    return langImport.filter(lang => (Object.keys(localization.languages) as readonly string[]).includes(lang.identifier!)).map(lang => +lang.id);
}