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

//Post Comments Route
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

/// GET comments/:id route
router.get("/:id", (req, res, next) =>{
    const comment = comments.find(c => c.id == req.params.id);
    if(comment){
        res.json(comment);
    }else{
        next(error(404, "Comment not found"));
    }
});

// PATCH comments/:id route
router.patch("/:id", (req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        if (req.body.body) {
          comments[i].body = req.body.body;
          return true;
        } else {
          next(error(400, "Body is Required"));
          return false;
        }
      }
    });
  
    if (comment) {
      res.json(comment);
    } else {
      next(error(404, "Comment Not Found"));
    }
  });

  //DELETE comments/:id route
  router.delete("/:id", (req, res, next) =>{
    const comment = comments.find((c, i) => {
        if (c.id == req.params.id) {
          comments.splice(i, 1);
          return true;
        }
      });
  
      if (comment) res.json(comment);
      else next(error(404, "Comment Not Found"));
  });
    
module.exports = router;