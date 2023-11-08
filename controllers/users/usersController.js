const User = require("../../model/user/user");
const bcrypt = require('bcryptjs');
const appErr = require("../../utils/appErr");


// *Register
const registerCtrl = async (req, res, next) => {
    const { fullName, email, password } = req.body
    // console.log(req.body);
    // $Check if field is empty
    if (!fullName || !email || !password) {
        // return next(appErr("All fields are required!"));
        return res.render('users/register', {
                error : "All fields are required!"
            })
    }
    // $tryCatch
    try {
        // $Get user
        const userFound = await User.findOne({ email });

        // $Check user
        if (userFound) {
            // return next(appErr("User already exist", 404));
            return res.render('users/register', {
                error : "User already exist"
            })
        }
        // $if not, then hash the user password
        const salt = await bcrypt.genSalt(10);
        const pwdHash = await bcrypt.hash(password, salt);
        // $register User
        const user = await User.create({
            fullName, email, password : pwdHash
        })

        

        // console.log(user);
        // res.json({
        //     status: "Success",
        //     user: user
        // });

        // $redirect
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        res.json(error)
    }
}

// *Login
const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('users/login', {
                error : "All fields are required!"
            })
    }

    try {
        // $Find User
        const userFound = await User.findOne({ email });

        // $Check User
        if (!userFound) {
            return res.render('users/login', {
                error : "Invalid login credentials"
            })
        }

        // $check password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (!isPasswordValid) {
            return res.render('users/login', {
                error : "Invalid login credentials"
            })
        }

        // $save user to session - cookies based session in browser
        req.session.userAuth = userFound._id;
        // console.log(req.session);

        // $Send message to user
        res.redirect('/api/v1/users/profile-page')
        // res.json({
        //     status: "Success",
        //     data: userFound
        // });
    } catch (error) {
        res.json(error)
    }
}

// *Details
const getDetailsCtrl = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
       
        // render the update user page
        res.render('users/updateUser', {
            error : "",
            user
        })
    } catch (error) {
        res.json(error);
    }
}

// *Profile
const getProfileCrtl = async (req, res) => {
    try {

        const userID = req.session.userAuth;
        const user = await User.findById(userID).populate('posts').populate('comments');
        // console.log(user);

        res.render('users/profile', { user });
    } catch (error) {
        res.json(error);
    }
}

// *Profile Picture
const profilePicCtrl = async (req, res, next) => {  
    try {
        
        if (!req.file) {
            // return next(appErr("No file found", 403));
            res.render('users/uploadDP', {
                error : "please upload image"
            })
        }

        // 1.Find the user to be updated
        const userID = req.session.userAuth;
        const user = await User.findById(userID);

        // 2.Check if the user is found
        if (!user) {
            res.render('users/uploadDP', {
                error : "User not found"
            })
        }

        // 3.Update the profile photo
        await User.findByIdAndUpdate(userID, {
            profileImage: req.file.path
        }, { new: true });

        // redirect the route
        res.redirect('/api/v1/users/profile-page')
        
    } catch (error) {
        res.render('users/uploadDP', {
                error : error.message
            })
    }
}

// *Cover Picture
const coverPicCtrl = async (req, res, next) => {
    try {
        
        if (!req.file) {
            return res.render('users/uploadCP', {
                error : "File not found"
            })
        }

        const userID = req.session.userAuth;
        const user = await User.findById(userID);

        // Check if user is registered and there in mongo db
        if (!user) {
            return res.render("users/uploadCP", {
                error : "User not found"
            })
        }

        // if there is a user upload a profile picture and update link in mongodb
        await User.findByIdAndUpdate(userID, {
            coverImage: req.file.path
        }, { new: true });

        // Redirect the page once completed successfully
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.render('users/uploadCP', {
            error : error.message
        })
    }
}

// *Password Update
const updatePassword = async (req, res) => {
    const { password,confirmPassword } = req.body;
    try {
        if (password && confirmPassword) {
            if (password != confirmPassword) {
                return res.render('users/updatePassword', {
                    error: "Password did not match!"
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashPwd = await bcrypt.hash(password, salt);

            await User.findByIdAndUpdate(req.session.userAuth, { password :hashPwd }, { new: true });
        
            res.redirect('/api/v1/users/profile-page');
        } else {
            return res.render('users/updatePassword', {
                    error: "Please fill all the field"
                })
        }
    } catch (error) {
        return res.render('users/updatePassword', {
                error: "Please fill password field"
        })
    }
}

// *User Update
const updateUser = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email) {
            return res.render('users/updateUser', {
                error: "All the fields are required",
                user:""
            })
        }
        // $To check email
        if (email) {
            const emailCheck = await User.findOne({email});
            if (emailCheck && email !== emailCheck.email) {
                return res.render('users/updateUser', {
                error: "Email is already taken",
                user : ''
        })
            }
        }

        // $ Updating user
        const user = await User.findByIdAndUpdate(req.session.userAuth, {
            fullName,email
        }, {
            new : true,
        });

        // redirect once successfully updated
        res.redirect('/api/v1/users/profile-page');

    } catch (error) {
        return res.render('users/updateUser', {
            error: error.message,
            user : ''
        })
    }
}

// *User Logout
const logoutCtrl = (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/api/v1/users/login');
       })
    } catch (error) {
        res.json(error)
    }
}

module.exports = {
    registerCtrl,
    loginCtrl,
    getDetailsCtrl,
    getProfileCrtl,
    profilePicCtrl,
    coverPicCtrl,
    updatePassword,
    updateUser,
    logoutCtrl
}