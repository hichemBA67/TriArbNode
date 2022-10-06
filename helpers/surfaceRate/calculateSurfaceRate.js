const createKeccakHash = require("keccak");
const request = require("request");

const config = require("config");
graphQLReq = require("../../utils/GraphQLRequest");

const url = config.get("UniswapV3GraphQLEndpoint");

const SurfaceRate = require("../../models/SurfaceRate");
const cron = require("node-cron");

// Helpers
const structureTradingPairs = require("./structureTradingPairs");

let task;

module.exports = startSurfaceRateCalculation = (timer) => {
  if (task) task.stop();
  task = cron.schedule(timer, async () => {
    console.log("Fetching data from GraphQL ...");

    request.post(
      url,
      { json: { query: graphQLReq } },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Data received from GraphQL.");
          structureTradingPairs(body);
        }
      }
    );

    // await SurfaceRate.updateOne(
    //   { surfaceRateHash: surfaceRateHash },
    //   { $set: data },
    //   { upsert: true }
    // );
    // await surfaceRate.save();
  });
};

function stopArb() {
  task.stop();
  console.log("Arbitrage stopped.");
}
