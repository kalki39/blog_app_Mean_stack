const express = require("express");
const Blogs = require("../Models/BlogModel");
const User = require("../Models/UserModel");
const { BlogDataValidate } = require("../utils/BlogUtils");
const { date } = require("joi");
const BlogRouter = express.Router();


const createBlog = async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.params.userId;
  const creationDateTime = new Date();

  //data valdation
  try {
    await BlogDataValidate({ title, textBody, userId });
    let user;
    try {
       user=await User.verifyUserId({ userId });
    } catch (error) {
      return res.send({
        status: 400,
        message: "UserId issue",
        error: error,
      });
    }
    console.log(user.username);
    const blogObj = new Blogs({ title, textBody, userId, creationDateTime,username:user.username,img:user.img });

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
  } catch (err) {
    return res.send({
      status: 400,
      message: "Data Error",
      error: err,
    });
  }
}

const getMyBlogs = async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const LIMIT = 10;
    try {
      const myBlogsData = await Blogs.myBlogs({page,userId})

      return res.status(200).send({
        status: 200,
        message: "succesfully got my blog",
        date:myBlogsData
        })
    }catch (err) {
      return res.status(400).send({
      status: 400,
      message: "Failed to get the blogs!"
      })
  }
}

const getBlogs = async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const LIMIT = 10;
    try {
      const myBlogsData = await Blogs.getBlogs({userId})

      return res.status(200).send({
        status: 200,
        message: "succesfully got all blog",
        date:myBlogsData
        })
    }catch (err) {
      return res.status(400).send({
      status: 400,
      message: "Failed to get the blogs!",
      err:err
      })
  }
}
const deleteBlog = async (req, res) => {
  // const userId = req.session.user.userId;
  // const blogId = req.params.blogId;
  const { blogId=req.body._id}=req.body;
    try {
      const myBlogsData = await Blogs.deleteBlog({blogId})

      return res.status(200).send({
        status: 200,
        message: "Blog succesfully deleted",
        date:myBlogsData
        })
    }catch (err) {
      return res.status(400).send({
      status: 400,
      message: "Failed to delete the blog!"
      })
  }
}

const editBlog =async (req, res) => {
  const { blogId=req.body._id, title, textBody ,userId} = req.body;
  // const userId = req.params.userId;
  try {
    const blogData = await Blogs.checkAndEditBlog({blogId,title,textBody,userId});

    res.status(201).send({
    status: 201,
    message: "Blog edited successfully!",
    data:blogData
    });
  }catch (err) {
    return res.status(err?.status).send({
      status: err?.status,
      message: err?.message,
      error:err?.error
      }); I
  }
  };


module.exports = { createBlog, getMyBlogs, deleteBlog,editBlog,getBlogs };
