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