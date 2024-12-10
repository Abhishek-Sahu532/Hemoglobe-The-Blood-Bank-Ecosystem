const express = require("express");
const router = express.Router();
const BloodBagService = require("../service/BloodBagService");


router.get("/all", async (req, res) => {
  try {
    let result = await BloodBagService.getAllBloodBags();
    return res.status(result?.success ? 200 : 400).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});


module.exports = router;