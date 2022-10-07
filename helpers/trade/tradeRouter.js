const cron = require("node-cron");
const cronstrue = require("cronstrue");

const RealRate = require("../../models/RealRate");

let task;

function startTrade(timer) {
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}]Reaccuing trade execution initialized with interval: ${cronstrue.toString(
      timer
    )}`
  );

  if (task) task.stop();
  task = cron.schedule(timer, async () => {
    console.log("Fetching real rates from database ...");
    fetchRealRateData();
  });
}
async function fetchRealRateData() {
  let realRateData = await RealRate.find();
  if (realRateData.length > 0) {
    console.log("Received real rates from database.");

    // Trade tester
  } else {
    console.log("No real rate data found.");
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
