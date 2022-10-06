const config = require("config");

// Helpers //
const saveStructureTradingPairs = require("./saveStructureTradingPairs");

const minimumSurfaceRate = config.get("minimumSurfaceRate");
const startingAmount = config.get("startingAmount");
const baseToQuote = "baseToQuote";
const quoteToBase = "quoteToBase";

module.exports = calculateSurfaceRate = async (triangularPairList) => {
  console.log("Calculating surface rate ...");
  for (let pairIndex = 0; pairIndex < triangularPairList.length; pairIndex++) {
    calculator(triangularPairList[pairIndex]);
  }
  console.log(
    "Surface rate calculated and potential pairs stored in database."
  );
};

function calculator(triangularPair) {
  let surfaceRateObject = {};
  let poolContract2;
  let poolContract3;
  let poolTradeDirection1;
  let poolTradeDirection2;
  let poolTradeDirection3;

  let token0Address;
  let token1Address;
  let token2Address;

  // Calculate looping through forward and reverse rates
  const directionList = ["forward", "reverse"];

  for (let i = 0; i < directionList.length; i++) {
    let direction = directionList[i];

    // Set pair info
    let aBase = triangularPair.aBase;
    let aQuote = triangularPair.aQuote;
    let bBase = triangularPair.bBase;
    let bQuote = triangularPair.bQuote;
    let cBase = triangularPair.cBase;
    let cQuote = triangularPair.cQuote;

    // Set price info
    let aToken0Price = parseFloat(triangularPair.aToken0Price);
    let aToken1Price = parseFloat(triangularPair.aToken1Price);
    let bToken0Price = parseFloat(triangularPair.bToken0Price);
    let bToken1Price = parseFloat(triangularPair.bToken1Price);
    let cToken0Price = parseFloat(triangularPair.cToken0Price);
    let cToken1Price = parseFloat(triangularPair.cToken1Price);

    // Set price info
    let aToken0Id = triangularPair.aToken0Id;
    let aToken1Id = triangularPair.aToken1Id;
    let bToken0Id = triangularPair.bToken0Id;
    let bToken1Id = triangularPair.bToken1Id;
    let cToken0Id = triangularPair.cToken0Id;
    let cToken1Id = triangularPair.cToken1Id;

    // Set address info
    let aContract = triangularPair.aContract;
    let bContract = triangularPair.bContract;
    let cContract = triangularPair.cContract;

    let acquiredCoinT2 = 0;
    let acquiredCoinT3 = 0;
    let calculated = 0;

    let swap1 = 0;
    let swap2 = 0;
    let swap3 = 0;

    let swap1Rate = 0;
    let swap2Rate = 0;
    let swap3Rate = 0;

    // Assume start with aBase if forward
    if (direction == "forward") {
      swap1 = aBase;
      swap2 = aQuote;
      swap1Rate = aToken1Price;
      poolTradeDirection1 = baseToQuote;
    }
    // Assume start with aQuote if forward
    else if (direction == "reverse") {
      swap1 = aQuote;
      swap2 = aBase;
      swap1Rate = aToken0Price;
      poolTradeDirection1 = quoteToBase;
    }

    // Place first trade
    poolContract1 = aContract;
    acquiredCoinT1 = startingAmount * swap1Rate;

    if (direction == "forward") {
      // FORWARD: Check if aQuote (acquired coin) matches bQuote //
      if (aQuote == bQuote && calculated == 0) {
        swap2Rate = bToken0Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = quoteToBase;
        poolContract2 = bContract;

        token0Address = aToken0Id;
        token1Address = bToken1Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (bBase == cBase) {
          swap3 = cBase;
          swap3Rate = cToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = cContract;

          token2Address = cToken0Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (bBase == cQuote) {
          swap3 = cQuote;
          swap3Rate = cToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = cContract;

          token2Address = cToken1Id;
        }

        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // FORWARD: Check if aQuote (acquired coin) matches bBase //
      else if (aQuote == bBase && calculated == 0) {
        swap2Rate = bToken1Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = baseToQuote;
        poolContract2 = bContract;

        token0Address = aToken0Id;
        token1Address = bToken0Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (bQuote == cBase) {
          swap3 = cBase;
          swap3Rate = cToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = cContract;

          token2Address = cToken0Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (bQuote == cQuote) {
          swap3 = cQuote;
          swap3Rate = cToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = cContract;

          token2Address = cToken1Id;
        }
        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // FORWARD: Check if aQuote (acquired coin) matches cQuote //
      else if (aQuote == cQuote && calculated == 0) {
        swap2Rate = cToken0Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = quoteToBase;
        poolContract2 = cContract;

        token0Address = aToken0Id;
        token1Address = cToken1Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (cBase == bBase) {
          swap3 = bBase;
          swap3Rate = bToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = bContract;

          token2Address = bToken0Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (cBase == bQuote) {
          swap3 = bQuote;
          swap3Rate = bToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = bContract;

          token2Address = bToken1Id;
        }

        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // FORWARD: Check if aQuote (acquired coin) matches cBase //
      else if (aQuote == cBase && calculated == 0) {
        swap2Rate = cToken1Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = baseToQuote;
        poolContract2 = cContract;

        token0Address = aToken0Id;
        token1Address = cToken0Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (cQuote == bBase) {
          swap3 = bBase;
          swap3Rate = cToken1Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = bContract;

          token2Address = bToken0Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (cQuote == bQuote) {
          swap3 = bQuote;
          swap3Rate = bToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = bContract;

          token2Address = bToken1Id;
        }
        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
    } else if (direction == "reverse") {
      // REVERSE: Check if aBase (acquired coin) matches bBase //
      if (aBase == bBase && calculated == 0) {
        swap2Rate = bToken1Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = baseToQuote;
        poolContract2 = bContract;

        token0Address = aToken1Id;
        token1Address = bToken0Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (bQuote == cQuote) {
          swap3 = cQuote;
          swap3Rate = cToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = cContract;

          token2Address = cToken1Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (bQuote == cBase) {
          swap3 = cBase;
          swap3Rate = cToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = cContract;

          token2Address = cToken0Id;
        }

        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // REVERSE: Check if aBase (acquired coin) matches bQuote //
      else if (aBase == bQuote && calculated == 0) {
        swap2Rate = bToken0Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = quoteToBase;
        poolContract2 = bContract;

        token0Address = aToken1Id;
        token1Address = bToken1Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (bBase == cQuote) {
          swap3 = cQuote;
          swap3Rate = cToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = cContract;

          token2Address = cToken1Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (bBase == cBase) {
          swap3 = cBase;
          swap3Rate = cToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = cContract;

          token2Address = cToken0Id;
        }
        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // REVERSE: Check if aBase (acquired coin) matches cBase //
      else if (aQuote == cBase && calculated == 0) {
        swap2Rate = cToken1Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = baseToQuote;
        poolContract2 = cContract;

        token0Address = aToken1Id;
        token1Address = cToken0Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (cQuote == bQuote) {
          swap3 = bQuote;
          swap3Rate = bToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = bContract;

          token2Address = bToken1Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (cQuote == bBase) {
          swap3 = bBase;
          swap3Rate = bToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = bContract;

          token2Address = bToken0Id;
        }

        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
      // REVERSE: Check if aBase (acquired coin) matches cQuote //
      else if (aQuote == cQuote && calculated == 0) {
        swap2Rate = cToken0Price;
        acquiredCoinT2 = acquiredCoinT1 * swap2Rate;
        poolTradeDirection2 = quoteToBase;
        poolContract2 = cContract;

        token0Address = aToken1Id;
        token1Address = cToken1Id;

        // Forward: check if bBase (acquired coin) matches cBase
        if (cBase == bQuote) {
          swap3 = bQuote;
          swap3Rate = cToken0Price;
          poolTradeDirection3 = quoteToBase;
          poolContract3 = cContract;

          token2Address = bToken1Id;
        }
        // Forward: check if bBase (acquired coin) matches cQuote
        else if (cBase == bBase) {
          swap3 = bBase;
          swap3Rate = bToken1Price;
          poolTradeDirection3 = baseToQuote;
          poolContract3 = bContract;

          token2Address = bToken0Id;
        }
        acquiredCoinT3 = acquiredCoinT2 * swap3Rate;
        calculated = 1;
      }
    }

    // Calculate arbitrage result
    let profitLoss = acquiredCoinT3 - startingAmount;
    let profitLossPercentage = (profitLoss / startingAmount) * 100;

    // Format Description
    const tradeDescription1 = `Start with ${swap1} of ${startingAmount}. Swap at ${swap1Rate} for ${swap2} acquiring ${acquiredCoinT1}.`;
    const tradeDescription2 = `Swap ${acquiredCoinT1} of ${swap2} at ${swap2Rate} for ${swap3} acquiring ${acquiredCoinT2}.`;
    const tradeDescription3 = `Swap ${acquiredCoinT2} of ${swap3} at ${swap3Rate} for ${swap1} acquiring ${acquiredCoinT3}`;

    if (profitLossPercentage >= minimumSurfaceRate) {
      // Construct surfaceRateObject
      surfaceRateObject = {
        surfaceRateOpportunityHash: triangularPair.surfaceRateOpportunityHash,
        token0Address,
        token1Address,
        token2Address,
        swap1,
        swap2,
        swap3,
        poolContract1,
        poolContract2,
        poolContract3,
        poolTradeDirection1,
        poolTradeDirection2,
        poolTradeDirection3,
        startingAmount,
        acquiredCoinT1,
        acquiredCoinT2,
        acquiredCoinT3,
        swap1Rate,
        swap2Rate,
        swap3Rate,
        profitLossSurface: profitLoss,
        surfaceRate: profitLossPercentage,
        direction,
        tradeDescription1,
        tradeDescription2,
        tradeDescription3,
      };

      saveStructureTradingPairs(surfaceRateObject);
    }
  }
}
