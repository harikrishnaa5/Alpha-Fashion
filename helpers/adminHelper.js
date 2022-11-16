const async = require('hbs/lib/async')
const userModel = require('../models/userModel')
const categoriesModel = require('../models/categoriesModel')
const bcrypt = require('bcrypt')
const productModel = require('../models/productModel')
const adminModel = require('../models/adminModel')
const multer = require('multer')
const bannerModel = require('../models/bannerModel')
const couponModel = require('../models/couponModel')
const orderModel = require('../models/orderModel')


//============= SIGN IN ==============//
exports.signin = (body) => {
    return new Promise(async (res, rej) => {
        let loginStatus = false;
        let response = {};

        let admin = await adminModel.findOne({ email: body.email })

        if (admin) {
            bcrypt.compare(body.password, admin.password).then(status => {
                if (status) {
                    console.log('login success');
                    response.admin = admin
                    response.status = true
                    res(response)
                }
                else {
                    console.log('login failed1');
                    res({ loginStatus: false })

                }
            })
        }
        else {
            console.log('login failed2');
        }



    })
}

//========== BLOCKING USER =============//
exports.blockUser = (id) => {
    return new Promise(async (res, rej) => {
        await userModel.findByIdAndUpdate({ _id: id }, { isActive: false })
        users = await userModel.find().lean()
        res(users);
    })
}

//============= UNBLOCKING USER =============//
exports.unblockUser = (id) => {
    return new Promise(async (res, rej) => {
        await userModel.findByIdAndUpdate({ _id: id }, { isActive: true })
        users = await userModel.find().lean()
        res(users);
    })
}

//============ CATEGORY PAGE =============//
exports.getCategory = () => {
    return new Promise(async (res, rej) => {
        const categoryData = await categoriesModel.find().lean()
        res(categoryData)
    })
}

//=========== ADD NEW CATEGORY =============//
exports.addCategory = (body) => {
    return new Promise(async (res, rej) => {
        const categoryExists = await categoriesModel.findOne({ category: body.category }).lean()
        if (categoryExists) {
            res(0)
        } else {
            const category = new categoriesModel(body)
            category.save().then(() => {

                res(1)
            })
                .catch(err => {

                    rej(err)
                })
        }

    })
}


//=============== EDIT A CATEGORY ===============//
exports.editCategory = async (id, category) => {
    try {
        const categoryExists = await categoriesModel.findOne({ _id: id }).lean()
        console.log(categoryExists, "category existsssssss");
        if (categoryExists) {
            await categoriesModel.findOneAndUpdate({ _id: id }, { $set: { category: category } })
            return (1);
        } else {
            return (0)
        }
    } catch (error) {
        console.log(error);
    }

}


//============= DELETE CATEGORY ================//
exports.deleteCategory = (data) => {
    return new Promise(async (res, rej) => {
        // const categoryExists = await categoriesModel.findOne({_id : id}).lean()
        // if(categoryExists){
        //     res(0)
        // }
        // else{
        await categoriesModel.deleteOne({ _id: data.id })
        // }
        res(true)
    })
}

//CONFIGURATION OF MULTER
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/productsImages")
    },
    fileName: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `productImages-${file.fieldname}-${Date.now()}.${ext}`)
    }
})

//MULTER FILTER
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[1] === 'jpg' || 'jpeg' || 'png' || 'webp') {
        cb(null, true)
    }
    else {
        cb(new Error('file format not support'), false)
    }
}

//CALLING THE MULTER FUNCTION
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadProductsImgs = upload.array('images', 3)

//=========== PRODUCT ADD CONFIRMATION ============//
exports.addProductConfirm = ((body) => {

    return new Promise((res, rej) => {
        try {
            const productData = {
                name: body.name,
                description: body.description,
                category: body.category,
                stock: body.stock,
                price: body.price,
                cost: body.cost,
                image: body.images

            }
            const product = new productModel(productData)
            product.save().then(() => {
                console.log("Product added to database");
                res();
            }).catch((err) => {
                rej(err)
            })
        }
        catch (err) {
            console.log("Product not saved to database");
            rej(err)
        }
    })
})


//=============== PRODUCT LIST =============//
exports.getAllProducts = () => {
    return new Promise(async (res, rej) => {
        try {
            const products = await productModel.find({}).populate('category').lean()
            // console.log(products);
            res(products)

        } catch (error) {
            console.log("Could not get products from database");
            rej(error)

        }
    })

}

//============ VIEW SINGLE PRODUCT =============//
exports.viewSingleProduct = async (id) => {
    // return new Promise(async(res, rej) => {
    try {
        const response = {}
        const allCategories = await categoriesModel.find().lean()
        const product = await productModel.findOne({ _id: id }).populate('category').lean()
        response.category = allCategories
        response.product = product
        return response

    } catch (error) {
        rej(error)

    }
    // })
}

