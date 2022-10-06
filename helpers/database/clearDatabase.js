const SurfaceRate = require("../../models/SurfaceRate");

module.exports = clearSurfaceRateDatabase = async () => {
  await SurfaceRate.deleteMany({});
};
