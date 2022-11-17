const cron = require("node-cron");
const cronstrue = require("cronstrue");

const RealRate = require("../../models/RealRate");

// Helpers
const { testTrade } = require("./tradeTester");

let task;

function startTradeExecution(timer) {
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
    executeTrade();
  });
}
async function executeTrade() {
  let realRateData = await RealRate.find();
  if (realRateData.length > 0) {
    console.log("Received real rates from database.");

    // Trade tester
  } else {
    console.log("No real rate data found.");
  }
}

function stopTradeExecution() {
  if (task) task.stop();
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}] Reaccuring real rate calculation stopped.`
  );
}

module.exports = {
  startTradeExecution,
  stopTradeExecution,
};
