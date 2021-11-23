const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.KEY,
    api_secret: process.env.CLOUDSECRET
});

module.exports.storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Campgrounds', // folder inside out cloudinary account
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports.cloudinary = cloudinary;
