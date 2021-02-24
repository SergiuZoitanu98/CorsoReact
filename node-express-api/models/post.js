var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    postId: String,
    postTitle: String,
    postBody: String,
    postAuthor: String
}, {timestamps: true});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;