const express = require("express");
const router = express.Router();
const DonationService = require("../service/DonationService");

router.post("/add", async (req, res) => {
  let result = await DonationService.addDonation();
  res.send(result);
});
router.get("/all", async (req, res) => {
  let result = await DonationService.getAllDonations();
  res.send(result);
});
router.get("/history/:donorId", async (req, res) => {
  let result = await DonationService.getDonationHistory();
  res.send(result);
});
module.exports = router;