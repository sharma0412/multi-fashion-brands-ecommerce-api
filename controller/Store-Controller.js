let helper = require("../helper/helper");
const sequelize = require('sequelize');
const db = require('../models');
const op = sequelize.Op;

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

//all db
const StoresBrands = db.store_brand
const StoreItemsImages = db.store_items_images
const StoreItem = db.store_items
const Storecategory = db.store_category
const ViewProduct = db.view_product
const order = db.order
const Store = db.stores
const StoreCategorySections = db.store_category_sections
const Product = db.product
const productMetaValue = db.product_meta_value
const productMetaImages = db.product_meta_images
const product_meta_color = db.product_meta
const cart = db.cart
const viewProduct = db.view_product


ViewProduct.belongsTo(Product, { 'foreignKey': 'product_id', 'targetKey': 'id', 'as': 'productdata' });
Product.hasOne(productMetaValue, { 'foreignKey': 'product_id', 'targetKey': 'id', 'as': 'product_value' });
Product.hasOne(product_meta_color, { 'foreignKey': 'product_id', 'targetKey': 'id', 'as': 'product_color' });


//product detail api relations
Product.hasOne(productMetaValue, { 'foreignKey': 'product_id', 'targetKey': 'id', 'as': 'selected_size_values' });
Product.hasMany(productMetaValue, { 'foreignKey': 'product_id', 'as': 'product_all_size_value' });
Product.hasMany(productMetaImages, { 'foreignKey': 'product_id', 'as': 'product_all_images' });
Product.hasMany(product_meta_color, { 'foreignKey': 'product_id', 'as': 'product_all_color' });
product_meta_color.hasMany(productMetaValue, { 'foreignKey': 'product_meta_id', 'as': 'product_size_value' });

//Add realtion for search product all items 
productMetaImages.hasOne(productMetaValue, { 'foreignKey': 'product_meta_id', 'sourceKey': 'product_meta', 'as': 'product_value' });
productMetaImages.hasOne(product_meta_color, { 'foreignKey': 'id', 'sourceKey': 'product_meta', 'as': 'product_color' });




