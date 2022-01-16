const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const PostSchema = new mongoose.Schema({
    owner: ObjectId,
    description: String,
    images: imageSchema
});

const Post= mongoose.model('Friend', PostSchema);
const Image = mongoose.model('Image', imageSchema);
module.exports = {Image, Post};
