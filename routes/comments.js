const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

// GET /comments route
router.get("/", (req, res) =>{
    const links = [
        {
            href: "/comments",
            rel:"self",
            type:"GET",
        },
        {
            href: "/comments",
            rel:"create",
            type:"POST",
        },
    ];

    res.json({comments, links});
});

router.post("/", (req, res, next) =>{
    const {userId, postId, body} = req.body;
    if(userId && postId && body){
        const id = comments[comments.length - 1].id + 1
        const comment = { id, userId, postId, body };
   
        comments.push(comment);
        res.json(comment);
    }else{
        next(error(400, "No Comments to Load"));
    }
});

module.exports = router;