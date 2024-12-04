const express = require("express");
const router = express.Router();
const BloodUsageService = require("../service/BloodUsageService");


router.post("/request", async (req, res) => {
  let result = await BloodUsageService.requestBlood();
  res.send(result);
});

module.exports = router;