const userHelper = require('../helpers/userHelper')
const adminHelper = require('../helpers/adminHelper')
const cartHelper = require('../helpers/cartHelper')
const { products } = require('./adminController')
const productModel = require('../models/productModel')
const { response } = require('express')
const orderHelper = require('../helpers/orderHelper')
const bannerModel = require('../models/bannerModel')
const async = require('hbs/lib/async')

exports.test = (req, res, next) => {
    res.render('user/otp')
}

//========= SIGN-IN PAGE ==========//
exports.signinPage = (req, res, next) => {

    if (req.session.loggedIn) {
        res.redirect('/')
    } else {
        res.render('user/login')
    }

}

//========== LOGIN CHECK ===========//
exports.loginCheck = (req, res, next) => {
    userHelper.signin(req.body).then((response) => {

        if (response.status) {
            req.session.loggedIn = true
            req.session.user = response.user
            res.redirect('/');
        }
      
        else {
            req.session.wrongPassword = true
            res.render('user/login', { wrongPassword: req.session.wrongPassword })
            req.session.wrongPassword = false
        }
    }).catch((err) => {
        next(err)
    })
}

//=========== SIGNUP PAGE =============//
exports.signupPage = (req, res, next) => {
    res.render('user/signup')
}

//============ SIGNED UP ==============//
exports.signedUp = (req, res, next) => {
    userHelper.signedUp(req.body).then((response) => {
        req.session.mobile = response.mobile
        if (response.status) {
            req.session.status = response.status
            res.render('user/signup', { duplicateUser: req.session.status })
        }
        else {
            res.render('user/otp', { mobile: response.mobile })
        }
    }).catch((err) => {
        next(err)
    })
}

//============ OTP VERIFICATION ============//
exports.otpCheck = (req, res, next) => {
    const otp = req.body.otp
    const mobile = req.session.mobile
    userHelper.otpCheck(mobile, otp).then((response) => {
        if (response.status) {
            req.session.loggedIn = true
            req.session.user = response.user
            res.redirect('/');

        } else {
            req.session.wrongOtp = true
            res.render('user/otp', { wrongOtp: req.session.wrongOtp })
            req.session.wrongOtp = false
        }
    })
}

//============ RESEND OTP ============//
exports.resendOtp = (req, res, next) => {
    const otp = req.body.otp
    const mobile = req.session.mobile
    userHelper.otpCheck(mobile, otp).then((response) => {
        if (response.status) {
            req.session.loggedIn = true
            req.session.user = response.user
            res.redirect('/');

        } else {
            req.session.wrongOtp = true
            res.render('user/otp', { wrongOtp: req.session.wrongOtp })
            req.session.wrongOtp = false
        }
    })
}

//=========== USER HOME PAGE ===========//
exports.home = async (req, res, next) => {
    let User = req.session.user
    const banner = await bannerModel.find().lean()
    userHelper.getAllProducts().then(products => {
        adminHelper.getCategory().then(category => {
            if (req.session.user) {
                res.render('user/home', { user: true, login: true, products: products, User, banner, category: category })
            }
            else {
                res.render('user/home', { user: true, products: products, banner, category: category })
            }
        }).catch(err => {
            next(err)
        })

    }).catch(err => {
        next(err)
    })


}

//=========== USER'S ORDER ===========//
exports.myorders = (req, res, next) => {
    let User = req.session.user
    orderHelper.getAllOrders(req.session.user._id).then((orders) => {
        res.render('user/my-orders', { user: true, login: true, User, orders: orders })
    })
}


//=========== PRODUCT PAGE ============//
exports.product = (req, res, next) => {
    let User = req.session.user
    if (req.params.id == 1) {
        adminHelper.getCategory().then(category => {
            userHelper.getProductByCategory(category[0]._id).then(products => {
                if (req.session.user) {
                    res.render('user/product', { user: true, login: true, products: products, User, category: category })
                } else {
                    res.render('user/product', { user: true, products: products, category: category })
                }
            }).catch(err => {
                next(err)
            })
        })
    } else {
        userHelper.getProductByCategory(req.params.id).then(products => {
            adminHelper.getCategory().then(category => {
                if (req.session.user) {
                    res.render('user/product', { user: true, login: true, products: products, User, category: category })
                } else {
                    res.render('user/product', { user: true, products: products, category: category })
                }
            }).catch(err => {
                next(err)
            })


        }).catch(err => {
            next(err)
        })
    }

}

