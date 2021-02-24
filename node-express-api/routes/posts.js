var express = require('express');
var router = express.Router();

var Post = require('../models/post');

//get all posts
router.get('/', (req, res) => {
    Post.find((err, posts) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        res.send(posts)
    })
});
//get post by id
router.get('/:id', (req, res) => {
    var postId = req.params.id;
    Post.findOne({_id: postId},(err, post) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        res.send(post)
    })
});
//add post
router.post('/', (req, res) => {
    //controlli su validita nuovo post 
    var post = new Post(req.body);
    post.save((err, post) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        
        res.send({
            message: "Post created",
            data: post
        })
        
    });
});
//modify post
router.put('/', (req, res) => {
     //controlli su validita nuovo post 
    
    var postUniqueId = req.body._id;

    Post.findOne({ _id: postUniqueId }, (err, post) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        
        post.postTitle = req.body.post.postTitle;
        post.postBody = req.body.post.postBody;

        post.save((s_err, s_post) => {
            if (s_err) {
                res.status(503).send("An unexpected error occured");
                return
            }
            res.send({
                message: "Post updated",
                data: s_post
            })
               
        })


    });
});
//delete post by id
router.delete('/:id', (req, res) => {
    var postId = req.params.id;
    Post.findOne({ _id: postId }, (err, post) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        if (!post) {
            res.status(404).send("Nessun post con questo id");
            return
        }
        post.remove((err, post) => {
            if (err) {
                res.status(503).send("An unexpected error occured");
                return
            }
            res.send(`Post ${post.postTitle} deleted`);
        });
    });
});
//delete bulk ["id1", "id2"]
router.delete('/', (req, res) => {
    
    var postsIds = req.body;
    Post.deleteMany({ _id: { $in: postsIds } }, (err, posts) => {
        if (err) {
            res.status(503).send("An unexpected error occured");
            return
        }
        res.send(posts);
    });


});

module.exports = router;