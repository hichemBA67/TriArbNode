const express = require("express");
const cronstrue = require("cronstrue");

//Helpers
const {
  startSurfaceRateCalculation,
  stopSurfaceRateCalculation,
} = require("../helpers/surfaceRate/surfaceRateCalculation");
const calculateTimer = require("../helpers/node-cron/calculateTimer");

const router = express.Router();

router.post("/calculate-surface-rate/", async (req, res) => {
  const timerData = req.body;
  try {
    if (
      !timerData.minutes ||
      !timerData.hour ||
      !timerData.dayOfMonth ||
      !timerData.month ||
      !timerData.dayOfWeek
    ) {
      return res.status(400).json({
        errors: [{ message: "Please enter valid timer data." }],
      });
    }
    const timer = calculateTimer(timerData);

    startSurfaceRateCalculation(timer);

    res
      .status(200)
      .send(
        "Reaccuring surface rate calculation initialized with interval: " +
          cronstrue.toString(timer)
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post("/stop-surface-rate-calc/", async (req, res) => {
  try {
    stopSurfaceRateCalculation();
    res.status(200).send("Reaccuring surface rate calculation stopped.");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
