import type leagues from "$lib/config/leagues";

export type FilterConfigurations = {
    fromRank: number;
    untilRank: number;
    selectedLeagues: {
        [ K in (typeof leagues.rankings)[ number ] ]?: boolean;
    };
    allLeaguesSelected: boolean;
    excludeCustomTags: string[];
};

export type GeneratedSearchQueryResults = {
    /**
     * string that contains pokemon that match the given criteria EXACTLY
     */
    inclusive: string;
    /**
     * string that contains pokemon that have forms or similar which are non filterable in PoGo
     */
    unsure: string;
    /**
     * string that contains pokemon that are SAFE to not be relevant for the criteria
     */
    exclusive: string;
};