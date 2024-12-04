const express = require("express");
const app = express();

const DonorController = require("./controller/DonorController");
const DonationController = require("./controller/DonationController");
const BloodBagController = require("./controller/BloodBagController");
const BloodUsageController = require("./controller/BloodusageController");

app.use(express.urlencoded({ extended: true }));
app.use("/donors", DonorController);
app.use("/donations", DonationController);
app.use("/bloodbags", BloodBagController);
app.use("/bloodusage", BloodUsageController);
app.listen(process.env.PORT, () => {
  console.log(
    "Project url: https://" + process.env.PORT + ".sock.hicounselor.com"
  );
});
