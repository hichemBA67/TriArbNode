const createKeccakHash = require("keccak");

// Helpers //
const calculateSurfaceRate = require("./calculateSurfaceRate");

module.exports = structureTradingPairs = (rawData) => {
  console.log("Structuring pairs ...");

  let triangularPairList = [];
  let duplicatesList = [];
  let pairsList = rawData;

  // Loop through each coin to find potential match
  for (let i = 0; i < pairsList.length; i++) {
    // Get 1st pair
    const aBase = pairsList[i].token0.symbol;
    const aQuote = pairsList[i].token1.symbol;
    const aPair = aBase + "_" + aQuote;

    const aToken0Id = pairsList[i].token0.id;
    const aToken1Id = pairsList[i].token1.id;
    const aContract = pairsList[i].id;

    const aToken0Decimals = pairsList[i].token0.decimals;
    const aToken1Decimals = pairsList[i].token1.decimals;

    const aToken0Price = pairsList[i].token0Price;
    const aToken1Price = pairsList[i].token1Price;

    // Put A into box for checking at B
    let aPairBox = [aBase, aQuote];

    // Get 2nd pair
    for (let j = 0; j < pairsList.length; j++) {
      const bBase = pairsList[j].token0.symbol;
      const bQuote = pairsList[j].token1.symbol;
      const bPair = bBase + "_" + bQuote;

      const bToken0Id = pairsList[j].token0.id;
      const bToken1Id = pairsList[j].token1.id;
      const bContract = pairsList[j].id;

      const bToken0Decimals = pairsList[j].token0.decimals;
      const bToken1Decimals = pairsList[j].token1.decimals;

      const bToken0Price = pairsList[j].token0Price;
      const bToken1Price = pairsList[j].token1Price;

      // Get 3rd pair
      if (
        pairsList[i] != pairsList[j] &&
        (aPairBox.includes(bBase) || aPairBox.includes(bQuote))
      ) {
        for (let k = 0; k < pairsList.length; k++) {
          const cBase = pairsList[k].token0.symbol;
          const cQuote = pairsList[k].token1.symbol;
          const cPair = cBase + "_" + cQuote;

          const cToken0Id = pairsList[k].token0.id;
          const cToken1Id = pairsList[k].token1.id;
          const cContract = pairsList[k].id;

          const cToken0Decimals = pairsList[k].token0.decimals;
          const cToken1Decimals = pairsList[k].token1.decimals;

          const cToken0Price = pairsList[k].token0Price;
          const cToken1Price = pairsList[k].token1Price;

          // Count number of C items
          if (cPair != aPair && cPair != bPair) {
            let combineAll = [aPair, bPair, cPair];
            let pairBox = [aBase, aQuote, bBase, bQuote, cBase, cQuote];

            let countsCBase = 0;
            for (let l = 0; l < pairBox.length; l++) {
              if (pairBox[l] == cBase) {
                countsCBase += 1;
              }
            }

            let countsCQuote = 0;
            for (let l = 0; l < pairBox.length; l++) {
              if (pairBox[l] == cQuote) {
                countsCQuote += 1;
              }
            }

            if (countsCBase == 2 && countsCQuote == 2 && cBase != cQuote) {
              let combined = aPair + "," + bPair + "," + cPair;
              let uniqueCombination = [aPair, bPair, cPair].sort();
              let uniqueString = uniqueCombination.join("-");

              if (!duplicatesList.includes(uniqueString)) {
                let surfaceRateOpportunityHash = createKeccakHash("keccak256")
                  .update([aPair, bPair, cPair].join("-"))
                  .digest("hex");

                // Create surface rate object
                surfaceRateObject = {
                  surfaceRateOpportunityHash,
                  aPair,
                  aBase,
                  aQuote,
                  bPair,
                  bBase,
                  bQuote,
                  cPair,
                  cBase,
                  cQuote,
                  combined,
                  aToken0Id,
                  bToken0Id,
                  cToken0Id,
                  aToken1Id,
                  bToken1Id,
                  cToken1Id,
                  aContract,
                  bContract,
                  cContract,
                  aToken0Decimals,
                  aToken1Decimals,
                  bToken0Decimals,
                  bToken1Decimals,
                  cToken0Decimals,
                  cToken1Decimals,
                  aToken0Price,
                  aToken1Price,
                  bToken0Price,
                  bToken1Price,
                  cToken0Price,
                  cToken1Price,
                };

                triangularPairList.push(surfaceRateObject);
                duplicatesList.push(uniqueString);
              }
            }
          }
        }
      }
    }
  }
  console.log("Pairs structured.");
  calculateSurfaceRate(triangularPairList);
};
