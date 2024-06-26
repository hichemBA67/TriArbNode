const express = require("express");
const cronstrue = require("cronstrue");

const SurfaceRate = require("../models/SurfaceRate");

//Helpers
const {
  startSurfaceRateCalculation,
  stopSurfaceRateCalculation,
} = require("../helpers/surfaceRate/surfaceRateRouter");
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

router.post("/stop-surface-rate-calculation/", async (req, res) => {
  try {
    stopSurfaceRateCalculation();
    res.status(200).send("Reaccuring surface rate calculation stopped.");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/fetch-surface-rates/", async (req, res) => {
  try {
    let surfaceRates = await SurfaceRate.find();
    if (surfaceRates.length === 0) {
      res.json("No surface rates found.");
    }

    res.json(surfaceRates);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
