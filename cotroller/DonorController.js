const express = require("express");
const router = express.Router();
const DonorService = require("../service/DonorService");

router.post("/", async (req, res) => {
  try {
    const {name, phoneNumber ,address , dateOfBirth, gender , bloodType, medicalHistory } = req.body
   
    let result = await DonorService.addDonor(name, phoneNumber ,address , dateOfBirth, gender , bloodType, medicalHistory);
    
    if (!result.success) {
      return res.status(404).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message
    })
  }
});

router.get("/", async (req, res) => {
  try {
    let result = await DonorService.getAllDonors();
    if (!result.success) {
      return res.status(400).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

});


router.get("/:donorId", async (req, res) => {
  try {
    const {donorId}  = req.params
    let result = await DonorService.getDonorById(donorId);
 if(!result.success){
  return res.status(400).json(result)
 }
 return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : error.message
    })
  }
 
});


module.exports = router;
