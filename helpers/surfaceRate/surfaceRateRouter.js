const request = require("request");
const config = require("config");
const cron = require("node-cron");
const cronstrue = require("cronstrue");

// Variables //
const graphQLReq = require("../../utils/GraphQLRequest");
const url = config.get("UniswapV3GraphQLEndpoint");

// Helpers //
const structureTradingPairs = require("./structureTradingPairs");
const clearSurfaceRateDatabase = require("../database/clearDatabase");

let task;

function startSurfaceRateCalculation(timer) {
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}] Reaccuring surface rate calculation initialized with interval: ${cronstrue.toString(
      timer
    )}`
  );

  if (task) task.stop();
  task = cron.schedule(timer, async () => {
    // Log
    console.log(
      `\n[${new Date(
        Date.now()
      ).toUTCString()}] Starting surface rate calculation ... `
    );
    console.log("Fetching data from GraphQL ...");

    sendPostRequest();
  });
}
function sendPostRequest() {
  clearSurfaceRateDatabase();
  // Fetch pool data from GraphQL
  request.post(
    url,
    { json: { query: graphQLReq } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Data received from GraphQL.");
        structureTradingPairs(body.data.pools);
      }
    }
  );
}

function stopSurfaceRateCalculation() {
  if (task) task.stop();
  console.log(
    `\n[${new Date(
      Date.now()
    ).toUTCString()}] Reaccuring surface rate calculation stopped.`
  );
}

module.exports = {
  startSurfaceRateCalculation,
  stopSurfaceRateCalculation,
  sendPostRequest,
};