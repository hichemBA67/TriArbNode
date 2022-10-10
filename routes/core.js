const express = require("express");
const { check, validationResult } = require("express-validator");

const Core = require("../models/Core");

const router = express.Router();

router.post(
  "/new-settings/",
  [
    [
      check("minimumSurfaceRate", "minimumSurfaceRate is required")
        .not()
        .isEmpty(),
      check("surfaceRateAmountIn", "surfaceRateAmountIn is required")
        .not()
        .isEmpty(),
      check("realRateAmountIn", "realRateAmountIn is required").not().isEmpty(),
      check("realRateThreashold", "realRateThreashold is required")
        .not()
        .isEmpty(),
      check("testerInputAmount", "Initial testerInputAmount is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      minimumSurfaceRate,
      surfaceRateAmountIn,
      realRateAmountIn,
      realRateThreashold,
      testerInputAmount,
    } = req.body;
    try {
      const testerAmounts = [{ input: testerInputAmount }];
      const coreObject = {
        minimumSurfaceRate,
        surfaceRateAmountIn,
        realRateAmountIn,
        realRateThreashold,
        testerAmounts,
      };
      await Core.deleteMany({});

      let core = new Core(coreObject);
      await core.save();

      res.json(core);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/minimum-surface-rate/",
  [
    [
      check("minimumSurfaceRate", "minimumSurfaceRate is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { minimumSurfaceRate } = req.body;

    try {
      await Core.updateOne({}, { $set: { minimumSurfaceRate } });

      res
        .status(200)
        .send(
          `Minimum surface rate successfully set to ${minimumSurfaceRate}%.`
        );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/surface-rate-amountin/",
  [
    [
      check("surfaceRateAmountIn", "surfaceRateAmountIn is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { surfaceRateAmountIn } = req.body;

    try {
      await Core.updateOne({}, { $set: { surfaceRateAmountIn } });

      res
        .status(200)
        .send(
          `Surface rate amount in successfully set to ${surfaceRateAmountIn}.`
        );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/real-rate-amountin/",
  [[check("realRateAmountIn", "realRateAmountIn is required").not().isEmpty()]],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { realRateAmountIn } = req.body;

    try {
      await Core.updateOne({}, { $set: { realRateAmountIn } });

      res
        .status(200)
        .send(`Real rate amount in successfully set to ${realRateAmountIn}.`);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/real-rate-threashold/",
  [
    [
      check("realRateThreashold", "realRateThreashold is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { realRateThreashold } = req.body;

    try {
      await Core.updateOne({}, { $set: { realRateThreashold } });

      res
        .status(200)
        .send(
          `Real rate threashold successfully set to ${realRateThreashold}%.`
        );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/add-tester-inputamount/",
  [
    [
      check("testerInputAmount", "testerInputAmount is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check inputs validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { testerInputAmount } = req.body;

    try {
      let core = await Core.findOne({});

      if (
        core.testerAmounts.filter((r) => r.input === testerInputAmount).length >
        0
      ) {
        return res.status(400).json({
          errors: [{ message: "TesterInputAmount already exists" }],
        });
      }

      let testerAmountsObject = {};
      testerAmountsObject.input = testerInputAmount;
      core.testerAmounts.unshift(testerAmountsObject);

      await core.save();

      res.json(core);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.delete(
  "/drop-tester-inputamount/:testerInputAmount",
  async (req, res) => {
    try {
      let core = await Core.findOne({});

      const removeIndex = core.testerAmounts
        .map((r) => r.input.toString())
        .indexOf(req.params.testerInputAmount.toString());
      if (removeIndex === -1) {
        return res.status(400).json({
          errors: [{ message: "TesterInputAmount not found" }],
        });
      }
      core.testerAmounts.splice(removeIndex, 1);

      await core.save();

      res.json(core);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    let core = await Core.findOne({});
    res.json(core);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
