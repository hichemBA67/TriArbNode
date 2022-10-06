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
    require: true,
  },
  swap2: {
    type: String,
    require: true,
  },
  swap3: {
    type: String,
    require: true,
  },

  poolContract1: {
    type: String,
    require: true,
  },
  poolContract2: {
    type: String,
    require: true,
  },
  poolContract3: {
    type: String,
    require: true,
  },

  poolDirectionTrade1: {
    type: String,
    require: true,
  },
  poolDirectionTrade2: {
    type: String,
    require: true,
  },
  poolDirectionTrade3: {
    type: String,
    require: true,
  },

  startingAmount: {
    type: Number,
    require: true,
  },
  acquiredCoinT1: {
    type: Number,
    require: true,
  },
  acquiredCoinT2: {
    type: Number,
    require: true,
  },
  acquiredCoinT3: {
    type: Number,
    require: true,
  },

  swap1Rate: {
    type: Number,
    require: true,
  },
  swap2Rate: {
    type: Number,
    require: true,
  },
  swap3Rate: {
    type: Number,
    require: true,
  },

  profitLossSurface: {
    type: Number,
    require: true,
  },
  surfaceRate: {
    type: Number,
    require: true,
  },
  direction: {
    type: String,
    require: true,
  },

  tradeDescription1: {
    type: String,
    require: true,
  },
  tradeDescription2: {
    type: String,
    require: true,
  },
  tradeDescription3: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = SurfaceRate = mongoose.model("surface-rate", SurfaceRatSchema);
