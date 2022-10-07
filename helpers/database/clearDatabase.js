const SurfaceRate = require("../../models/SurfaceRate");
const RealRate = require("../../models/RealRate");

async function clearSurfaceRateDatabase() {
  await SurfaceRate.deleteMany({});
}

async function clearRealRateDatabase() {
  await RealRate.deleteMany({});
}

module.exports = { clearSurfaceRateDatabase, clearRealRateDatabase };
