const userModel = require('../models/userModel')


exports.loginCheck = (req, res, next) => {
    if(req.session.loggedIn){
        next()
    }
    else{
        res.redirect('/login')
    }
}

exports.activeCheck =async (req, res, next) => {
    if(req.session.loggedIn){
        const active = await userModel.findOne({_id : req.session.user._id})
        if(active.isActive){
            next()
        }
        else{
            res.render('user/access-denied')
        }
    }
    else{
        next()
    }
}