//============== PRODUCT UPDATE =============//
exports.updateProduct = async (id, body) => {
    //return new Promise((res, rej) => {
    try {
        console.log(body, "llllll");
        let edited = await productModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: body.name,
                description: body.description,
                category: body.category,
                stock: body.stock,
                price: body.price,
                cost: body.cost,
                image: body.image
            }
        })
        //res()
        console.log(edited, "product updated successfully");
    } catch (error) {
        console.log('product not updated', error);


    }
    //})
}


//============ DELETE PRODUCT =============//
exports.deleteProduct = (id) => {
    return new Promise(async (res, rej) => {
        try {
            const deleted = await productModel.findOne({ _id: id })
            if (deleted.deleted) {
                await productModel.updateOne({ _id: id }, { $set: { deleted: false } })
                res({ active: true })
            } else {
                await productModel.updateOne({ _id: id }, { $set: { deleted: true } })
                res({ active: false })

            }
        } catch (error) {

            rej(error)
        }

    })

}

//=========== BANNER LIST ===========//
exports.bannerList = async () => {
    try {
        const item = await bannerModel.find().populate('category').lean()
        return item
    } catch (error) {
        console.log(error);

    }

}

//===========ADD BANNER ===========//
exports.addBanner = async () => {
    try {
        const item = await bannerModel.find().lean()
        return item
    } catch (error) {
        console.log(error)

    }

}

//===========ADD BANNER ===========//
exports.addBannerConfirm = async (body) => {
    try {
        const bannerData = {
            name: body.name,
            category: body.category,
            description: body.description,
            image: body.image
        }
        const banner = new bannerModel(bannerData)
        banner.save().then(() => {
            return banner
        }).catch(err => {
            console.log(err);
        })

    } catch (error) {
        console.log(error)
    }
}

//=========== DELETE BANNER ===========//
exports.deleteBanner = async (id) => {
    try {
        await bannerModel.deleteOne({ _id: id })
        return true
    } catch (error) {
        console.log(error);
    }

}

//=========== COUPON PAGE ===========//
exports.getAllCoupon = async () => {
    try {
        const coupon = await couponModel.find().lean()
        return coupon
    } catch (error) {
        console.log(error)
    }
}


//=========== ADD COUPON ===========//
exports.addCoupon = async (data) => {
    try {
        const couponExists = await couponModel.findOne({ code: data.code })
        if (couponExists) {
            return 0
        }
        else {
            const couponObj = {
                code: data.code,
                discount: data.discount
            }
            const coupon = new couponModel(couponObj)
            coupon.save().then((response) => {
                return 1
            }).catch(err => {
                console.log(err);
            })
        }
    } catch (error) {
        console.log(error);
    }
}


//=========== DELETE COUPON ===========//
exports.deleteCoupon = async (id) => {
    try {
        let coupon = await couponModel.findOneAndDelete({ _id: id })
        return coupon
    } catch (error) {
        console.log(error);
    }

}

//======= GET DETAILS OF ALL ORDERS ========//
exports.viewAllOrders = () => {
    return new Promise(async (res, rej) => {
        try {
            const orders = await orderModel.find().populate('userId').lean()
            res(orders)
        } catch (err) {
            rej(err)
        }
    })
}

//============== GET ORDER DETAILS ==============//
exports.orderDetails = (orderId) => {
    return new Promise(async (res, rej) => {
        try {
            const response = {}
            const userId = (await orderModel.findOne({ _id: orderId })).userId
            const user = await userModel.findOne({ _id: userId }).lean()
            response.orderData = await orderModel.findOne({ _id: orderId }).populate("products.product").lean()
            const addressIdFromOrder = response.orderData.address.toString()
            for (let i = 0; i < user.address.length; i++) {
                if (user.address[i]._id == addressIdFromOrder) {
                    response.address = user.address[i];
                    break;
                }
            }
            res(response)
        } catch (err) {
            rej(err)
        }
    })
}

//============== SALES REPORT ==============//
exports.salesReport = () => {

    return new Promise(async (res, rej) => {
        try {
            let noOfUsers = await userModel.countDocuments()
            let noOfProducts = await productModel.countDocuments()
            let noOfOrders = await orderModel.find({ orderStatus: "Delivered" }).countDocuments()
            console.log(noOfOrders);
            let totalProfit = 0
            let ordersData = await orderModel.find({ paymentStatus: "Paid" })
            for (let i = 0; i < noOfOrders; i++) {
                ordersData.map((val) => {
                    totalProfit = val.net + totalProfit
                })
            }
            totalProfit = totalProfit.toString().slice(0, 11)
            let dateList = []
            for (let i = 0; i < 10; i++) {
                let d = new Date()
                d.setDate(d.getDate() - i)
                let newDate = d.toUTCString()
                newDate = newDate.slice(5, 16)
                dateList[i] = newDate
            }
            let dateSales = [];
            for (let i = 0; i < 10; i++) {
                dateSales[i] = await orderModel.find({ date: dateList[i] }).lean().count();
            }
            const response = {
                dateSales: dateSales,
                dateList: dateList,
                noOfUsers: noOfUsers,
                noOfProducts: noOfProducts,
                noOfOrders: noOfOrders,
                totalProfit: totalProfit,
            }

            res(response)
        } catch (err) {
            rej(err)
        }
    })
}



