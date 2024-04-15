import { base } from "$app/paths";
import type { Pokemon } from "$lib/types/Pokemon";

const regionalSearchToForm = {
    "alola": "ALOLA",
    "hisui": "HISUIAN",
    "galar": "GALARIAN",
};

export default function monsterImageUrl(monster: Pokemon) {
    const megaModifier = monster.isMega ? ".fMEGA" : "";
    const regionModifier = monster.regionalVariant ? `.f${regionalSearchToForm[ monster.regionalVariant as keyof typeof regionalSearchToForm ] ?? ''}` : "";

    return `${base}/data/mon_images/pm${monster.dex}${megaModifier}${regionModifier}.icon.png`;
}