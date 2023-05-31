var express = require('express');
var router = express.Router();

const driverController = require('../controller/driverController');
const requireAuthentication = require("../passport").authenticateUser;

router.post('/stateListing', requireAuthentication, driverController.stateListing);
router.post('/cityListing', requireAuthentication, driverController.cityListing);
router.post('/ZipCodeListing', requireAuthentication, driverController.ZipCodeListing);
router.post('/addDeliveredAreas', requireAuthentication, driverController.addDeliveredAreas);
router.post('/addVehicleDetail', requireAuthentication, driverController.addVehicleDetail);
router.post('/upload_identificationInfo', requireAuthentication, driverController.upload_identificationInfo);
 

module.exports = router;