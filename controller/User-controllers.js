let helper = require("../helper/helper");
const sequelize = require('sequelize');
const db = require('../models');

const userAddress = db.user_address


module.exports = {
    addAddress: async(req,res) =>{
        console.log("********** 😄 😄 addAddress 😄 😄 ***********");
        try{
            var required = {
                address1 : req.body.address1,
                address2 : req.body.address2,
                state : req.body.state,
                city : req.body.city,
                zipcode : req.body.zipcode,
                country_code : req.body.country_code,
                contact_no : req.body.contact_no
            }
            var nonRequired ={}
            let requestdata = await helper.vaildObject(required, nonRequired);
            req.body.user_id = req.user.id;
            var Address = await userAddress.create(req.body)     
            return helper.success(res, "Address add successfully..!!", );     
        }catch(err){
            return helper.error(res, err);
        }
    },

    addressListing: async(req,res)=>{
        console.log("********** 😄 😄 addressListing 😄 😄 ***********");
        try{                            
            var listing = await userAddress.findAll({
                where: {user_id: req.user.id}
            })
            return helper.success(res, "Address fetch successfully..!!", listing);     
        }catch(err){
            return helper.error(res, err);
        }
    },

    editAddressdetails: async(req,res) =>{         
        console.log("********** 😄 😄 editAddressdetails 😄 😄 ***********");
        try{     
            var required = { address_id: req.body.address_id }                                       
            var nonRequired = {}                                                                           
            let requestdata = await helper.vaildObject(required,nonRequired);
            var editAddress = await userAddress.update(req.body,{                                                                
                where : {  id : requestdata.address_id }               
            });
            return helper.success(res, "address edit successfully..!!")
        }catch(err){
            return helper.error(res,err); 
        }
    },

    deleteAddress: async(req,res) =>{
        console.log("********** 😄 😄 deleteAddress 😄 😄 ***********");
        try{         
            var required = { address_id : req.body.address_id }
            var nonRequired = {}         
            let requestdata = await helper.vaildObject(required,nonRequired); 
            var deleteDetail =  userAddress.destroy(    
                {where : { id : requestdata.address_id}
            })
            return helper.success(res, "address delete successfully..!!")
        }catch(err){
         return helper.error(res,err);
        }
    }

}