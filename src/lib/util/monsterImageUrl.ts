import { base } from "$app/paths";
import type { Pokemon } from "$lib/types/Pokemon";
import filterableRegions from "$lib/config/filterableRegions";

export default function monsterImageUrl(monster: Pokemon) {
    const megaModifier = monster.isMega ? ".fMEGA" : "";
    const regionModifier = monster.regionalVariant ? `.${filterableRegions[ monster.regionalVariant ]}` : "";

    return `${base}/data/mon_images/pm${monster.dex}${megaModifier}${regionModifier}.icon.png`;
}