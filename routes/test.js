const express = require("express");
//Middleware

//Helpers
const { runArb, stopArb } = require("../helpers/timedFunction");

const router = express.Router();

router.post("/start-cron/", async (req, res) => {
  const { seconds, minutes, hour, dayOfMonth, month, dayOfWeek } = req.body;
  try {
    let timer =
      minutes + " " + hour + " " + dayOfMonth + " " + month + " " + dayOfWeek;

    if (seconds && seconds.trim() !== "") {
      timer = seconds + " " + timer;
    }

    runArb(timer);
    res.status(200).send("Arbitrage running");
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
