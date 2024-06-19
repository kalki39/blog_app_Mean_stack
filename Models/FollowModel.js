const { reject } = require("bcrypt/promises");
const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const ObjectId = require("mongodb").ObjectId;

const Follow = class {
  currentUserId;
  followersUserId;
  creationDateTime;

  constructor({ currentUserId, followersUserId,  creationDateTime }) {
    this.currentUserId = currentUserId;
    this.creationDateTime = creationDateTime;
    this.followersUserId = followersUserId;
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
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static checkuserAlreadyFollowing({ currentUserId, followingUserId }){
    return new Promise(async(resolve,reject)=>{
        try {
        const followObj = await FollowSchema.findOne({ currentUserId, followingUserId });

        if(followObj){
            // reject(`${followObj.name} is already following by you`)
            console.log("ss",followObj);
            resolve(followObj);   
        }else{
            resolve(false);
        }
        } catch (error) {
            reject(error)
        }
    })
  }

  static followAndSave({ currentUserId, followingUserId }){
    return new Promise(async(resolve,reject)=>{
        try {
        const followObj = new FollowSchema({ currentUserId, followingUserId });

        await followObj.save();

        if(followObj){
            resolve(followObj)
        }
            
        } catch (error) {
            reject(error)
        }
    })
  }
  static unfollowAndSave({ currentUserId, followingUserId }){
    return new Promise(async(resolve,reject)=>{
        try {
        const unfollowObj = await FollowSchema.deleteOne({ currentUserId, followingUserId });

        if(unfollowObj){
            resolve(unfollowObj)
        }
            
        } catch (error) {
            reject(error)
        }
    })
  }

  static getFollowingDetails({ currentUserId,page,LIMIT }){
    // console.log(currentUserId,page,LIMIT)
    return new Promise(async(resolve,reject)=>{
        try {
            const followingList = await FollowSchema.find({ currentUserId })
            .sort({
            creationDateTime: -1,
            })
            .skip((parseInt(page) - 1)* LIMIT)
            .limit(LIMIT);

            console.log("followingList",followingList);
            let followingUserId = [];
            followingList.forEach((followObj) => {
            followingUserId.push(followObj.followingUserId);
            })
            let followingDetails= await UserSchema.find({
                    _id: { $in: followingUserId }
            })

        if(followingDetails){
            resolve(followingDetails)
        }
            
        } catch (error) {
            reject(error)
        }
    })
  }
  static getFollowersDetails({ currentUserId,page,LIMIT }){
    // console.log(currentUserId,page,LIMIT)
    return new Promise(async(resolve,reject)=>{
        try {
            const followersList = await FollowSchema.find({ followingUserId:currentUserId })
            .sort({
            creationDateTime: -1,
            })
            .skip((parseInt(page) - 1)* LIMIT)
            .limit(LIMIT);

            console.log("followersList",followersList);
            let followersUserId = [];
            followersList.forEach((followObj) => {
            // followersUserId.push(new ObjectId(followObj.followersUserId));
            followersUserId.push(followObj.currentUserId);
            })
            // console.log("followersUserId",followersUserId);
            // const followersDetails = await UserSchema.aggregate([
            //     {
            //         $match: {
            //           _id: { $in: userIds }
            //         }
            //       }
            //     // {
            //     // $match: {
            //     // _id: { $in: followersUserId },
            //     // }, I
            //     // },
            //     ]); 

            let followersDetails= await UserSchema.find({
                    _id: { $in: followersUserId }
                  })

            // console.log("followersDetails",followersDetails);

        if(followersDetails){
            resolve(followersDetails)
        }
            
        } catch (error) {
            reject(error)
        }
    })
  }
}

module.exports = Follow;