const express = require("express");
const router = express.Router();
const DonorService = require("../service/DonorService");

router.post("/", async (req, res) => {
  let result = await DonorService.addDonor();
  res.send(result);
});
router.get("/", async (req, res) => {
  let result = await DonorService.getAllDonors();
  res.send(result);
});
router.get("/:donorId", async (req, res) => {
  let result = await DonorService.getDonorById();
  res.send(result);
});
module.exports = router;
