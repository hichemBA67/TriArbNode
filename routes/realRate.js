const express = require("express");
const cronstrue = require("cronstrue");

const RealRate = require("../models/RealRate");

//Helpers
const {
  startRealRateCalculation,
  stopRealRateCalculation,
} = require("../helpers/realRate/realRateRouter");
const calculateTimer = require("../helpers/node-cron/calculateTimer");

const router = express.Router();

router.post("/calculate-real-rate/", async (req, res) => {
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

    startRealRateCalculation(timer);

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

router.post("/stop-real-rate-calculation/", async (req, res) => {
  try {
    stopRealRateCalculation();
    res.status(200).send("Reaccuring surface rate calculation stopped.");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/fetch-real-rates/", async (req, res) => {
  try {
    let realRates = await RealRate.find();
    if (realRates.length === 0) {
      res.json("No real rates found.");
    }

    res.json(realRates);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
