const express = require("express");
const FollowRouter = express.Router();
const { isAuth } = require("../Middlewares/AuthMiddleware");
const { followUser, getFollowingList, getFollowersList, unfollowUser } = require("../Controllers/followController");

FollowRouter.post("/followuser/:userId", isAuth, followUser);
FollowRouter.post("/unfollowuser/:userId", isAuth, unfollowUser);
FollowRouter.get("/followingList/:userId", isAuth, getFollowingList);
FollowRouter.get("/followersList/:userId", isAuth, getFollowersList);
// FollowRouter.get("/myblogs", isAuth, getMyBlogs);
// FollowRouter.post("/deleteblog/:blogId", isAuth, deleteBlog);
// FollowRouter.put("/editblog", isAuth, editBlog);

module.exports = FollowRouter;