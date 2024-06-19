const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let User = class {
  username;
  name;
  email;
  password;

  constructor({ username, email, password, name }) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const user = new UserSchema({
        username: this.username,
        name: this.name,
        email: this.email,
        password: hashedPassword,
      });

      try {
        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findpeople({currentUserId}) {
    console.log("object",currentUserId+"");
    return new Promise(async (resolve, reject) => {
      try {
        const followingList = await FollowSchema.find({ currentUserId })
        console.log("followingList",followingList);
        // console.log("up",[...followingUserId,currentUserId.currentUserId]);
        let followingUserId = [];
        followingList.forEach((followObj) => {
        followingUserId.push(followObj.followingUserId);
        })
        console.log("ids",followingUserId);
        followingUserId.push(currentUserId+"")
        let followingDetails= await UserSchema.find({
                _id: { $nin: followingUserId }
        })

        console.log(followingDetails);
    if(followingDetails){
        resolve(followingDetails)
    }
        
    } catch (error) {
        reject(error)
    }
    });
  }

  static verifyUsernameAndEmailExits({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email }, { username }], //it is mongoose or operator
        });

        if (userDb && userDb.email === email) {
          reject("Email Already Exit");
        }

        if (userDb && userDb.username === username) {
          reject("Username Already Exit");
        }

        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      //find the user with loginId
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) {
          return reject("User does not exit");
        }

        //match the password
        const isMatch = await bcrypt.compare(password, userDb.password);

        if (!isMatch) {
          reject("Password Does not matched");
        }

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUserId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) {
        //to verify userId type we require  (ObjectId.isValid fun)
        reject("Invalid userId format");
      }

      try {
        const userDb = await UserSchema.findOne({ _id: userId });
        if (!userDb) {
          reject(`No user corresponding to this ${userId}`);
        }
        console.log("userDb",userDb);
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

//server--->controller--->model---->Schema---->mongoose
