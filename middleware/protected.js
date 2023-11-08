const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
    // console.log(req.session.userAuth);
    if (req.session.userAuth) {
        next();
    } else {
        res.render('users/unAuthorized')
    }
}

module.exports = protected;