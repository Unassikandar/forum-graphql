const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema( {
    postId: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', postSchema);