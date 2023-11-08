require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// $CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

// $INSTANCE OF CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'jpeg', 'png'],
    params: {
        folder: 'blog-app',
        transformation: [{
            width: 500,
            height: 500,
            crop: "limit"
        }]
    }
})

module.exports = storage;