// const { BLOGLIMIT } = require("../privateConstants");
const { reject } = require("bcrypt/promises");
const BlogSchema = require("../Schemas/BlogSchema");
const FollowSchema = require("../Schemas/FollowSchema");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDateTime;
  username;
  img;

  constructor({ title, textBody, userId, creationDateTime,username,img }) {
    this.title = title;
    this.creationDateTime = creationDateTime;
    this.textBody = textBody;
    this.userId = userId;
    this.username = username;
    this.img = img;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new BlogSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
        username: this.username,
        img:this.img
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogs({ userId }) {
    console.log(userId);
    let BLOGLIMIT= parseInt(100)
    return new Promise(async (resolve, reject) => {
      //sort, pagination

      let followingUserId = [];
      try {
        const followingList = await FollowSchema.find({ currentUserId:userId })
            followingList.forEach((followObj) => {
            followingUserId.push(followObj.followingUserId);
            })
      } catch (error) {
        reject(error)
      }
      try {
        
        const blogsDb = await BlogSchema.find({userId:{$in:followingUserId}});
        console.log(blogsDb);
        resolve(blogsDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static myBlogs({ page, userId }) {
    let BLOGLIMIT= parseInt(10)
    return new Promise(async (resolve, reject) => {
      //match, sort, pagination
      // console.log(page, userId);
      // console.log(new ObjectId(userId));
      try {
        const myBlogsDb = await BlogSchema.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: (parseInt(page)-1) * BLOGLIMIT }, { $limit: BLOGLIMIT }],
            },
          },
        ]);

        // alternative for aggregate
        // const myBlogsData = await Blog.find(userId).sort({creationDateTime: -1}).skip (parseInt(page) - 1).limit (LIMIT);

        console.log(myBlogsDb[0].data);

        resolve(myBlogsDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteBlog({ blogId }) {

    return new Promise (async(resolve,reject)=>{
      try {
        const myBlogsDb= await BlogSchema.deleteOne({ _id: blogId });
        resolve(myBlogsDb);
      }catch (err) {
        reject(err);
      }
    })
  }

  static checkAndEditBlog({ blogId,title, textBody,userId }) {

    return new Promise (async(resolve,reject)=>{
      try {
        let blogData = await BlogSchema.findById(blogId);
        console.log(blogData);
        if (!blogData) {
          reject({
            status: 400,
            message: "blog is already deleted",
            });
        }
        // compare the owner and the user making the request to edit
        if (!(blogData.userId.toString() === userId.toString())) {
          reject({
            status: 401,
            message: "Not allowed to edit, Authorization failed!",
            });
        }
      
          //compare the time, if it's in the 30 mins bracket
        const creationDateTime = new Date(blogData.creationDateTime).getTime();
        const currentDateTime = Date.now();
        const diff = (currentDateTime - creationDateTime) / (1000 * 60);
        console.log(creationDateTime);
        console.log(currentDateTime);
        if (diff > 30) {
          reject({
            status: 400,
            message: "Not allowed to edit, because 30mins exceeds",
            });
        }
      
        blogData= await BlogSchema.findOneAndUpdate({ _id: blogId }, {title,textBody});
        resolve(blogData);
        }catch (err) {
          reject({
            status: 400,
            message: "db error, unable to edit",
            error:err
            });
      }
    })
  }
};

module.exports = Blogs;
