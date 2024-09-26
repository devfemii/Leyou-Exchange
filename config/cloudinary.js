const cloudinary = require("cloudinary").v2;

cloudinary.config({ secure: true, cloudinary_url: process.env.CLOUDINARY_URL });

module.exports = cloudinary;
