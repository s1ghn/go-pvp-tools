export const cpms = [
    0.1351374318,
    0.16639787,
    0.192650919,
    0.21573247,
    0.2365726613,
    0.25572005,
    0.2735303812,
    0.29024988,
    0.3060573775,
    0.3210876,
    0.3354450362,
    0.34921268,
    0.3624577511,
    0.3752356,
    0.387592416,
    0.39956728,
    0.4111935514,
    0.4225,
    0.4329264091,
    0.44310755,
    0.4530599591,
    0.4627984,
    0.472336093,
    0.48168495,
    0.4908558003,
    0.49985844,
    0.508701765,
    0.51739395,
    0.5259425113,
    0.5343543,
    0.5426357375,
    0.5507927,
    0.5588305862,
    0.5667545,
    0.5745691333,
    0.5822789,
    0.5898879072,
    0.5974,
    0.6048236651,
    0.6121573,
    0.6194041216,
    0.6265671,
    0.6336491432,
    0.64065295,
    0.6475809666,
    0.65443563,
    0.6612192524,
    0.667934,
    0.6745818959,
    0.6811649,
    0.6876849038,
    0.69414365,
    0.70054287,
    0.7068842,
    0.7131691091,
    0.7193991,
    0.7255756136,
    0.7317,
    0.7347410093,
    0.7377695,
    0.7407855938,
    0.74378943,
    0.7467812109,
    0.74976104,
    0.7527290867,
    0.7556855,
    0.7586303683,
    0.76156384,
    0.7644860647,
    0.76739717,
    0.7702972656,
    0.7731865,
    0.7760649616,
    0.77893275,
    0.7817900548,
    0.784637,
    0.7874736075,
    0.7903,
    0.792803968,
    0.79530001,
    0.797800015,
    0.8003,
    0.802799995,
    0.8053,
    0.8078,
    0.81029999,
    0.812799985,
    0.81529999,
    0.81779999,
    0.82029999,
    0.82279999,
    0.82529999,
    0.82779999,
    0.83029999,
    0.83279999,
    0.83529999,
    0.83779999,
    0.84029999,
    0.84279999,
    0.84529999
] as number[];

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