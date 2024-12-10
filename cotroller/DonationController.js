const express = require("express");
const router = express.Router();
const DonationService = require("../service/DonationService");

router.post("/add", async (req, res) => {
  try {
    const {donorId, qty} = req.body
    let result = await DonationService.addDonation(donorId, qty);
    if (!result.success) {
      return res.status(400).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message
    })
  }

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