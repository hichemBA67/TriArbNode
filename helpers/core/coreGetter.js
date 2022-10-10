const Core = require("../../models/Core");

async function getMinimumSurfaceRate() {
  const core = await Core.findOne({}).select("minimumSurfaceRate");
  return core.minimumSurfaceRate;
}

async function getSurfaceRateAmountIn() {
  const core = await Core.findOne({}).select("surfaceRateAmountIn");
  return core.surfaceRateAmountIn;
}

async function getRealRateAmountIn() {
  const core = await Core.findOne({}).select("realRateAmountIn");
  return core.realRateAmountIn;
}

async function getRealRateThreashold() {
  const core = await Core.findOne({}).select("realRateThreashold");
  return core.realRateThreashold;
}

async function getTesterAmounts() {
  const core = await Core.findOne({}).select("getTesterAmounts");
  return core.getTesterAmounts;
}

module.exports = {
  getMinimumSurfaceRate,
  getSurfaceRateAmountIn,
  getRealRateAmountIn,
  getRealRateThreashold,
  getTesterAmounts,
};
