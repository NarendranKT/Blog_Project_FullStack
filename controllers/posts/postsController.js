const Post = require("../../model/post/post")
const User = require("../../model/user/user");
const appErr = require("../../utils/appErr");

// *CREATE POST
const setPostCtrl = async (req, res, next) => { 
    const { title, description, category, image, user } = req.body;
    try {
        // CHECK EVERYTHING
        if (!title || !description || !category || !req.file) {
            // return next(appErr("All fields are required"))
            return res.render('posts/addPost', { error: "All fields are required!" });
        }

        // Find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);

        // Create a post for a user
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image : req.file.path,  
        })

        // push the post created to the user's post array
        userFound.posts.push(postCreated._id);

        // after pushing resave the user
        await userFound.save();

        // On success
        res.redirect('/');

        // res.json({
        //     status: "success",
        //     user: postCreated
        // })
    } catch (error) {
        return res.render('posts/addPost', { error: error.message });
    }
}

const getPostCtrl = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('comments').populate('user');
        res.render('posts/allPost', {
            posts
        });
    } catch (error) {
        next(appErr(error.message));
    }
}

// *FetchPost - 1
const getOnePostCtrl = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const post = await Post.findById(userId).populate('user').populate({
            path: 'comments',
            populate:{path:'user'}
        });

        res.render('posts/postDetails', {
            post, 
            error:"",
        })

        // res.json({
        //     status: "success",
        //     data : user,
        // })
    } catch (error) {
        next(appErr(error.message))
    }
}

const deletePostCtrl = async (req, res, next) => {
    try {
        // find post 
        const post = await Post.findById(req.params.id);
        // check if post belongs to the user
        if (post.user.toString() === req.session.userAuth.toString()) {
            await Post.findByIdAndDelete(req.params.id);
        } else {
            return next(appErr("You are not allowed to delete this post", 405));
        }

        res.redirect('/');

        // res.json({
        //     status: "success",
        //     data: "Post is deleted successfully"
        // })
    } catch (error) {
        next(appErr(error.message))
    }
}

const updatePostCtrl = async (req, res, next) => {
    const { title, description, category, image } = req.body;
    try {
        // find post 
        const post = await Post.findById(req.params.id);

        // check if post belongs to the user
        if (post.user.toString() !== req.session.userAuth.toString()) {
            // return next(appErr("You are not allowed to update this post", 405));
            res.render('posts/updatePost', { post:"", error : "You are not allowed to update this post" });
        }

        // check if user is updating image
        if (req.file) {
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                description,
                category,
                image: req.file.path
            }, {new : true})
        } else {
            await Post.findByIdAndUpdate(req.params.id, {
                title,
                description,
                category
            }, {new : true})
        }
        
        res.redirect('/');
    } catch (error) {
        res.render('posts/updatePost', { post:"", error:error.message });
    }
}

module.exports = {
    setPostCtrl,
    getPostCtrl,
    getOnePostCtrl,
    deletePostCtrl,
    updatePostCtrl
}