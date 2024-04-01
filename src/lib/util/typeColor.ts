export const typeColors = {
    bug: "#A8B820",
    dark: "#705848",
    dragon: "#7038F8",
    electric: "#F8D030",
    fairy: "#EE99AC",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    steel: "#B8B8D0",
    water: "#6890F0",
};

/**
 * Returns a set color for a monster type
 */
export default function typeColor(type: keyof typeof typeColors | "none"): string | null {
    if (type === "none") return null;

    return typeColors[ type ];
}