var express = require('express');
var router = express.Router();

const UserController = require('../controller/User-controllers');
const requireAuthentication = require("../passport").authenticateUser;

router.post('/addAddress', requireAuthentication, UserController.addAddress);
router.get('/addressListing', requireAuthentication, UserController.addressListing);
router.post('/editAddressdetails', requireAuthentication, UserController.editAddressdetails);
router.post('/deleteAddress', requireAuthentication, UserController.deleteAddress);

module.exports = router;