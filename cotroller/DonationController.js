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
  try {
    let result = await DonationService.getAllDonations();
    return res.status(result?.success ? 200 : 400).json(result)
 
  } catch (error) {
    console.log('Err', error)
    return res.status(500).json({
      success : false,
      message : error.message
    })
  }
});

router.get("/history/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params
    let result = await DonationService.getDonationHistory(donorId);
    return res.status(result.success ? 200 : 400).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});
module.exports = router;