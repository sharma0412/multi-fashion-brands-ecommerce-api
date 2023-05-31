var express = require('express');
var router = express.Router();
const AuthController = require('../controller/Auth-controller');
const requireAuthentication = require("../passport").authenticateUser;

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/check-username', AuthController.checkUsername);
router.post('/forgotpassword', AuthController.forgotpassword);
router.post('/confirmOtp', AuthController.confirmOtp);
router.post('/resetPassword', AuthController.resetPassword);
router.post('/changePassword', requireAuthentication, AuthController.changePassword);
router.post('/updateProfile', requireAuthentication, AuthController.updateProfile);
router.get('/getMyDetail', requireAuthentication, AuthController.getMyDetail);
router.post('/updateProfile_image', requireAuthentication, AuthController.updateProfile_image);

module.exports = router;