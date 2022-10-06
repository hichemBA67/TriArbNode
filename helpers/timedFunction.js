const cron = require("node-cron");

let task;

function runArb(timer) {
  if (task) task.stop();
  console.log("Starting arbitrage ...");
  task = cron.schedule(timer, () => {
    console.log("Running arbitrage ...");
  });
}

function stopArb() {
  task.stop();
  console.log("Arbitrage stopped.");
}

module.exports = { runArb, stopArb };
