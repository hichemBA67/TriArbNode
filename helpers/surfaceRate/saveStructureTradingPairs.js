const SurfaceRate = require("../../models/SurfaceRate");

module.exports = saveStructureTradingPairs = async (surfaceRateObject) => {
  try {
    let submitSurfaceRate = new SurfaceRate(surfaceRateObject);
    await submitSurfaceRate.save();
  } catch (error) {
    console.error(error.message);
  }
};
