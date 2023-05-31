let helper = require("../helper/helper");
const sequelize = require('sequelize');
const db = require('../models');
const Op = sequelize.Op;


const driverAreas = db.driver_areas
const zipCode = db.zip_code
const vehicleDetails = db.vehicle_details


module.exports = {
    stateListing: async(req,res)=>{
        console.log("********** 😄 😄 stateListing 😄 😄 ***********");
        try{
            var required = {}
            var nonRequired ={search : req.body.search}
            let requestdata = await helper.vaildObject(required, nonRequired);
            if(req.body.search) {
                var listing = await zipCode.findAll({
                    attributes : ['state'],
                    where : {state : {[Op.like] : `${req.body.search}%`}},
                    group : ['state']
                });
            } else {
                var listing = await zipCode.findAll(
                    { attributes : ['state'], group : ['state'] }
                );
            }
            return helper.success(res, "All state list..!!", listing);     
        }catch(err){
            return helper.error(res, err);
        }
    },

    cityListing: async(req,res)=>{
        console.log("********** 😄 😄 cityListing..!! 😄 😄 ***********");
        try{
            var required = {state : req.body.state}
            var nonRequired ={search : req.body.search}
            let requestdata = await helper.vaildObject(required, nonRequired);
            if(req.body.search) {
                var listing = await zipCode.findAll({
                    attributes : ['city'],
                    where : {
                        state : req.body.state,
                        city : {[Op.like] : `${req.body.search}%`}
                    },
                    group : ['city']
                });
            } else {
                var listing = await zipCode.findAll({ 
                    attributes : ['city'],
                    where : {state : req.body.state},    
                    group : ['city'] 
                });
            }
            return helper.success(res, "All city list..!!", listing);     
        }catch(err){
            return helper.error(res, err);
        }
    },

    ZipCodeListing: async(req,res)=>{
        console.log("********** 😄 😄 ZipCodeListing..!! 😄 😄 ***********");
        try{
            var required = {state : req.body.state, city : req.body.city}
            var nonRequired ={search : req.body.search}
            let requestdata = await helper.vaildObject(required, nonRequired);
            if(req.body.search) {
                var listing = await zipCode.findAll({
                    attributes : ['zipcode'],
                    where : {
                        state : req.body.state,
                        city : req.body.city,
                        zipcode : {[Op.like] : `${req.body.search}%`}
                    }
                });
            } else {
                var listing = await zipCode.findAll({ 
                    attributes : ['zipcode'],
                    where : {state : req.body.state, city : req.body.city},    
                    group : ['zipcode'] 
                });
            }
            return helper.success(res, "All zipcode list..!!", listing);     
        }catch(err){
            return helper.error(res, err);
        }
    },

    addDeliveredAreas: async(req,res) =>{
        console.log("********** 😄 😄 addDeliveredAreas 😄 😄 ***********");
        try{
            if(req.body.area.length == 0) {
                return helper.success(res, "Atleast choose one area..!!");
            } else {
                req.body.area.forEach(async (element, index) => {
                    var Address = await driverAreas.create({
                        driver_id : req.user.id,
                        zipcode : element.zipcode,
                        status : "1"
                    })    
                });
                return helper.success(res, "Area added successfully..!!");     
            }
        }catch(err){
            return helper.error(res, err);
        }
    },

    addVehicleDetail: async(req,res)=>{
        console.log("********** 😄 😄 addVehicleDetail..! 😄 😄 ***********");
        try{
            var required = {
                brand : req.body.brand,
                model : req.body.model,
                year : req.body.year,
                number_plate : req.body.number_plate,
                color : req.body.color
            }
            var nonRequired ={}
            let requestdata = await helper.vaildObject(required, nonRequired);
            var addVehicle = await vehicleDetails.update(req.body,
                { where : {
                    driver_id : req.user.id
                }
            })      
            return helper.success(res, "Vehicle added successfully..!!"); 
        }catch(err){
            return helper.error(res, err);
        }
    },

    upload_identificationInfo: async(req,res)=>{
        console.log("********** 😄 😄 upload_identificationInfo...!! 😄 😄 ***********");
        try{
            var required = {
                driving_no : req.body.driving_no, 
                expire_date : req.body.expire_date,
                identification_no : req.body.identification_no,
                identification_type : req.body.identification_type
            }
            var nonRequired ={}
            let requestdata = await helper.vaildObject(required, nonRequired);
            console.log(req.body);
            if(req.files){
                var identification = helper.fileUpload(req.files.identificationFile);
                req.body.identification = "/upload/" + identification;

                var driving_license = helper.fileUpload(req.files.drivingLicenseFile);
                req.body.driving_license = "/upload/" + driving_license;
                req.body.driver_id = req.user.id;
                req.body.status = '1';
                var document = await vehicleDetails.create(req.body)   
                return helper.success(res, "Document uploaded successfully..!!"); 
            } else {
                return helper.success(res, "files are required"); 
            }
        }catch(err){
            return helper.error(res, err);
        }
    },
}