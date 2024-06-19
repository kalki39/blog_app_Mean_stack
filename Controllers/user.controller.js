const User = require("../Schemas/UserSchema");
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const UserSchema = require("../Schemas/UserSchema");


const registerUser = async (req, res) => {
    // console.log(req.session);
    
    const { name, email, password, username } = req.body;
    console.log(req.body);

        const isValid = Joi.object({
            name: Joi.string().required(),
            username: Joi.string().min(3).max(30).alphanum().required(),
            password: Joi.string().min(8).required(),
            email: Joi.string().email().required(),
        }).validate(req.body, {abortEarly: false, allowUnknown: false });
        if (isValid.error) {
            return res.send({
                status: 400,
                message: "Invalid Input",
                data: isValid.error,
            });
        }
//check email pr username already registered
    try {
        await verifyUsernameAndEmailExits({ email, username }); 
    } catch (error) {
      //but we need to pass arg because we not created
      return res.send({
        //obj with new keyword so constructor not called
        status: 400,
        message: error,
        error: error,
      });     
    }    
    const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT));
    const img = `https://robohash.org/${Math.random().toString(36).substring(7)}.png`;

    const userObj = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            img
    });

    try {
        const userdb = await userObj.save();
        res.send({
            status: 201,
            message: "User created successfully!",
            data:userdb
        });
        } catch (err) {
            res.send({
            status: 400,
            message: "User created failed!",
            data:err
        })
     }

        // return res.send({
        //     status: 200,
        //     message: "valid Input",
        //     data: isValid.error,
        // });
};

const alluser = async(req, res) => {
    const userId=req.params.userId
    let userData;
    try {
        // const userDb = await checkloginUserdata({ loginId, password });
        const userDb = await UserModel.findpeople({currentUserId:userId})
        //session bases authentication


        return res.send({
        status: 200,
        message: "User data got sucessfully",
        data: userDb,
        });
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: "No user found! Please register or check your credentials",
            data:err
        });
    }
    
};

const loginUser = async(req, res) => {
    const {loginId, password } = req.body;
    console.log(req.body);
    let userData;
    try {
        const userDb = await checkloginUserdata({ loginId, password });

        //session bases authentication
        // req.session.isAuth = true;
        // req.session.user = {
        // username: userDb.username,
        // email: userDb.email,
        // userId: userDb._id,
        // };

        return res.send({
        status: 200,
        message: "User login successfully",
        data: userDb,
        });
    }catch(err){
        return res.send({
            status: 400,
            message: err,
            data:err
        });
    }
    
};

    function verifyUsernameAndEmailExits({ email, username }) {
        return new Promise(async (resolve, reject) => {
          try {
            const userDb = await User.findOne({
              $or: [{ email }, { username }], //it is mongoose or operator
            });
            // console.log("uu",userDb);
            if (userDb && userDb.email === email) {
              reject("Email Already Exist");
            }
    
            if (userDb && userDb.username === username) {
              reject("Username Already Exist");
            }
    
            return resolve();
          } catch (error) {
            reject(error);
          }
        });
      }

      function checkloginUserdata({ loginId, password }) {
        return new Promise(async (resolve, reject) => {
          //find the user with loginId
          try {
            const userDb = await User.findOne({
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

   const logoutUser = (req, res) =>{
    const user = req.session.user;

    req.session.destroy((err) => {
      if (err) {
        return res.send({
          status: 400,
          message: "Logout unsuccessfull",
          error: err,
        });
      }
  
      return res.send({
        status: 200,
        message: "Logout Sucessfully",
        data: user,
      });
    });
   }   
module.exports = {registerUser,loginUser,logoutUser,alluser}