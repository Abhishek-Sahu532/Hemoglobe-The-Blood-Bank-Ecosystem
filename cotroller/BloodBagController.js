const express = require("express");
const router = express.Router();
const BloodBagService = require("../service/BloodBagService");


router.get("/all", async (req, res) => {
  let result = await BloodBagService.getAllBloodBags();
  res.send(result);
});
module.exports = router;