//============= SINGLE PRODUCT PAGE =============//
exports.viewSingleProduct = async (req, res, next) => {
    let User = req.session.user
    const product = await productModel.findById(req.params.id).lean()

    res.render('user/product-details', { product, user: true, login: true, User })
}


//=============== LOGGING OUT ===============//
exports.logout = (req, res, next) => {
    req.session.loggedIn = null
    req.session.user = null
    req.session.mobile = null
    req.session.wrongPassword = null
    req.session.status = null
    req.session.wrongOtp = null
    req.session.coupon = null
    req.session.orderId = null
    res.redirect('/')
}

//=============== WISHLIST =================//
exports.wishlist = (req, res, next) => {
    let User = req.session.user
    userHelper.userWishlist(req.session.user._id).then(wishlistData => {

        res.render('user/wishlist', { user: true, login: true, data: wishlistData.wishlist, User })
    })
}

//============== ADD TO WISHLIST ============//
exports.addToWishlist = (req, res, next) => {

    userHelper.addToWishlist(req.session.user._id, req.params.id).then(data => {
        res.json(data)
    }).catch(err => {
        next(err)
    })

}

//========= REMOVE FROM WISHLIST ==========//
exports.removeFromWishlist = (req, res, next) => {
    //console.log('delete');
    userHelper.removeFromWishlist(req.session.user._id, req.params.id).then(data => {
        res.json(data)
    }).catch(err => {
        next(err)
    })
}

//============== SHOPPING CART ===============//
exports.shoppingcart = (req, res, next) => {
    let User = req.session.user
    cartHelper.userCart(req.session.user._id).then(cartData => {
        res.render('user/shopping-cart', { user: true, login: true, User, cart: cartData.user.cart, total: cartData.cartTotal })
    }).catch((err) => {
        next(err)
    })
}

//========= CART COUNT =========//
exports.cartCount = (req, res, next) => {
    cartHelper.cartCount(req.session.user._id).then(count => {
        res.json(count)
    }).catch(err => {
        next(err)
    })
}

//============== ADD TO CART ===============//
exports.addToCart = (req, res, next) => {
    let User = req.session.user
    cartHelper.addToCart(req.session.user._id, req.params.id).then(count => {
        res.json(count)
    }).catch(err => {
        next(err)
    })
}

//========= UPDATE CART ==========//
exports.updateCart = (req, res, next) => {
    cartHelper.updateCart(req.session.user._id, req.body).then(quantity => {
        res.json(quantity)
    }).catch(err => {
        next(err)
    })
}

//======== REMOVE FROM CART ==========//
exports.removeFromCart = (req, res, next) => {
    //console.log('delete item')
    cartHelper.deleteFromCart(req.session.user._id, req.params.id).then(data => {
        res.json(data)
    }).catch(err => {
        next(err)
    })
}

//========= PROFILE =========//
exports.profile = (req, res, next) => {
    let User = req.session.user
    userHelper.getUserDetails(req.session.user._id).then(details => {

        res.render('user/profile', { user: true, login: true, User, details: details })
    })


}

//============== EDIT PROFILE ===============//
exports.editProfile = (req, res, next) => {
    // let User = req.session.user
    userHelper.editProfile(req.session.user._id, req.body).then(data => {

        req.session.user = data
        res.json(data)
    }).catch(err => {
        next(err)
    })
}

//============= ALL USER ADDRESSES ===============//
exports.getAllAddress = (req, res, next) => {
    let User = req.session.user
    userHelper.getAllAddresses(req.session.user._id).then(addresses => {

        res.render('user/address', { User, user: true, login: true, address: addresses })
    }).catch(err => {
        next(err)
    })
}

