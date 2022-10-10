const mongoose = require("mongoose");

const CoreSchema = new mongoose.Schema({
  minimumSurfaceRate: {
    type: Number,
    require: true,
  },
  surfaceRateAmountIn: {
    type: Number,
    require: true,
  },
  realRateAmountIn: {
    type: Number,
    require: true,
  },
  realRateThreashold: {
    type: Number,
    require: true,
  },
  testerAmounts: [
    {
      input: {
        type: Number,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Core = mongoose.model("core", CoreSchema);
