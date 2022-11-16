const async = require('hbs/lib/async');
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const adminModel = require('../models/adminModel')
const couponModel = require('../models/couponModel')

const dotenv = require('dotenv').config()

const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)


exports.signedUp = (body) => {

    return new Promise(async (res, rej) => {
        const response = {}
        const userEmail = await userModel.findOne({ email: body.email })
        const userMobile = await userModel.findOne({ mobile: body.mobile })
        if (userEmail || userMobile) {
            response.status = true
            response.mobile = body.mobile
            res(response)
        }
        //send otp
        else {
            client.verify.v2
                .services(process.env.SERVICE_ID)
                .verifications.create({
                    to: `+91${body.mobile}`,
                    channel: "sms",
                })
                .then((verification) => console.log(verification.status));
            response.mobile = body.mobile
            body.password = await bcrypt.hash(body.password, 10)
            const user = new userModel(body)
            user.save()
                .then((response) => {

                    res(response)
                })
                .catch((err) => {

                    rej(err)
                })
        }

    })
}


//=========== CHECKING OTP =============//
exports.otpCheck = (mobile, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = {}
            const userData = await userModel.findOne({ mobile: mobile });
            client.verify.v2
                .services(process.env.SERVICE_ID)
                .verificationChecks.create({ to: "+91" + mobile, code: otp })
                .then(async (verification_check) => {
                    await userModel.updateOne({ mobile: mobile }, { isVerified: true });

                    response.status = verification_check.valid;
                    response.user = userData;
                    resolve(response);
                })
                .catch((err) => {

                    response.failed = true;
                    resolve(response);
                });
        } catch (err) {
            reject(err)
        }
    })
}

//============== SIGN IN ==============//
exports.signin = (body) => {

    return new Promise(async (res, rej) => {

        let response = {};
        let user = await userModel.findOne({ email: body.email })

        if (user) {
            bcrypt.compare(body.password, user.password).then((status) => {
                if (status) {
                    console.log('login success');
                    response.user = user
                    response.status = true
                    res(response)

                }
                else {
                    res(response)
                }
            })
        }
        else {
            res(response)
        }
    })
}

//=============== ALL PRODUCT LIST =============//
exports.getAllProducts = () => {
    return new Promise(async (res, rej) => {
        try {
            const products = await productModel.find({ deleted: false }).populate('category').lean()

            res(products)

        } catch (error) {
            console.log("Could not get products from database");
            rej(error)

        }
    })

}

//=============== PRODUCT LIST BY CATEGORY =============//
exports.getProductByCategory = (id) => {
    return new Promise(async (res, rej) => {
        try {
            const products = await productModel.find({ category: id, deleted: false }).populate('category').lean()
            // console.log(products);
            res(products)

        } catch (error) {
            console.log("Could not get products from database");
            rej(error)

        }
    })

}


//============= USER WISHLIST ===============//
exports.userWishlist = (userId) => {
    return new Promise(async (res, rej) => {
        try {
            const wishlist = await userModel.findById({ _id: userId }).populate('wishlist.product').lean()
            res(wishlist)
        } catch (error) {
            rej(error)
        }
    })
}

//============ EDIT USER WISHLIST =============//
exports.addToWishlist = (userId, productId) => {
    return new Promise(async (res, rej) => {
        try {

            const productExist = await userModel.findOne({ _id: userId, "wishlist.product": productId })
            if (productExist) {

                res(0)
            }
            else {
                const Product = await productModel.findById({ _id: productId })
                await userModel.updateOne({ _id: userId }, {
                    $push:
                    {
                        wishlist: {
                            product: productId

                            // pricePerItem : Product.price
                        }

                    }
                })

                res(1)

            }
        } catch (error) {
            rej(error)

        }
    })

}

//=========== REMOVE FORM WISHLIST ============//
exports.removeFromWishlist = (userId, productId) => {
    return new Promise(async (res, rej) => {
        try {
            await userModel.updateOne({ _id: userId }, {
                $pull: {
                    wishlist: {
                        product: productId
                    }
                }
            })

            res(true)
        } catch (error) {
            rej(error)
        }

    })
}

//=========== GETTING USER DETAILS ============//
exports.getUserDetails = async (userId) => {
    try {
        const userDetails = await userModel.findById({ _id: userId }).lean()
        return userDetails
    } catch (error) {
        console.log("error occured while fetching user details.....");

    }

}

//===============  EDIT PROFILE =================//
exports.editProfile = async (userId, data) => {
    try {
        await userModel.updateOne({ _id: userId }, {
            $set: {
                name: data.name,
                email: data.email,
                mobile: data.mobile
            }
        })
        const userDetails = userModel.findOne({ _id: userId }).lean()

        return userDetails

    } catch (error) {
        console.log("error in editing profile");
    }
}

//============== ALL ADDRESSES OF A USER ===============//
exports.getAllAddresses = async (userId) => {
    try {
        let user = await userModel.findOne({ _id: userId }).lean()
        const address = user.address

        return address
    } catch (error) {
        console.log("address not fetched");
    }
}

//============== ADD NEW ADDRESS ================//
exports.addAddress = async (userId, addresses) => {

    try {
        let address = await userModel.updateOne({ _id: userId }, {
            $push: {
                address: {


                    name: addresses.name,
                    locality: addresses.locality,
                    area: addresses.area,
                    landmark: addresses.landmark,
                    pincode: addresses.pincode

                }
            }


        })

        return address
    } catch (error) {
        log(error)

    }

}

//============== DELETE ADDRESS ================//
exports.deleteAddress = async (userId, addressId) => {
    try {


        const address = await userModel.updateOne({ _id: userId }, {
            $pull: {
                address: {
                    _id: addressId
                }

            }
        })

        return address

    } catch (error) {

    }
}

//============== GET COUPON ================//
exports.getCoupon = async (id) => {
    try {
        let coupon = await couponModel.findOne({ code: id }).lean()

        if (coupon) {
            return coupon.discount
        }


    } catch (error) {
        console.log('error getting coupon');
    }


}