const express = require("express");
const { isAuth } = require("../Middlewares/AuthMiddleware");
const AuthRouter = express.Router();
const User = require("../Models/UserModel"); //User is a our class for userschema
const { cleanUpAndValidate } = require("../utils/AuthUtils");

AuthRouter.get("/register", (req, res) => {
  return res.send(true);
});

AuthRouter.post("/register", async (req, res) => {
  const { name, email, password, username } = req.body;

  //data validation
  try {
    await cleanUpAndValidate({ name, email, password, username });

    //check username and email already exists
    try {
      await User.verifyUsernameAndEmailExits({ email, username }); //this is static fun so we call using class name
    } catch (error) {
      //but we need to pass arg because we not created
      return res.send({
        //obj with new keyword so constructor not called
        status: 400,
        message: "Error Occurred",
        error: error,
      });
    }

    //create user obj and add to db
    const userObj = new User({ name, email, password, username });
    try {
      const userdb = await userObj.registerUser(); //this is non static fun so we call using obj name
      return res.send({
        status: 201,
        message: "user created successfully",
        data: userdb,
      });
    } catch (error) {
      return res.send({
        status: 500,
        message: "Database error",
        error: error,
      });
    }
    return res.send(name);
  } catch (err) {
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: err,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credential",
    });
  }

  try {
    const userDb = await User.loginUser({ loginId, password });

    //session bases authentication
    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.send({
      status: 200,
      message: "User login successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error Occured",
      error: error,
    });
  }
});

AuthRouter.get("/check", async (req, res) => {
  if (req.session.isAuth) {
    res.send(true);
  } else {
    res.send(false);
  }
});
//logout
AuthRouter.get("/logout", isAuth, (req, res) => {
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
});

module.exports = AuthRouter;
