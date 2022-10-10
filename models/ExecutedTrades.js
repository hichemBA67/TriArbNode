const mongoose = require("mongoose");

const RealRateSchema = new mongoose.Schema({
  realRateOpportunityHash: {
    type: String,
    require: true,
  },
  token0Address: {
    type: String,
    require: true,
  },
  token1Address: {
    type: String,
    require: true,
  },
  token2Address: {
    type: String,
    require: true,
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

  poolTradeDirection1: {
    type: String,
    require: true,
  },
  poolTradeDirection2: {
    type: String,
    require: true,
  },
  poolTradeDirection3: {
    type: String,
    require: true,
  },

  surfaceRateAmountIn: {
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
  profitLossReal: {
    type: Number,
    require: true,
  },
  surfaceRate: {
    type: Number,
    require: true,
  },
  realRate: {
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

module.exports = RealRate = mongoose.model("real-rate", RealRateSchema);
