require('dotenv').config();
require('./config/dbConnect');
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ejs = require('ejs');
const userRoute = require('./routes/users/users');
const postRoute = require('./routes/posts/posts');
const commentsRoute = require('./routes/comments/comments');
const globalErrHandler = require('./middleware/globalHandler');
const methodOverride = require('method-override');
const Post = require('./model/post/post');
const { truncatePost } = require('./utils/helper');
const app = express();

// $MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// $LOCALS
app.locals.truncatePost = truncatePost;

// $MIDDLEWARE - session configuration
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.CONNECTION,
        ttl: 24*60*60       // *This is one day
    })
}))

// $Save login user into locals
app.use((req, res, next) => {
    if (req.session.userAuth) {
        res.locals.loginUser = req.session.userAuth;
    } else {
        res.locals.loginUser = null;
    }

    next();
})

//$ Configure engine to use ejs file
app.set("view engine", "ejs");

// $ROUTES
app.get('/', async (req, res) => {
    try {
        const post = await Post.find().populate('user');
        res.render('home', {post});
    } catch (error) {
        res.render('home', {error : error.message})        
    }
})
app.use('/api/v1/users', userRoute);    //!User Route
app.use('/api/v1/posts', postRoute);    //!Post Route
app.use('/api/v1/comments', commentsRoute);     //!Comments Route
    
    
// $ERROR HANDLER MIDDLEWARE
// app.use(globalErrHandler);

// $LISTEN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log("server is up and running on port : " + PORT));