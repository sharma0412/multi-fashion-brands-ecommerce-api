let helper = require("../helper/helper");
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
var randomstring = require("randomstring");
const db = require('../models');
const jwtToken = process.env.JWT_SECRET;
const fetch = require("node-fetch");

const users = db.users
const verify = db.verification
const driverAreas = db.driver_areas
const vehicleDetails = db.vehicle_details

module.exports = {
    signup: async(req, res) => {
        console.log("************ signup *************");
        try {
            const required = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                account_type: req.body.account_type,
                deviceType: req.body.device_type,
            };
            const nonRequired = {
                deviceToken: req.body.device_token
            };
            let requestdata = await helper.vaildObject(required, nonRequired);

            var user = await users.findOne({
                where: {
                    [Op.or]: [
                        { username: requestdata.username },
                        { email: requestdata.email }
                    ]
                }
            });
            if (!!user) {
                return helper.error(res, "Email is already exist", {});
            } else {
                await bcrypt.genSalt(10, async function(err, salt) {
                    await bcrypt.hash(requestdata.password, salt, async function(err, hash) {
                        if (err) return helper.error(res, "Some error in data encryption.");
                        requestdata.password = hash;
                        let userData = await users.create({
                            account_type: requestdata.account_type,
                            email: requestdata.email,
                            username: requestdata.username,
                            password: hash,
                            device_type: requestdata.deviceType,
                            device_token: requestdata.deviceToken,
                        });

                        const token = jwt.sign({ data: { "id": userData.id, "email": userData.email } }, jwtToken);
                        let body = {};
                        body.token = token;
                        body.account_type = userData.account_type;

                        return helper.success(res, "User registered successfully", body);
                    });
                });
            }
        } catch (err) {
            return helper.error(res, err);
        }
    },
    login: async(req, res) => {
        try {
            const required = {
                username: req.body.username,
                password: req.body.password,
                account_type: req.body.account_type,    //0 - super admin, 1-user , 2-driver, 3 - vendor
                deviceType: req.body.device_type,
            };
            const nonrequired = {
                deviceToken: req.body.device_token
            };
            let requestdata = await helper.vaildObject(required, nonrequired);
            var userData = await users.findOne({
                where: {
                    account_type: requestdata.account_type,
                    [Op.or]: [
                        { username: requestdata.username },
                        { email: requestdata.username }
                    ]
                }
            });
            if (!!userData) {
                await bcrypt.compare(requestdata.password, userData.password, async function(err, compare) {
                    if (err) return helper.error(res, "Some error occur please try again!!");
                    if (compare == true) {
                        const token = jwt.sign({ data: { "id": userData.id, "email": userData.email } }, jwtToken);
                        await users.update({
                            device_type: requestdata.deviceType,
                            device_token: requestdata.deviceToken,
                        }, {
                            where: {
                                id: userData.id,
                            }
                        }); 
                        if(requestdata.account_type == '2') {
                            var checkArea = await driverAreas.findOne({
                                where: {driver_id: userData.id}
                            });
                            var submitDocument = await vehicleDetails.findOne({
                                attributes : ['identification', 'driving_license', 'driving_no','brand'],
                                where: {driver_id: userData.id}
                            });
                            let identification;
                            let driving_no;
                            let brand;
                            if(submitDocument) { 
                                identification = submitDocument.identification ? '1':'0';
                                driving_no = submitDocument.driving_no ? '1':'0';
                                brand = submitDocument.brand ? '1':'0';
                            } else {
                                identification = '0';driving_no= '0';brand= '0';
                            }
                            let body = {
                                token          :  token,
                                account_type   :  userData.account_type,
                                area           :  checkArea ? '1' : '0',   // 0 = not submit, 1 - submit
                                uploadDocument :  identification,
                                documentDetail :  driving_no,
                                vehicleDetail  :  brand,
                                driver_identification_is : userData.driver_identification_is //1-approve, 2-reject
                            };
                            return helper.success(res, "Login successfully", body);
                        }
                        let body = {
                            token          : token,
                            account_type   : userData.account_type,
                        };
                        return helper.success(res, "Login successfully", body);
                    } else {
                        return helper.error(res, "Invalid username or password");
                    }
                });
            } else {
                return helper.error(res, "Invalid username or password", {});
            }
        } catch (err) {
            return helper.error(res, err);
        }
    },
    checkUsername: async(req, res) => {
        try {
            const required = {
                username: req.body.username,
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);

            var userData = await users.findOne({
                where: {
                    username: requestdata.username
                }
            });
            if (!!userData) {
                return helper.error(res, "Username is not available");
            }
            return helper.success(res, "Username available");
        } catch (err) {
            return helper.error(res, err);
        }
    },
    forgotpassword: async(req, res) => {
        try {
            const required = { email: req.body.email, }
            const nonRequired = {}
            let requestdata = await helper.vaildObject(required, nonRequired);
            var findEmail = await users.findOne({
                where: {
                    email: requestdata.email
                }
            })
            if (findEmail) {

                var newotp = await randomstring.generate({
                    length: 4,
                    charset: 'numeric',
                });

                    let url = 'https://api.sendinblue.com/v3/smtp/email';
                    let options = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'api-key': process.env.SEND_IN_BLUE_KEY,
                        },
                        body: JSON.stringify({
                            sender: { name: process.env.APP_NAME, email: process.env.EMAIL_FROM },
                            to: [{ email: req.body.email }],
                            replyTo: { email: process.env.REPLY_EMAIL, name: process.env.REPLY_NAME },
                            htmlContent: '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Got It</a></div><p style="font-size:1.1em">Hi, ' + req.body.email + ' </p><p>Thank you for choosing Get It. Use the following OTP to complete your Account recovery procedure .</p><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">' + newotp + '</h2><p style="font-size:0.9em;">Regards,<br />Got It</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"><p>Your Brand Inc</p><p>1600 Amphitheatre Parkway</p><p>California</p></div></div></div>',
                            subject: 'Forgot Password'
                        })
                    };
                    fetch(url, options)
                        .then(res => res.json())
                        .then(json => console.log(json))
                        .catch(err => console.error('error:' + err));
                await verify.create({
                    email: requestdata.email,
                    otp: newotp,
                    expire: ""
                });
                return helper.success(res, 'OTP sent successfully');
            } else {
                return helper.error(res, 'Invalid email address.')
            }
        } catch (err) {
            return helper.error(res, err);
        }
    },
    confirmOtp: async(req, res) => {
        try {
            var required = { otp: req.body.otp, email: req.body.email }
            const nonRequired = {}
            let requestdata = await helper.vaildObject(required, nonRequired);

            let otp = await verify.findOne({
                where: {
                    email: requestdata.email,
                },
                order : [['id', 'DESC']]
            });
            if (requestdata.otp == otp.otp) {
                verify.destroy({
                    where: {
                        email: requestdata.email
                    }
                });
                return helper.success(res, "OTP matched successfully");
            } else {
                return helper.error(res, "Invalid OTP. Please try again");
            }
        } catch (err) {
            return helper.error(res, err);
        }
    },
    resetPassword: async(req, res) => {
        console.log("****************** resetPassword ****************");
        try {
            var required = {
                newPassword: req.body.newPassword,
                email: req.body.email
            }
            var nonrequired = {}
            var requestedData = await helper.vaildObject(required, nonrequired);

            var salt = 10;
            await bcrypt.hash(req.body.newPassword, salt).then(function(hash) {
                requestedData.newPassword = hash
            })
            users.update({
                password: requestedData.newPassword
            }, {
                where: { email: requestedData.email }
            })
            return helper.success(res, 'Password reset successfully!!')
        } catch (err) {
            return helper.error(res, err)
        }
    },

    changePassword : async(req, res) => {
        console.log("********** 😄 😄 changePassword  😄 😄 ***********");
        try {
            const required = {newPassword: req.body.newPassword, oldPassword: req.body.oldPassword};
            const nonRequired = {};
            let requestData = await helper.vaildObject(required, nonRequired);
            let userdata = await users.findOne({attributes: ['id', 'password'],
                where: {id: req.user.id}
            });
            bcrypt.compare(req.body.oldPassword, userdata.password, async function(err, result) {
                if (err) throw new Error(err);
                if (result == true) {
                    var salt = 10;
                    let abc = await bcrypt.hash(requestData.newPassword, salt, async function(err, hash) {
                        req.body.newPassword = hash
                        var update = await users.update(
                            {password: req.body.newPassword},
                            {where: {id: req.user.id}
                        })
                    })
                    return helper.success(res, 'Password changed successfully')
                } else {
                    return helper.error(res, 'Old password is incorrect')
                }
            })
        } catch (err) {
            helper.error(res, err);
        }
    },

    updateProfile : async(req, res) => {
        console.log("********** 😄 😄 updateProfile 😄 😄 ***********");
        try {
            let userProfile = await users.update(  req.body, {
                where :  { id : req.user.id }
            })
            helper.success(res, "Profile updated successfully..!!")

        } catch (err) {
            helper.error(res, err)
        }
    },

    updateProfile_image : async(req, res) => { 
        console.log("********** 😄 😄 updateProfile_image 😄 😄 ***********");
        try {
            if(req.files){
                var profile = helper.fileUpload(req.files.profile_image);
                    profile = "/upload/" + profile;
                let userProfile = await users.update( { profile_image : profile }, {
                    where :  { id : req.user.id }
                })
            helper.success(res, "Profile picture updated successfully..!!")
            }
        } catch (err) {
            helper.error(res, err)
        }
    },

    getMyDetail : async(req, res) => {
        console.log("********** 😄 😄 getMyDetail 😄 😄 ***********");
        try{
            let userProfile = await users.findOne({
                where :  { id : req.user.id }
            });
            helper.success(res, "Profile fetched successfully..!!", userProfile)
        } catch (err) {
            helper.error(res, err)
        }
    }
}