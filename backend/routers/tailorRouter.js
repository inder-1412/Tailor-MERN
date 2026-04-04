var express = require('express');
var tailorPersonalDetails = require("../controller/tailorController")

var router = express.Router();


router.post("/personalInfo",tailorPersonalDetails.tailorPersonalDetails);
router.post("/professionalInfo",tailorPersonalDetails.tailorProfessionalDetails);
router.post("/extract-aadhar", tailorPersonalDetails.extractAadharDetails);
router.post("/fetchPersonalInfo", tailorPersonalDetails.fetchPersonalInfo);
router.post("/fetchProfessionalInfo", tailorPersonalDetails.fetchProfessionalInfo);

module.exports = router;