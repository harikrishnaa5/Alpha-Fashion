const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const middleware = require('../middlewares/user-middleware')

/* USER*/

router.get('/test',userController.test)

router.get('/',middleware.activeCheck, userController.home);

router.get('/product/:id',middleware.activeCheck,  userController.product)

router.get('/product-details/:id',middleware.activeCheck,  userController.viewSingleProduct)

router
    .route('/login')
    .get(userController.signinPage)
    .post(userController.loginCheck)

router
    .route('/signup')
    .get(userController.signupPage)
    .post(userController.signedUp)

router.get('/logout',userController.logout) 

router.post('/otp',userController.otpCheck)

router.get('/resend-otp', userController.resendOtp)

router.get('/wishlist',middleware.loginCheck, middleware.activeCheck, userController.wishlist)

router.post('/add-to-wishlist/:id', middleware.loginCheck, middleware.activeCheck,  userController.addToWishlist)
    
router.delete('/remove-from-wishlist/:id', userController.removeFromWishlist)

router.get('/shopping-cart',middleware.loginCheck, middleware.activeCheck,  userController.shoppingcart)

router.post('/add-to-cart/:id',middleware.loginCheck, middleware.activeCheck,  userController.addToCart)

router.delete('/delete-from-cart/:id', middleware.loginCheck, middleware.activeCheck,  userController.removeFromCart)

router
    .route('/cart-count')
    .get(middleware.loginCheck,userController.cartCount)
    .put(middleware.loginCheck,userController.updateCart)
    
router.get('/profile', middleware.loginCheck, middleware.activeCheck,  userController.profile)

router.put('/edit-profile', middleware.loginCheck, middleware.activeCheck,  userController.editProfile)

router.get('/address', middleware.loginCheck, middleware.activeCheck,  userController.getAllAddress)

router.post('/add-address', middleware.loginCheck, middleware.activeCheck,  userController.addAddress)

router.delete('/delete-address/:id', middleware.loginCheck, middleware.activeCheck,  userController.deleteAddress)

router.post('/apply-coupon/:id', middleware.loginCheck, middleware.activeCheck,  userController.applyCoupon)

router.get('/checkout', middleware.loginCheck, middleware.activeCheck,  userController.checkout)

router.post('/place-order',middleware.loginCheck, middleware.activeCheck,  userController.placeOrder)

router.post('/verify-payment', middleware.loginCheck, middleware.activeCheck,  userController.verifyPayment)

router.get('/payment-failed', middleware.loginCheck, middleware.activeCheck,  userController.paymentFail)
 
router.get('/order-success', middleware.loginCheck, middleware.activeCheck, userController.orderSuccess)

router.get('/order-details/:id',middleware.loginCheck,  middleware.activeCheck, userController.orderDetails)

router.delete('/cancel-order/:id', middleware.loginCheck, middleware.activeCheck,  userController.cancelOrder)
   
router.get('/my-orders', middleware.loginCheck, middleware.activeCheck,  userController.myorders)




module.exports = router;

