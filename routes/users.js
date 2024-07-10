const express = require("express");
const router = express.Router();

const users = require("../data/users");
const posts = require("../data/posts")
const comments = require("../data/comments")
const error = require("../utilities/error");


router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

  //New Route to get posts by user with id
  router.get("/:id/posts", (req, res, next) =>{
    const userId = parseInt(req.params.id);
    const userPosts = posts.filter(post => post.userId === userId);

    if(userPosts.length === 0){
      return next(error(404, "User has no posts"));
    }
    res.json(userPosts);
  });

   //GET /users/:id/comments
   router.get("/:id/comments", ( req, res, next) =>{
    const userId = req.params.id;
    const {postId} = req.query;
    let userComments = comments.filter(comment => comment.userId == userId);
    if(postId){
      userComments = comments.filter(comment => comment.postId == postId);
    }
    if(userComments.length > 0) {
      res.json(userComments);
    }else {
      next(error(404,"No comments found for this user ID."));
    }
  });

module.exports = router;
