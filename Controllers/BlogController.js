const express = require("express");
const Blogs = require("../Models/BlogModel");
const User = require("../Models/UserModel");
const { BlogDataValidate } = require("../utils/BlogUtils");
const BlogRouter = express.Router();

BlogRouter.post("/create-blog", async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data valdation
  try {
    await BlogDataValidate({ title, textBody, userId });

    try {
      await User.verifyUserId({ userId });
    } catch (error) {
      return res.send({
        status: 400,
        message: "UserId issue",
        error: error,
      });
    }

    const blogObj = new Blogs({ title, textBody, userId, creationDateTime });

    try {
      const blogDb = await blogObj.createBlog();
      console.log(blogDb);
      return res.send({
        status: 201,
        message: "Blog created Successfully",
        data: blogDb,
      });
    } catch (error) {
      return res.send({
        status: 500,
        message: "Database error",
        error: error,
      });
    }
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Error",
      error: err,
    });
  }
});

module.exports = { BlogRouter };
