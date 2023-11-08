const express = require('express');
const storage = require('../../config/cloudinary');
const multer = require("multer");
const { registerCtrl, loginCtrl, getDetailsCtrl, getProfileCrtl, profilePicCtrl, coverPicCtrl, updatePassword, updateUser, logoutCtrl } = require('../../controllers/users/usersController');
const protected = require('../../middleware/protected');
const userRoute = express.Router();

// $INSTANCE OF THE MULTER
const upload = multer({ storage });

// $Rendering webpages
userRoute.get('/login', (req, res) => {
    res.render('users/login', {
        error :""
    })
})

userRoute.get('/register', (req, res) => {
    res.render('users/register', {
        error : ""
    })
})

userRoute.get('/un-auth', (req, res) => {
    res.render('users/unAuthorized')
})

userRoute.get('/upload-profile-pic',(req, res) => {
    res.render('users/uploadDP', {
        error : ""
    });
})

userRoute.get('/upload-cover-pic',(req, res) => {
    res.render('users/uploadCP', {
        error : ""
    });
})

userRoute.get('/update-password', (req, res) => {
    res.render('users/updatePassword', {
        error : ""
    });
})

// $USERS ROUTES
// !POST
// >Register route
userRoute.post('/register',upload.single('profile'), registerCtrl)

// >Login route
userRoute.post('/login', loginCtrl)

// !GET

// >GET single user : profile
userRoute.get('/profile-page',protected, getProfileCrtl)

// >GET single user : logout
userRoute.get('/logout', logoutCtrl)

// !PUT
// >Updating profile : picture
userRoute.put('/profile-photo-upload', protected, upload.single('profile'),profilePicCtrl)

// >Updating cover : picture
userRoute.put('/cover-photo-upload',protected, upload.single('cover') ,coverPicCtrl)

// >Updating user : password
userRoute.put('/update-password', updatePassword)

// >Update User
userRoute.put('/update', updateUser);

// >GET single user : public
userRoute.get('/:id', getDetailsCtrl);

module.exports = userRoute;