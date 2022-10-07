const cron = require("node-cron");
const cronstrue = require("cronstrue");

const SurfaceRate = require("../../models/SurfaceRate");
const calculateDepth = require("./calculateDepth");

let task;

function startRealRateCalculation(timer) {
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}] Reaccuring real rate calculation initialized with interval: ${cronstrue.toString(
      timer
    )}`
  );

  if (task) task.stop();
  task = cron.schedule(timer, async () => {
    // Log
    console.log(
      `\n[${new Date(
        Date.now()
      ).toUTCString()}] Starting real rate calculation ... `
    );
    console.log("Fetching surface rates from database ...");

    fetchSurfaceRateData();
  });
}
async function fetchSurfaceRateData() {
  let surfaceRateData = await SurfaceRate.find();
  if (surfaceRateData.length > 0) {
    console.log("Received surface rates from database.");
    // Calculate real rate
    calculateDepth(surfaceRateData);
  } else {
    console.log("No surface rate data found.");
  }
}

function stopRealRateCalculation() {
  if (task) task.stop();
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}] Reaccuring real rate calculation stopped.`
  );
}

module.exports = {
  startRealRateCalculation,
  stopRealRateCalculation,
};
