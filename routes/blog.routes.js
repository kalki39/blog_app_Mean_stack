const express = require("express");
const BlogRouter = express.Router();
const {
  createBlog,
  getMyBlogs,
  deleteBlog,
  editBlog,
  getBlogs
} = require("../Controllers/BlogController");
const { isAuth } = require("../Middlewares/AuthMiddleware");
const app = express();

BlogRouter.post("/create-blog/:userId", isAuth, createBlog);
BlogRouter.get("/myblogs/:userId", isAuth, getMyBlogs);
BlogRouter.get("/allblogs/:userId", isAuth, getBlogs);
BlogRouter.post("/deleteblog", isAuth, deleteBlog);
BlogRouter.put("/editblog", isAuth, editBlog);

module.exports = BlogRouter;