const RealRate = require("../../models/RealRate");

module.exports = saveRealRateTradingPairs = async (surfaceRateObject) => {
  const realRateObject = createRealRateObject(surfaceRateObject);
  try {
    let submitRealRate = new RealRate(realRateObject);
    await submitRealRate.save();
  } catch (error) {
    console.error(error.message);
  }
};

function createRealRateObject(surfaceRateObject) {
  const realRateObject = {
    surfaceRateOpportunityHash: surfaceRateObject.surfaceRateOpportunityHash,
    token0Address: surfaceRateObject.token0Address,
    token1Address: surfaceRateObject.token1Address,
    token2Address: surfaceRateObject.token2Address,
    swap1: surfaceRateObject.swap1,
    swap2: surfaceRateObject.swap2,
    swap3: surfaceRateObject.swap3,
    poolContract1: surfaceRateObject.poolContract1,
    poolContract2: surfaceRateObject.poolContract2,
    poolContract3: surfaceRateObject.poolContract3,
    poolTradeDirection1: surfaceRateObject.poolTradeDirection1,
    poolTradeDirection2: surfaceRateObject.poolTradeDirection2,
    poolTradeDirection3: surfaceRateObject.poolTradeDirection3,
    surfaceRateAmountIn: surfaceRateObject.surfaceRateAmountIn,
    acquiredCoinT1: surfaceRateObject.acquiredCoinT1,
    acquiredCoinT2: surfaceRateObject.acquiredCoinT2,
    acquiredCoinT3: surfaceRateObject.acquiredCoinT3,
    swap1Rate: surfaceRateObject.swap1Rate,
    swap2Rate: surfaceRateObject.swap2Rate,
    swap3Rate: surfaceRateObject.swap3Rate,
    profitLossSurface: surfaceRateObject.profitLossSurface,
    surfaceRate: surfaceRateObject.surfaceRate,
    tradeDescription1: surfaceRateObject.tradeDescription1,
    tradeDescription1: surfaceRateObject.tradeDescription1,
    tradeDescription2: surfaceRateObject.tradeDescription2,
    tradeDescription3: surfaceRateObject.tradeDescription3,
    realRate: surfaceRateObject.realRate,
    profitLossReal: surfaceRateObject.profitLossReal,
  };
  return realRateObject;
}
