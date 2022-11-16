const userSchema = require('../models/userModel')
const adminHelper = require('../helpers/adminHelper')
const middleware = require('../middlewares/admin-middleware')
const orderHelper = require('../helpers/orderHelper')


const { categories } = require('../models/collections')
const { response } = require('express')

//============ HOME PAGE ==============//
exports.home = (req, res, next) => {
    res.render('admin/admin-home')
}

//============= LOGIN PAGE =============//
exports.loginPage = (req, res, next) => {
    let Admin = req.session.admin
    if (Admin) {

        req.session.adminIn = true
        req.session.status = true

        res.redirect('/admin')
    }
    else {
        res.render('admin/admin-login')
    }

}
//============= LOGIN ===============//
exports.login = (req, res, next) => {
    adminHelper.signin(req.body).then(response => {

        if (response.status) {
            req.session.admin = response
            req.session.adminIn = true
            res.redirect('/admin')
        }
        else {
            res.redirect('/admin/login')
        }
    })
}

//========== LOG OUT ===========// 
exports.logout = (req, res, next) => {
    req.session.adminIn = null
    req.session.admin = null
    req.session.loginErr = null
    res.redirect('/admin/login')
}

//============= PRODUCTS =============//
exports.products = (req, res, next) => {
    adminHelper.getAllProducts().then(products => {
        res.render('admin/admin-productlist', { product: products })
    })

}

//============ USER LIST ============//
exports.userlist = async (req, res, next) => {
    const users = await userSchema.find().lean()

    res.render('admin/user-list', { users })
}

//============ BLOCK USER =============//
exports.blockUser = (req, res, next) => {

    adminHelper.blockUser(req.params.id).then((users) => {
        res.render('admin/user-list', { users })
    })
}

//=========== UNBLOCK USER ===========//
exports.unblockUser = (req, res, next) => {

    adminHelper.unblockUser(req.params.id).then((users) => {
        res.render('admin/user-list', { users })
    })
}

//============= CATEGORY LIST=============//
exports.category = (req, res, next) => {
    adminHelper.getCategory().then(categories => {

        res.render('admin/category', { categoryData: categories })
    })
}

//============= ADD CATEGORY =============//
exports.addCategory = (req, res, next) => {
    adminHelper.addCategory(req.body).then(response => {
        res.json(response)
    }).catch(err => {
        console.log("error while adding category");
    })
}

//============== EDIT CATEGORY ============//
exports.editCategory = (req, res, next) => {
    console.log(req.params.id);
    console.log(req.body.category);
    adminHelper.editCategory(req.params.id, req.body.category).then(response => {

        res.json(response)

    }).catch(err => {
        console.log(err);
    })
}

//===========  DELETE CATEGORY ============//
exports.deleteCategory = (req, res, next) => {
    adminHelper.deleteCategory(req.body).then(response => {
        res.redirect('/admin/category')
    })
}

//========== ADD PRODUCT FORM ============//
exports.addProduct = (req, res, next) => {
    adminHelper.getCategory().then((categories) => {
        res.render('admin/add-single-product', { categoryData: categories })
    })
}

//============ ADD PRODUCT =============//
exports.addProductConfirm = (req, res, next) => {
    const imgs = req.files
    let images = imgs.map(value => value.filename)
    req.body.images = images
    adminHelper.addProductConfirm(req.body).then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        next(err)
    })

}

//=========== EDIT PRODUCT ===========//
exports.editProduct = (req, res, next) => {
    adminHelper.viewSingleProduct(req.params.id).then(response => {
        const product = response.product
        const categoryData = response.category
        res.render('admin/edit-single-product', { categoryData, product })
    })
}

//============= UPDATE PRODUCT =============//
exports.updateProduct = (req, res, next) => {
    console.log(req.files, "req.files");
    const img = req.files
    let images = img.map(value => value.filename)
    req.body.image = images
    adminHelper.updateProduct(req.params.id, req.body).then(() => {
        res.redirect('/admin/products')
    }).catch(err => {
        next(err)
    })


}

//============ DELETE PRODUCT ============//
exports.deleteProduct = (req, res, next) => {

    adminHelper.deleteProduct(req.params.id).then((response) => {

        res.json(response)
    }).catch(err => {
        next(err)
    })
}

//========== BANNER LIST ============//
exports.banner = (req, res, next) => {
    adminHelper.bannerList().then(banner => {

        res.render('admin/banner', { banner })
    })



}

//========== ADD BANNER PAGE ============//
exports.addBanner = (req, res, next) => {

    adminHelper.getCategory().then(categoryData => {
        res.render('admin/add-banner', { categoryData })
    })
}


//============ ADD BANNER CONFIRM =============//
exports.addBannerConfirm = (req, res, next) => {
    const img = req.files
    let images = img.map(value => value.filename)
    req.body.image = images
    adminHelper.addBannerConfirm(req.body).then(() => {
        res.redirect('/admin/banner')
    }).catch(error => {
        next(error);
    })
}

//============ DELETE BANNER =============//
exports.deleteBanner = (req, res, next) => {
    adminHelper.deleteBanner(req.params.id).then((response) => {
        res.json(response)
    }).catch(err => {
        next(err)
    })
}

//============== COUPON PAGE ==============//
exports.coupon = (req, res, next) => {
    adminHelper.getAllCoupon().then(coupon => {
        res.render('admin/coupon', { coupon: coupon })
    }).catch(err => {
        next(err)
    })
}

//============== ADD COUPON ==============//
exports.addCoupon = (req, res, next) => {
    adminHelper.addCoupon(req.body).then(response => {
        res.json(response);
    }).catch(err => {
        next(err)
    })
}


//============== DELETE COUPON ==============//
exports.deleteCoupon = (req, res, next) => {
    adminHelper.deleteCoupon(req.params.id).then(response => {
        res.json(response)
    }).catch(err => {
        next(err)
    })
}

//============== ORDER LIST ==============//
exports.orders = (req, res, next) => {
    adminHelper.viewAllOrders().then((orders) => {
        res.render('admin/orders', { orders })
    }).catch((err) => {
        next(err)
    })
}


//============== PACK ORDER ==============//
exports.packOrder = (req, res, next) => {
    orderHelper.updateOrder(req.params.id, "Packed").then((response) => {
        res.json(response)
    }).catch((err) => {
        next(err)
    })
}

//============== SHIP ORDER ==============//
exports.shipOrder = (req, res, next) => {
    orderHelper.updateOrder(req.params.id, "Shipped").then((response) => {
        res.json(response)
    }).catch((err) => {
        next(err)
    })
}

//============== DELIVER ORDER ==============//
exports.deliverOrder = (req, res, next) => {
    orderHelper.updateOrder(req.params.id, "Delivered").then(() => {
        orderHelper.updatePaymentStatus(req.params.id, "Paid").then((response) => {
            res.json(response)
        }).catch((err) => {
            next(err)
        })
    }).catch((err) => {
        next(err)
    })
}

//============== ORDER DETAILS ==============//
exports.orderDetails = (req, res, next) => {
    adminHelper.orderDetails(req.params.id).then((response) => {
        res.render('admin/order-details', { order: response.orderData, address: response.address })
    }).catch((err) => {
        next(err)
    })
}


//============== SALES REPORT ==============//
exports.salesReport = (req, res, next) => {
    adminHelper.salesReport().then(response => {
        console.log(response);
        res.json(response)
    }).catch(err => {
        next(err)
    })
}