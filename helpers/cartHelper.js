const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const async = require('hbs/lib/async')
const { count, update } = require('../models/userModel')

//========== USER CART ===========//
exports.userCart = (userId) => {
    try {
        return new Promise(async (res, rej) => {
            const user = await userModel.findOne({ _id: userId }).populate('cart.product').lean()

            let total = 0
            for (i = 0; i < (user?.cart)?.length; i++) {
                total = total + (user.cart[i].quantity * user.cart[i].pricePerItem)
                total = Math.floor(total)
            }
            const cartData = {
                user: user,
                cartTotal: total
            }
            res(cartData)
        })

    } catch (err) {
        rej(err)
    }
}

//========== CART COUNT ===========//
exports.cartCount = (userId) => {
    return new Promise(async (res, rej) => {
        try {
            count = await userModel.findOne({ _id: userId }).cart.length
            res(count)


        } catch (error) {
            rej(error)

        }

    })
}


//=========== ADD TO CART ===========//
exports.addToCart = (userId, productId) => {
    return new Promise(async (res, rej) => {
        try {
            const productExist = await userModel.findOne({ _id: userId, "cart.product": productId })
            if (productExist) {
                await userModel.updateOne({ _id: userId, "cart.product": productId }, {
                    $inc: { "cart.$.quantity": 1 }
                })

                let count = (await userModel.findOne({ _id: userId })).cart.length
                res(count)
            }
            else {
                const product = await productModel.findOne({ _id: productId })
                await userModel.findByIdAndUpdate({ _id: userId }, {
                    $push: {
                        cart: {
                            product: productId,
                            quantity: 1,
                            pricePerItem: product.price
                        }
                    }
                })
                count = (await userModel.findOne({ _id: userId })).cart.length
                res(count)
            }
        } catch (error) {
            rej(error)
        }
    })
}

//========= UPDATE QUANTITY =========//
exports.updateCart = (userId, update) => {
    return new Promise(async (res, rej) => {
        try {
            const userDetails = await userModel.findOne({ _id: userId, "cart.product": update.productId })
            const productCount = userDetails.cart.length
            for (i = 0; i < productCount; i++) {
                let Id = userDetails.cart[i].product
                if (Id == update.productId) {
                    quantity = userDetails.cart[i].quantity
                    break
                }
            }
            if (!(quantity == 1 && update.change == -1)) {
                try {
                    await userModel.findOneAndUpdate({ _id: userId, "cart.product": update.productId }, {
                        $inc: { "cart.$.quantity": update.change }
                    })
                    const quantity = await userModel.findOne({ _id: userId, "cart.product": update.productId }).cart[0].quantity
                    console.log("Quantity =", quantity);
                    res(quantity)
                } catch (error) {
                    rej(error)
                }
            }
            res(quantity)
        } catch (error) {
            rej(error)

        }
    })
}

//======== REMOVE FROM CART =========//
exports.deleteFromCart = (userId, productId) => {
    return new Promise(async (res, rej) => {
        try {
            await userModel.findOneAndUpdate({ _id: userId }, {
                $pull: {
                    cart: {
                        product: productId
                    }
                }
            })

            count = await userModel.findOne({ _id: userId }).cart.length
            res(true)
        } catch (error) {
            rej(error)
        }

    })
}

