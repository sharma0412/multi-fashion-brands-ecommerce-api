var express = require('express');
var router = express.Router();
const StoreController = require('../controller/Store-Controller');
const requireAuthentication = require("../passport").authenticateUser;

router.get('/brands', requireAuthentication, StoreController.brands);
router.get('/storeCategoryList/:id', requireAuthentication, StoreController.storeCategoryList);
router.post('/storeProduct_byCategory', requireAuthentication, StoreController.storeProduct_byCategory);
router.post('/seeAllProduct_byCategory', requireAuthentication, StoreController.seeAllProduct_byCategory);
router.post('/sizeList_ofProduct', requireAuthentication, StoreController.sizeList_ofProduct);
router.post('/productDetail', requireAuthentication, StoreController.productDetail);
router.post('/addProductInCart', requireAuthentication, StoreController.addProductInCart);
router.post('/product_quantityUpdate', requireAuthentication, StoreController.product_quantityUpdate);
router.get('/myProductCartList', requireAuthentication, StoreController.myProductCartList);
router.get('/deleteAllProduct_fromCart', requireAuthentication, StoreController.deleteAllProduct_fromCart);
router.get('/removeProduct_fromCart/:cartId', requireAuthentication, StoreController.removeProduct_fromCart);
router.get('/searchTab_productList', requireAuthentication,  StoreController.searchTab_productList);
router.get('/searchProducts', requireAuthentication, StoreController.searchProducts);
router.post('/addUserCard', StoreController.addUserCard);


module.exports = router;