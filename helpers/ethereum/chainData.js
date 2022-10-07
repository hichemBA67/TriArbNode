const ethers = require("ethers");
const config = require("config");

const mainnetRPCGasFees = config.get("mainnetRPCGasFees");

// Get provider
const provider = new ethers.providers.JsonRpcProvider(mainnetRPCGasFees);

async function getGasPrice() {
  let gasPriceObject = {};
  const gasPrice = await provider.getGasPrice();
  console.log(gasPrice);
  gasPriceObject.gasPrice = gasPrice;
  gasPriceObject.gasPriceInGwei = ethers.utils.formatUnits(gasPrice, "gwei");

  return gasPriceObject;
}

async function getFees() {
  let feeObject = {};
  const feeData = await provider.getFeeData();

  feeObject.gasPrice = feeData.gasPrice;
  feeObject.maxFeePerGas = feeData.maxFeePerGas;
  feeObject.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

  feeObject.gasPriceInGwei = ethers.utils.formatUnits(feeData.gasPrice, "gwei");
  feeObject.maxFeePerGasInGwei = ethers.utils.formatUnits(
    feeData.maxFeePerGas,
    "gwei"
  );
  feeObject.maxPriorityFeePerGasInGwei = ethers.utils.formatUnits(
    feeData.maxPriorityFeePerGas,
    "gwei"
  );

  return feeObject;
}

async function getBlockNumber() {
  return await provider.getBlockNumber();
}

async function getNetwork() {
  return await provider.getNetwork();
}

async function getTransaction(hash) {
  return await provider.getTransaction(hash);
}

module.exports = {
  getGasPrice,
  getFees,
  getBlockNumber,
  getNetwork,
  getTransaction,
};
