const ethers = require("ethers");
const QuoterABI = require("../../artifacts/UniswapV3/Quoter.json").abi;
const config = require("config");

// Helpers //
const {
  getRealRateAmountIn,
  getRealRateThreashold,
} = require("../core/coreGetter");

const saveRealRateTradingPairs = require("./saveRealRateTradingPairs");
const { clearRealRateDatabase } = require("../database/clearDatabase");

const mainnetRPCRealRate = config.get("mainnetRPCRealRate");
const quoterAddress = config.get("quoterAddress");

module.exports = calculateDepth = async (surfaceRateData) => {
  const realRateAmountIn = await getRealRateAmountIn();
  const realRateThreashold = await getRealRateThreashold();

  clearRealRateDatabase();

  console.log("Starting real rate calculation ...");
  for (let i = 0; i < surfaceRateData.length; i++) {
    calculatePair(surfaceRateData[i], realRateAmountIn, realRateThreashold);
  }
};

async function calculatePair(pairData, realRateAmountIn, realRateThreashold) {
  // Extract variables
  let pair1ContractAddress = pairData.poolContract1;
  let pair2ContractAddress = pairData.poolContract2;
  let pair3ContractAddress = pairData.poolContract3;

  let trade1Direction = pairData.poolTradeDirection1;
  let trade2Direction = pairData.poolTradeDirection2;
  let trade3Direction = pairData.poolTradeDirection3;

  // Trade 1 //
  let acquiredCoinT1 = await getPrice(
    pair1ContractAddress,
    realRateAmountIn,
    trade1Direction
  );
  // Trade 2 //
  if (acquiredCoinT1 == 0) return;
  let acquiredCoinT2 = await getPrice(
    pair2ContractAddress,
    acquiredCoinT1,
    trade2Direction
  );
  // Trade 3 //
  if (acquiredCoinT2 == 0) return;
  let acquiredCoinT3 = await getPrice(
    pair3ContractAddress,
    acquiredCoinT2,
    trade3Direction
  );
  // Calculate and save results
  caluclateArbitrage(
    realRateAmountIn,
    acquiredCoinT3,
    pairData,
    realRateThreashold
  );
}

// GET PRICE //
async function getPrice(factory, amountIn, tradeDirection) {
  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(mainnetRPCRealRate);
  const ABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
  ];
  const address = factory;
  // Get pool token information
  const poolContract = new ethers.Contract(address, ABI, provider);
  const token0Address = await poolContract.token0();
  const token1Address = await poolContract.token1();
  const tokenFee = await poolContract.fee();

  // Get individual token information
  let addressArray = [token0Address, token1Address];
  let tokenInfoArray = [];
  let tokenObject = {};
  for (let i = 0; i < addressArray.length; i++) {
    const tokenAddress = addressArray[i];
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint)",
    ];

    try {
      const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      const tokenDecimals = await contract.decimals();
    } catch {
      return 0;
    }

    tokenObject = {
      id: "token" + i,
      tokenSymbol: tokenSymbol,
      tokenName: tokenName,
      tokenDecimals: tokenDecimals,
      tokenAddress: tokenAddress,
    };
    tokenInfoArray.push(tokenObject);
  }

  // Identify the correct token as A and also B respectively
  let inputTokenA = "";
  let inputDecimalsA = 0;
  let inputTokenB = "";
  let inputDecimalsB = 0;

  if (tradeDirection == "baseToQuote") {
    inputTokenA = tokenInfoArray[0].tokenAddress;
    inputDecimalsA = tokenInfoArray[0].tokenDecimals;
    inputTokenB = tokenInfoArray[1].tokenAddress;
    inputDecimalsB = tokenInfoArray[1].tokenDecimals;
  } else if (tradeDirection == "quoteToBase") {
    inputTokenA = tokenInfoArray[1].tokenAddress;
    inputDecimalsA = tokenInfoArray[1].tokenDecimals;
    inputTokenB = tokenInfoArray[0].tokenAddress;
    inputDecimalsB = tokenInfoArray[0].tokenDecimals;
  }

  if (!isNaN(amountIn)) {
    amountIn = Number(amountIn).toFixed(inputDecimalsA);
  }
  amountIn = ethers.utils.parseUnits(amountIn, inputDecimalsA).toString();

  // Get Uniswap V3 Quote
  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
  );

  let quotedAmountOut = 0;
  try {
    quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      inputTokenA,
      inputTokenB,
      tokenFee,
      amountIn,
      0
    );
  } catch (err) {
    return 0;
  }

  // Format output
  const outputAmount = ethers.utils
    .formatUnits(quotedAmountOut, inputDecimalsB)
    .toString();

  return outputAmount;
}

// CALCULATE ARBITRAGE //
function caluclateArbitrage(
  amountIn,
  amountOut,
  surfaceObject,
  realRateThreashold
) {
  // Calculate profit or loss
  const profitLoss = amountOut - amountIn;
  console.log(surfaceObject);
  if (profitLoss > realRateThreashold) {
    const profitLossPercent = (profitLoss / amountIn) * 100;

    surfaceObject.profitLossReal = profitLoss;
    surfaceObject.realRate = profitLossPercent;
    surfaceObject.realRateAmountIn = amountIn;
    surfaceObject.realRateAmountOut = amountOut;
    saveRealRateTradingPairs(surfaceObject);
  }
  return;
}
