const mongoose = require("mongoose");

const SurfaceRatSchema = new mongoose.Schema({
  surfaceRateOpportunityHash: {
    type: String,
    require: true,
  },
  token0Address: {
    type: String,
  },
  token1Address: {
    type: String,
  },
  token2Address: {
    type: String,
  },

  swap1: {
    type: String,
  },
  swap2: {
    type: String,
  },
  swap3: {
    type: String,
  },

  poolContract1: {
    type: String,
  },
  poolContract2: {
    type: String,
  },
  poolContract3: {
    type: String,
  },

  poolDirectionTrade1: {
    type: String,
  },
  poolDirectionTrade2: {
    type: String,
  },
  poolDirectionTrade3: {
    type: String,
  },

  startingAmount: {
    type: Number,
  },
  acquiredCoinT1: {
    type: Number,
  },
  acquiredCoinT2: {
    type: Number,
  },
  acquiredCoinT3: {
    type: Number,
  },

  swap1Rate: {
    type: Number,
  },
  swap2Rate: {
    type: Number,
  },
  swap3Rate: {
    type: Number,
  },

  profitLossSurface: {
    type: Number,
  },
  surfaceRate: {
    type: Number,
  },
  direction: {
    type: String,
  },

  tradeDescription1: {
    type: String,
  },
  tradeDescription2: {
    type: String,
  },
  tradeDescription3: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = SurfaceRate = mongoose.model("surface-rate", SurfaceRatSchema);
