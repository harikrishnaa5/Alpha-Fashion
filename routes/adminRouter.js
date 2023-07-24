const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const middleware = require('../middlewares/admin-middleware')
const adminHelper = require('../helpers/adminHelper')


/* ADMIN*/
router.get('/',middleware.adminLogin,adminController.home);
router
    .route('/login')
    .get(adminController.loginPage)
    .post(adminController.login)

router.get('/logout', middleware.adminLogin, adminController.logout)
router.get('/products', middleware.adminLogin,adminController.products)
router.get('/user-list',middleware.adminLogin, adminController.userlist)
router.get('/block/:id',middleware.adminLogin,adminController.blockUser)
router.get('/unblock/:id',middleware.adminLogin,adminController.unblockUser)
router
    .route('/category')
    .get( middleware.adminLogin, adminController.category)
    .post(middleware.adminLogin,adminController.addCategory)
    

router.post('/edit-category/:id',middleware.adminLogin, adminController.editCategory)
router.post('/delete-category',middleware.adminLogin, adminController.deleteCategory) 

router
    .route('/add-products')
    .get(middleware.adminLogin,adminController.addProduct)
    .post(middleware.adminLogin,adminHelper.uploadProductsImgs, adminController.addProductConfirm)

router
    .route('/edit-products/:id')
    .get(middleware.adminLogin,adminController.editProduct)
    .post(middleware.adminLogin, adminHelper.uploadProductsImgs, adminController.updateProduct)


router.get('/delete-product/:id',middleware.adminLogin, adminController.deleteProduct)

router.get('/banner',middleware.adminLogin, adminController.banner)
router
    .route('/add-banner')
    .get(middleware.adminLogin, adminController.addBanner)
    .post(middleware.adminLogin,adminHelper.uploadProductsImgs,adminController.addBannerConfirm)

router.delete('/delete-banner/:id', middleware.adminLogin, adminController.deleteBanner)
   
router
    .route('/coupon')
    .get( middleware.adminLogin,adminController.coupon)
    .post(middleware.adminLogin,adminController.addCoupon)    

router.delete('/delete-coupon/:id',  adminController.deleteCoupon)

router.get('/orders', middleware.adminLogin, adminController.orders)

router.patch('/pack-order/:id', middleware.adminLogin, adminController.packOrder)

router.patch('/ship-order/:id', middleware.adminLogin, adminController.shipOrder)

router.patch('/deliver-order/:id', middleware.adminLogin, adminController.deliverOrder)

router.get('/order-details/:id', middleware.adminLogin, adminController.orderDetails)

router.get('/sales-report', adminController.salesReport)




      

module.exports = router;


