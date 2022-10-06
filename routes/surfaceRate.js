const express = require("express");
const SurfaceRate = require("../models/SurfaceRate");

//Helpers
const { runArb, stopArb } = require("../helpers/timedFunction");
const calculateSurfaceRate = require("../helpers/surfaceRate/calculateSurfaceRate");
const calculateTimer = require("../helpers/node-cron/calculateTimer");

const router = express.Router();

router.post("/calculate-surface-rate/", async (req, res) => {
  const timerData = req.body;
  try {
    const timer = calculateTimer(timerData);

    // calculateSurfaceRate(timer);

    // res
    //   .status(200)
    //   .send(
    //     "Reaccuring surface rate calculation initialized with interval:  " +
    //       timer
    //   );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/stop-cron/", async (req, res) => {
  try {
    stopArb();
    res.status(200).send("Arbitrage stopped");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
