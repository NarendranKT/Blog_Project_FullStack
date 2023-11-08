const Comment = require("../../model/comment/comment");
const Post = require("../../model/post/post");
const User = require("../../model/user/user");
const appErr = require("../../utils/appErr");

const setComment = async (req, res, next) => {
    const { message } = req.body;
    try {
        // find the post
        const post = await Post.findById(req.params.id).populate('user');

        // create a comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message
        });

        // push comments to the post
        post.comments.push(comment._id);
        // push comments to user
        const user = await User.findById(req.session.userAuth);
        user.comments.push(comment._id);
        
        // disabling the validation
        // resave the post and user document
        await post.save({validateBeforeSave : false});
        await user.save({validateBeforeSave : false});

        // res.json({
        //     status: "success",
        //     data : comment
        // })

        res.redirect(`/api/v1/posts/${req.params.id}`)

    } catch (error) {
        next(appErr(error.message));
    }
}

const getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user');
        res.render('comments/updateComment', {
            comment,
            postId : req.query.postId,  
            error:""
        });
    } catch (error) {
         res.render('comments/updateComment', {
            comment:"", 
            error:error.message
        });
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const postid = req.query.postId;
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.session.userAuth) {
            return next(appErr("You are not allowed to delete this comment"));
        }

        await Comment.findByIdAndDelete(req.params.id);

        // res.json({
        //     status: "success",
        //     data : "Comment is deleted successfully"
        // })

        res.redirect(`/api/v1/posts/${postid}`)

    } catch (error) {
        next(appErr(error.message));
    }
}

const updateComment = async (req, res, next) => {
    const { message } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(appErr("Comment not found!"));
        }
        if (comment.user.toString() !== req.session.userAuth) {
            return next(appErr("You are not allowed to update this comment"));
        }

        const commentUpdated  = await Comment.findByIdAndUpdate(req.params.id, {message}, {new : true});
        
        res.redirect(`/api/v1/posts/${req.query.postId}`)

    } catch (error) {
        next(appErr(error.message));
    }
}

module.exports = {
    setComment,
    getComment,
    deleteComment,
    updateComment
}