//============== ADD USER ADDRESS ==============//
exports.addAddress = (req, res, next) => {

    userHelper.addAddress(req.session.user._id, req.body).then((data) => {

        res.json(data)
    }).catch(err => {
        next(err)
    })
}

//================ DELETE ADDRESS ================//
exports.deleteAddress = (req, res, next) => {
    console.log("delete address controller");
    userHelper.deleteAddress(req.session.user._id, req.params.id).then((data) => {

        res.json(data)
    }).catch(err => {
        next(err)
    })
}

//================ APPLY COUPON ================//  
exports.applyCoupon = async(req, res, next) => {
    let response = {}

    userHelper.getCoupon(req.params.id).then(discount => {
     
        if (discount) {
            cartHelper.userCart(req.session.user._id).then(cartData => {
                response.cartTotal = cartData.cartTotal
                response.discount = discount
                const coupon = {
                    couponDiscount: response.discount,
                    code: req.params.id
                }
                req.session.coupon = coupon
                res.json(response)
            }).catch(err => {
                next(err)
            })
        } else {
            req.session.coupon = false
            res.json(response)
        }
    })
}

//================ CHECKOUT PAGE ================//
exports.checkout = (req, res, next) => {
    let User = req.session.user
    cartHelper.userCart(req.session.user._id).then(cartData => {
        userHelper.getAllAddresses(req.session.user._id).then(address => {
            res.render('user/checkout', { user: true, login: true, User, cart: cartData.user.cart, total: cartData.cartTotal, address: address })
        })
    })
}


//================ PLACE ORDER ================//
exports.placeOrder = (req, res, next) => {
    if (req.body.payment == "cod") {
        orderHelper.placeOrder(req.body, req.session.user._id, req.session.coupon).then((response) => {
           console.log(response,"lllllllllllllll");
           if(response === 'nocoupon'){
            res.json({message:'nocoupon'})
           }else{
               req.session.orderId = response
               res.json({ cod: true })
           }
        }).catch(err => {
            next(err)
        })
    }
    else if (req.body.payment == 'online payment') {
        orderHelper.placeOrder(req.body, req.session.user._id, req.session.coupon).then((response) => {
            orderHelper.generateRazorpay(response, req.session.user._id).then((order) => {
                req.session.orderId = response
                res.json(order)
            })
        }).catch((err) => {
            next(err)
        })
    }
}

//============== VERIFY PAYMENT ================//
exports.verifyPayment = (req, res, next) => {
    orderHelper.verifyPayment(req.body).then(() => {
       
        orderHelper.changeOrderStatus(req.session.orderId, req.session.user._id).then(() => {

            res.json(true)
        }).catch((err) => {
            next(err)
        })
    }).catch((err) => {
        res.render('user/payment-failed', { user: true, login: true })
    })
}


//============ PAYMENT FAILED ===========//
exports.paymentFail = (req, res, next) => {
    orderHelper.updatePaymentStatus(req.session.orderId, "Failed").then(() => {
        orderHelper.updateOrder(req.session.orderId, "Failed").then(() => {
            req.session.coupon = null
            res.render('user/payment-failed', { user: true, login: true })
        }).catch((err) => {
            next(err)
        })
    }).catch((err) => {
        next(err)
    })
}

//========= Order success page =========//
exports.orderSuccess = (req, res,) => {
    let User = req.session.user
    if (req.session.orderId) {
        res.render('user/order-success', { user: true, User, login: true, order: req.session.orderId })
        req.session.orderId = false
        req.session.coupon = null
    }
}


//============ Single order details page =============//
exports.orderDetails = (req, res, next) => {
    let User = req.session.user
    orderHelper.orderDetails(req.params.id, req.session.user._id).then((response) => {
        res.render('user/order-details', { user: true, login: true, order: response.orderData, address: response.address, User })
    }).catch((err) => {
        next(err)
    })
}

//============ CANCEL ORDER =============//
exports.cancelOrder = (req, res, next) => {
    orderHelper.updateOrder(req.params.id, "cancelled").then((response) => {
        res.json(response)
    }).catch((err) => {
        next(err)
    })
}