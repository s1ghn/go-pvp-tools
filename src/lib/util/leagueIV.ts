import gameMaster from '../data/game_master.json';
const cpms = gameMaster.find(val => val.templateId === "PLAYER_LEVEL_SETTINGS").data.playerLevel.cpMultiplier as number[];

type BaseStats = {
    atk: number,
    def: number,
    hp: number,
};

/**
 * This calculates the most optimal PvP IV for a given CP Limit
 * 
 * Formula: CP = (Atk) * (Def * HP)^0.5 * CPM^2 / 10
 * Note:
 * - CPM = CP Multiplier - this is a float value depending on the pokemon's level, can get this from game rip
 * - Each stat value is BaseStat + IV
 * 
 * @param cpLimit The CP Limit for the league
 * @param baseStats The base stats of the pokemon
 * @param cpMs A list of CP Multipliers where index is the level - 1 - NO HALF LEVELS HERE!
 */
export function calculateOptimalIVs(cpLimit: number, baseStats: BaseStats): { atk: number, def: number, hp: number; level: number; lowestProduct: number; highestProduct: number; } {
    const cappedCpms = levelCpms();
    const ivRange = [ ...Array(16).keys() ];
    const reversedCpms = cappedCpms.slice().reverse();
    let optimalProductiveValues = {
        atk: 0,
        def: 0,
        hp: 0,
    };
    let optimalIvs = {
        atk: 0,
        def: 0,
        hp: 0,
    };
    let optimalLevel = 0;

    let lowestMaxedProduct = 0;
    let highestMaxedProduct = 0;

    outer: for (const atkIv of ivRange) {
        for (const defIv of ivRange) {
            for (const hpIv of ivRange) {
                let cp = null;

                const highestLevelIndexReversed = reversedCpms.findIndex((cpm) => {
                    cp = (baseStats.atk + atkIv) * ((baseStats.def + defIv) * (baseStats.hp + hpIv)) ** 0.5 * cpm ** 2 / 10;

                    return cp <= cpLimit;
                });
                const highestLevelIndex = cappedCpms.length - highestLevelIndexReversed - 1;

                // if highest level is null, hp raising will not help
                if (highestLevelIndexReversed === -1) {
                    // additionally: if both def and hp IVs are 0 and the highest level is null / not found
                    // raising none of the IVs will help
                    if (defIv === 0 && hpIv === 0) {
                        break outer;
                    }

                    break;
                }

                const lastProduct = Object.values(optimalProductiveValues).reduce((acc, cur) => acc * cur, 1);
                const curAtkProduct = (baseStats.atk + atkIv) * cappedCpms[ highestLevelIndex ];
                const curDefProduct = (baseStats.def + defIv) * cappedCpms[ highestLevelIndex ];
                const curHpProduct = Math.floor((baseStats.hp + hpIv) * cappedCpms[ highestLevelIndex ]);
                const currentProduct = curAtkProduct * curDefProduct * curHpProduct;

                // add lowest and highest maxed product if not set
                if (lowestMaxedProduct === 0) {
                    lowestMaxedProduct = currentProduct;
                }
                if (highestMaxedProduct === 0) {
                    highestMaxedProduct = currentProduct;
                }

                // otherwise, if topping, switch out products
                if (currentProduct < lowestMaxedProduct) {
                    lowestMaxedProduct = currentProduct;
                }
                if (currentProduct > highestMaxedProduct) {
                    highestMaxedProduct = currentProduct;
                }

                // if the current product is higher than the last product, update the optimal values
                if (currentProduct > lastProduct) {
                    optimalProductiveValues = {
                        atk: curAtkProduct,
                        def: curDefProduct,
                        hp: curHpProduct,
                    };

                    optimalIvs = {
                        atk: atkIv,
                        def: defIv,
                        hp: hpIv,
                    };

                    // levels are 1 + half levels
                    optimalLevel = (highestLevelIndex / 2) + 1;

                    highestMaxedProduct = currentProduct;
                }
            }
        }
    }

    return {
        ...optimalIvs,
        level: optimalLevel,
        lowestProduct: lowestMaxedProduct,
        highestProduct: highestMaxedProduct,
    };
}

export function levelCpms(): number[] {
    const cappedCpMs = cpms.slice(0, 51).flatMap((cpm, index) => {
        // add half levels
        if (index === 50) {
            return [ cpm ];
        }

        const halfUpCpm = Math.floor(((cpm + cpms[ index + 1 ]) / 2 + Number.EPSILON) * 100000) / 100000;

        return [ cpm, halfUpCpm ];
    });

    return cappedCpMs;
}

const a = calculateOptimalIVs(1500, {
    atk: 198,
    def: 189,
    hp: 190,
});

console.log(a);