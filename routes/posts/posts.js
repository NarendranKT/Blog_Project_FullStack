const express = require('express');
const { setPostCtrl, getPostCtrl, getOnePostCtrl, deletePostCtrl, updatePostCtrl } = require('../../controllers/posts/postsController');
const postRoute = express.Router();
const protected = require('../../middleware/protected');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const Post = require('../../model/post/post');

// Instance of the multer
const upload = multer({ storage });

// Forms
postRoute.get('/get-post-form', (req, res) => {
    res.render('posts/addPost', {error : ""})
})

postRoute.get('/update-post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/updatePost', { post, error:""});
    } catch (error) {
        res.render('posts/updatePost', { post:"", error });
    }
})

// $POSTS ROUTE 
// >Creating : Post
postRoute.post('/', protected, upload.single("post"), setPostCtrl);

// >Fetch single : Post
postRoute.get('/:id', getOnePostCtrl)

// >Delete single : Post
postRoute.delete('/:id',protected, deletePostCtrl)

// >Update single : Post
postRoute.put('/:id',protected, upload.single('update'), updatePostCtrl)

// >Fetch : Post
postRoute.get('/', getPostCtrl)

module.exports = postRoute;