module.exports = {
    brands: async(req, res) => {
        try {
            const required = {
                latitute: req.headers.latitute,
                longitute: req.headers.longitute
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);

            const brands = await db.sequelize.query(`select stores.id as store_id, store_brand.*, ( 3959 * acos( cos( radians('${requestdata.latitute}') ) * cos( radians(stores.latitude) ) * cos( radians(stores.longitude) - radians('${requestdata.longitute}') ) + sin( radians('${requestdata.latitute}') ) * sin( radians(stores.latitude) ) ) ) AS distance from stores join store_brand on store_brand.id = stores.brand_id where stores.status = 1 having distance < 50 order by distance DESC`, {
                type: db.sequelize.QueryTypes.SELECT
            });
            let uniqueObjArray = [
                ...new Map(brands.map((item) => [item["id"], item])).values(),
            ];
            return helper.success(res, "Brands listing", uniqueObjArray);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    storeCategoryList: async(req, res) => {
        console.log("***********  😍 😍 😍 😍  storeCategoryList.. 😍 😍 😍 😍 ************");
        try {
            const required = {
                storeID: req.params.id,
                userId: req.user.id,
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);
            let category = await Storecategory.findAll({
                where: {
                    store_id: requestdata.storeID,
                    status: 1
                }
            });     
            return helper.success(res, "all brands are here", category);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    storeProduct_byCategory: async(req, res) => {
        console.log("********  😍 😍 😍 😍 storeProduct_byCategory 😍 😍 😍 😍 **********");
        try {
            const required = {
                storeID: req.body.storeID,
                gender_cat_id: req.body.gender_cat_id,
                userId: req.user.id,
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);
            let newArrivals = await Product.findAll({
                limit : 5,
                attributes:[ ['id', 'product_id'], 
                    [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = product.id limit 1 ) ,''))`), 'product_image']
                ],
                where: {
                    store_id: requestdata.storeID,
                    category_id : req.body.gender_cat_id,
                    status: 1 //active
                },
                order : [ ['id', 'DESC'] ]
            });
            const sendNewArrivals = newArrivals.length == 5 ? newArrivals : []
            let subCategory = [];
            //subCategory.push({"name": "Recommended Products", "values": []})
            subCategory.push({"id" : "-1", "name": "New Arrivals", "values": sendNewArrivals});

            let newSections = await StoreCategorySections.findAll({
                where: {
                    store_id: requestdata.storeID,
                    category_id : req.body.gender_cat_id,
                    status: 1 //active
                }
            });
            for(var i = 0; i < newSections.length; i++) {
               const productIds = newSections[i].value.split(',');
               console.log("+++++++++",productIds)
               let getProduct = await Product.findAll({
                    limit : 5,
                    attributes:[ ['id', 'product_id'],
                        [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = product.id limit 1 ) ,''))`), 'product_image']
                    ],
                    where: {
                        id : {[op.in] : productIds} 
                    },raw : true
                }); 
                const dataGetProduct = getProduct.length == 5 ? getProduct : []
                subCategory.push({"id" : newSections[i].id, "name": newSections[i].title, "values": dataGetProduct })
            } 
            return helper.success(res, "all brands are here", subCategory);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    seeAllProduct_byCategory: async(req, res) => {
        console.log("********  😍 😍 😍 😍 seeAllProduct_byCategory..!! 😍 😍 😍 😍 **********");
        try {
            const required = {
                storeID: req.body.storeID,
                gender_cat_id: req.body.gender_cat_id,
                id: req.body.id,  //"-1" or other ids
                offset: req.body.offset,
                limit: req.body.limit
            }; 
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);

            switch(req.body.id) {
                case "-1":
                    console.log(" 😆 😆 😆 😆 NEW ARRIVELS..!!  😆 😆 😆 😆  ");
                    let newArrivals = await Product.findAll({
                        limit : parseInt(req.body.limit) , offset: parseInt(req.body.offset),
                        attributes:[ ['id', 'product_id'], 'name', 'store_id', 'brand_id', 'category_id',
                            [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = product.id  limit 1 ) ,''))`), 'product_image'],
                            [sequelize.literal(`(IFNULL(( select quantity from cart where user_id = ${req.user.id} and product_id = product.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'quantity'],
                            [sequelize.literal(`(IFNULL(( select id from cart where user_id = ${req.user.id} and product_id = product.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'cart_id']
                        ],
                        where: {
                            store_id: requestdata.storeID,
                            category_id : req.body.gender_cat_id,
                            where : sequelize.literal(" product.status = 1 group by product.id")
                        },
                        include : [
                            {
                                model : productMetaValue,
                                'as' : 'product_value',
                                where : {status:1}
                            },
                            {
                                model : product_meta_color,
                                'as' : 'product_color'
                            }
                        ]
                        
                    }); 
                    return helper.success(res, "fetch all products list..!!", newArrivals);
                break;
                default:
                    let store_category_sections_productIds = await StoreCategorySections.findOne({
                        where: {id : req.body.id}
                    }); 
                    let Productids_inrray= store_category_sections_productIds.value.split(',');
                    let getProduct_ids = store_category_sections_productIds ? Productids_inrray : []
                    let getProduct = await Product.findAll({
                        limit : parseInt(req.body.limit) , offset: parseInt(req.body.offset),
                        attributes:[ ['id', 'product_id'], 'name', 'store_id', 'brand_id', 'category_id',
                        [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = product.id  limit 1 ) ,''))`), 'product_image'],
                        [sequelize.literal(`(IFNULL(( select quantity from cart where user_id = ${req.user.id} and product_id = product.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'quantity'],
                        [sequelize.literal(`(IFNULL(( select id from cart where user_id = ${req.user.id} and product_id = product.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'cart_id']
                        ],
                        where: {
                            id : {[op.in] : getProduct_ids},
                            where : sequelize.literal(" product.status = 1 group by product.id")
                            //status: 1 //active
                        },
                        include : [
                            {
                                model : productMetaValue,
                                'as' : 'product_value',
                                where : {status:1}
                            },
                            {
                                model : product_meta_color,
                                'as' : 'product_color'
                            }
                        ]
                    });
                    return helper.success(res, "fetch all products list.. yess!!", getProduct);
            }        
        } catch (err) {
            return helper.error(res, err);
        }
    },

    sizeList_ofProduct: async(req, res) => {
        console.log("********  😍 😍 😍 😍 sizeList_ofProduct 😍 😍 😍 😍 **********");
        try {
            const required = {
                product_id: req.body.product_id,
                product_meta_id: req.body.product_meta_id
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);

            let getProductSize = await productMetaValue.findAll({
                where :{
                    product_id: req.body.product_id,
                    product_meta_id: req.body.product_meta_id 
                }
            });
            return helper.success(res, "product size list..!!", getProductSize);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    productDetail: async(req, res) => {
        console.log("********  😍 😍 😍 😍 productDetail 😍 😍 😍 😍 **********");
        try {
            const required = {
                product_id: req.body.product_id,
                product_meta_id: req.body.product_meta_id,
                size: req.body.size,
                color: req.body.color,
                store_id: req.body.store_id,
                category_id: req.body.category_id
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);
            console.log(req.body);
            let product = await Product.findOne({
                attributes:[ ['id', 'product_id'], 'name', 'description','store_id', 'brand_id', 'category_id',
                    [sequelize.literal(`(IFNULL(( select quantity from cart where user_id = ${req.user.id} and product_id = product.id and product_size = '${req.body.size}' and product_color =  '${req.body.color}'  and product_meta =  ${req.body.product_meta_id}  limit 1 ) ,'0'))`), 'quantity'],
                    [sequelize.literal(`(IFNULL(( select id from cart where user_id = ${req.user.id} and product_id = product.id and product_size = '${req.body.size}' and product_color =  '${req.body.color}'  and product_meta =  ${req.body.product_meta_id}  limit 1 ) ,'0'))`), 'cart_id']
                ], 
                where: {id: requestdata.product_id}, 
                include : [
                    {
                        model : productMetaImages,
                        'as' : 'product_all_images',
                        where : {product_meta : req.body.product_meta_id}
                    },

                    {
                        model : productMetaValue,
                        'as' : 'selected_size_values',
                        attributes:[ 'size', 'price', 'stock','product_meta_id'],
                        where : {status:1, product_meta_id : req.body.product_meta_id,size: req.body.size}
                    },

                    {
                        model : productMetaValue,
                        'as' : 'product_all_size_value',
                        attributes:[ 'size', 'product_meta_id'],
                        where : {status:1, product_meta_id : req.body.product_meta_id}
                    },
                    {
                        model : product_meta_color,
                        'as' : 'product_all_color',
                        include : [
                            {
                                model : productMetaValue,
                                'as' : 'product_size_value',
                                attributes:[ 'size', 'product_meta_id'],
                                where : {status:1}
                            }
                        ]
                    }
                ]
            }); 

            //add item in view table
            req.body.user_id = req.user.id;
            req.body.product_meta = req.body.product_meta_id;
            let whereStattement = {
                user_id : req.user.id,
                product_meta: req.body.product_meta_id,
                store_id: req.body.store_id,
                category_id: req.body.category_id
            }
            let findItemInViewProduct = await viewProduct.findOne({where : whereStattement});
            if(findItemInViewProduct){
                let findItemInViewProduct = await viewProduct.destroy({where : whereStattement});
                let itemViewed = await viewProduct.create(req.body)
            } else {
                let itemViewed = await viewProduct.create(req.body)
            }
            return helper.success(res, "product detail..!!", product);
        } catch (err) {
            return helper.error(res, err);
        }
    }, 

    addProductInCart: async(req, res) => {
        console.log("********  😍 😍 😍 😍 addProductInCart..!! 😍 😍 😍 😍 **********");
        try {
            const required = {
                product_id: req.body.product_id,
                product_meta: req.body.product_meta,
                product_size: req.body.product_size,
                product_color: req.body.product_color,
                store_id: req.body.store_id,
                brand_id: req.body.brand_id
            }
            const nonrequired = {}
            const requestData = await helper.vaildObject(required, nonrequired);
            console.log(req.body);
            let addItem_inToCart_function = async () => {
                console.log("============ CALLL FUNCTIONNN....!! ==========");
                var addProduct = await cart.findOrCreate({
                    user_id: req.user.id,
                    product_id: req.body.product_id,
                    product_meta: req.body.product_meta,
                    product_size: req.body.product_size,
                    product_color: req.body.product_color,
                    where: {
                        user_id: req.user.id,
                        store_id: req.body.store_id,
                        brand_id: req.body.brand_id,
                        product_id: req.body.product_id,
                        product_meta: req.body.product_meta,
                        product_size: req.body.product_size,
                        product_color: req.body.product_color,
                        quantity: 1
                    }
                });
                return addProduct;
            }
            let checkUserCart = await cart.findOne({
                where : {user_id: req.user.id}
            });
            if(checkUserCart) {
                if(checkUserCart.store_id == req.body.store_id && checkUserCart.brand_id == req.body.brand_id) {
                    var lastInsertData = await addItem_inToCart_function();
                } else {
                    return helper.error(res, 'Your cart contains items from other store. Do ypu want to discard the selection and add item of this store?');
                }
            } else {
                var lastInsertData = await addItem_inToCart_function();
            }     
            let finalData = {
                cart_id : lastInsertData[0].id,
                quantity : lastInsertData[0].quantity
            }
            return helper.success(res, 'Product Add In Cart Successfully', finalData);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    product_quantityUpdate: async(req, res) => {
        console.log("********  😍 😍 😍 😍 product_quantityUpdate 😍 😍 😍 😍 **********");
        try {
            const required = {
                cart_id: req.body.cart_id, 
                quantity : req.body.quantity //quantity => "add" or "remove"
            }
            const nonrequired = {}
            const requestData = await helper.vaildObject(required, nonrequired);
            console.log(req.body);
            var check_previous_quantity = await cart.findOne({
                where: {id: req.body.cart_id}
            });
            let updateQyantity = check_previous_quantity.quantity;
            if(updateQyantity == 1 && req.body.quantity == 'remove') {
                var addProduct = await cart.destroy({
                    where: {id: req.body.cart_id}
                });
                return helper.success(res, "remove");
            }
            let msg;
            if(req.body.quantity == "add") {
                updateQyantity  += 1;
                msg = "added";
            } else {
                updateQyantity  -= 1;
                msg = "remove";
            }
            var addProduct = await cart.update({
                quantity: updateQyantity },{
                where: {id: req.body.cart_id}
            });
            let finalData = {quantity : updateQyantity}
            return helper.success(res, msg, finalData);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    myProductCartList: async(req, res) => {
        console.log("********  😍 😍 😍 😍 myProductCartList.!! 😍 😍 😍 😍 **********");
        try {
            let mycartlist = await cart.findAll({
                attributes : {
                    include : [
                        [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = cart.product_id and product_meta_images.product_meta = cart.product_meta limit 1 ) ,''))`), 'product_image'],
                        [sequelize.literal(`(IFNULL(( select price from product_meta_value where product_meta_value.product_id = cart.product_id and product_meta_value.product_meta_id = cart.product_meta and product_meta_value.size = cart.product_size limit 1 ) , '0'))`), 'product_price'],
                        [sequelize.literal(`(IFNULL(( select name from product where product.id = cart.product_id limit 1 ) ,''))`), 'name'],
                        [sequelize.literal(`(IFNULL(( select category_id from product where product.id = cart.product_id limit 1 ) ,''))`), 'category_id'],
                        [sequelize.literal(`(IFNULL((  select product_meta.color_code from product_meta where product_meta.id = cart.product_meta limit 1 ) ,''))`), 'color_code']
                    ]
                },
                where: { user_id: req.user.id }
            });
            let storeChargeDetail = 0;
            var itemAmount = 0;
            var totalPayment = 0;
            if(mycartlist.length != 0){
                mycartlist.forEach(element => {
                    itemAmount +=  parseInt(element.dataValues.product_price) * element.dataValues.quantity;
                });

                storeChargeDetail = await Store.findOne({
                    where : {
                        id : mycartlist[0].dataValues.store_id,
                        brand_id :  mycartlist[0].dataValues.brand_id
                    }
                });
                if(storeChargeDetail) {
                    totalPayment = itemAmount +  parseInt(storeChargeDetail.surcharge) + parseInt(storeChargeDetail.service_fee) + parseInt(storeChargeDetail.packaging_fee);
                    var priceDetail = {
                        surcharge : storeChargeDetail.surcharge,
                        service_fee : storeChargeDetail.service_fee,
                        packaging_fee : storeChargeDetail.packaging_fee,
                        itemAmount,
                        totalPayment
                    }
                } else {
                    return helper.error(res, 'Something went wrong..!! storeID or BrandId');
                }
            } 
            var data = {
                "cartproduct": mycartlist ? mycartlist : [],
                "priceDetail" : storeChargeDetail ? priceDetail : {} 
            }
            return helper.success(res, 'Product Cart List', data);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    deleteAllProduct_fromCart: async(req, res) => {
        console.log("********  😍 😍 😍 😍 deleteAllProduct_fromCart 😍 😍 😍 😍 **********");
        try {
            let destroyCart = await cart.destroy({
                where :{user_id: req.user.id}
            });
            return helper.success(res, "cart empty");
        } catch (err) {
            return helper.error(res, err);
        }
    },

    removeProduct_fromCart: async(req, res) => {
        console.log("********  😍 😍 😍 😍 removeProduct_fromCart 😍 😍 😍 😍 **********");
        try {
            const required = {
                cart_id: req.params.cartId
            }
            const nonrequired = {}
            const requestData = await helper.vaildObject(required, nonrequired);
            let destroyCart = await cart.destroy({
                where :{id: requestData.cart_id}
            });
            return helper.success(res, "Item remove");
        } catch (err) {
            return helper.error(res, err);
        }
    },

    searchTab_productList: async(req, res) => {
        console.log("********  😍 😍 😍 😍 searchTab_productList 😍 😍 😍 😍 **********");
        try {
            const required = {
                latitute: req.query.latitute,
                longitute: req.query.longitute
            };
            const nonrequired = {};
            let requestdata = await helper.vaildObject(required, nonrequired);
            console.log(req.body);
            let Popular_searches;
            let allStoresId = [];

            const brands = await db.sequelize.query(`select stores.id as store_id, store_brand.*, ( 3959 * acos( cos( radians('${requestdata.latitute}') ) * cos( radians(stores.latitude) ) * cos( radians(stores.longitude) - radians('${requestdata.longitute}') ) + sin( radians('${requestdata.latitute}') ) * sin( radians(stores.latitude) ) ) ) AS distance from stores join store_brand on store_brand.id = stores.brand_id where stores.status = 1 having distance < 50 order by distance DESC`, {
                type: db.sequelize.QueryTypes.SELECT
            });
            let uniqueObjArray = [
                ...new Map(brands.map((item) => [item["id"], item])).values(),
            ];
            
            uniqueObjArray.forEach( (element) => {
                allStoresId.push(element.store_id);
            });
            let allTypeProduct = await Product.findAll({
                limit : 10,
                attributes:[ ['id', 'product_id'], 'store_id', 'brand_id', 'category_id',
                    [sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_id = product.id limit 1 ) ,''))`), 'product_image']
                ],
                where: {
                    store_id : { [op.in] : allStoresId },
                    status: 1 //active
                },
                order : [ ['id', 'DESC'] ]
            });

            let viewedRandomItem = await viewProduct.findAll({
                limit : 10,
                attributes:{
                    include : [[sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_meta = view_product.product_meta  limit 1 ) ,''))`), 'product_image']] 
                },
                where : {
                    store_id : { [op.in] : allStoresId },
                    user_id : { [op.ne] : req.user.id },
                }, order : [ ['id', 'DESC'] ]
            });

            if(viewedRandomItem.length > 0) {
                Popular_searches = helper.shuffleArray(viewedRandomItem);
            } else {
                Popular_searches = helper.shuffleArray(allTypeProduct);
            }

            let Items_you_viewed = await viewProduct.findAll({
                limit : 10,
                attributes:{
                    include : [[sequelize.literal(`(IFNULL(( select image_url from product_meta_images where product_meta_images.product_meta = view_product.product_meta  limit 1 ) ,''))`), 'product_image']] 
                },
                where : {
                    store_id : { [op.in] : allStoresId },
                    user_id : req.user.id
                }, order : [ ['id', 'DESC'] ]
            });

            let data = {
                "Recommended_products":[],
                Popular_searches,
                Items_you_viewed
            }

            return helper.success(res, "Product list", data);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    searchProducts: async(req, res) => {
        console.log("********  😍 😍 😍 😍 searchProducts..!! 😍 😍 😍 😍 **********");
        try {
            const required = {
                searchTitle: req.query.searchTitle,
                latitute: req.query.latitute,
                longitute: req.query.longitute
            }
            const nonrequired = {}
            const requestdata = await helper.vaildObject(required, nonrequired);
            console.log(req.query);
            //fetch all stores near by location
            const brands = await db.sequelize.query(`select stores.id as store_id, stores.address , store_brand.*, ( 3959 * acos( cos( radians('${requestdata.latitute}') ) * cos( radians(stores.latitude) ) * cos( radians(stores.longitude) - radians('${requestdata.longitute}') ) + sin( radians('${requestdata.latitute}') ) * sin( radians(stores.latitude) ) ) ) AS distance from stores join store_brand on store_brand.id = stores.brand_id where stores.status = 1 having distance < 50 order by distance DESC`, {
                type: db.sequelize.QueryTypes.SELECT
            });
            let uniqueObjArray = [
                ...new Map(brands.map((item) => [item["id"], item])).values(),
            ];   
            let allStoresId = []
            uniqueObjArray.forEach( (element) => {
                allStoresId.push(`'${element.store_id}'`)
            });

            var search_variables = req.query.searchTitle.split(/[ ,]+/).join(',');
            var searchProductArray = search_variables.split(',');
            let search = ""
            searchProductArray.forEach( (element, index) => {
                if((index+1)==searchProductArray.length) {
                    search +=  ` name LIKE '%${element}%' `
                } else {
                    search +=  ` name LIKE '%${element}%' OR `
                }            
            });
        
            //get all available color products first
            let searchProductList = await productMetaImages.findAll({
                limit : parseInt(req.query.limit) , offset: parseInt(req.query.offset),
                attributes:['id', 'product_id', 'product_meta', ['image_url', 'product_image'], 'status',
                   [sequelize.literal(`(IFNULL((  select store_id from product where product.id = product_meta_images.product_id  and status=1  limit 1 ) ,''))`), 'store_id'],
                   [sequelize.literal(`(IFNULL((  select brand_id from product where product.id = product_meta_images.product_id  and status=1  limit 1 ) ,''))`), 'brand_id'],
                   [sequelize.literal(`(IFNULL((  select category_id from product where product.id = product_meta_images.product_id  and status=1  limit 1 ) ,''))`), 'category_id'],
                   [sequelize.literal(`(IFNULL((  select name from product where product.id = product_meta_images.product_id  and status=1  limit 1 ) ,''))`), 'name'],
                   [sequelize.literal(`(IFNULL(( select quantity from cart where user_id = ${req.user.id} and product_id = product_meta_images.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'quantity'],
                   [sequelize.literal(`(IFNULL(( select id from cart where user_id = ${req.user.id} and product_id = product_meta_images.id and product_size = product_value.size and product_color = product_color.color_name and product_meta = product_color.id limit 1 ) ,'0'))`), 'cart_id']
                ],
                where : {status:'1'},
                group : ['product_meta'],
                having : sequelize.literal(` store_id IN (${allStoresId}) AND ${search} `),
                include : [
                    {
                        model : productMetaValue,
                        'as' : 'product_value',
                        where : {status:1}
                    },
                    {
                        model : product_meta_color,
                        'as' : 'product_color'
                    }
                ]
            });
            let shuffleData = await helper.shuffleArray(searchProductList); 
            return helper.success(res, "Product list", shuffleData);
        } catch (err) {
            return helper.error(res, err);
        }
    },

    addUserCard: async(req, res) => {
        console.log("***********  😍 😍 😍 😍  addUserCard..!! 😍 😍 😍 😍 ************");
        try {
            const token = await stripe.tokens.create({
                card: {
                  number: '4242424242424242',
                  exp_month: 4,
                  exp_year: 2023,
                  cvc: '314',
                },
            });
            return helper.success(res, "Card add successfully");
        } catch (err) {
            return helper.error(res, err);
        }
    },


}