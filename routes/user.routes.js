const express = require("express");
const { isAuth } = require("../Middlewares/AuthMiddleware");
const UserRouter = express.Router();
const User = require("../Models/UserModel");
const { registerUser, loginUser, logoutUser, alluser } = require("../Controllers/user.controller");


UserRouter.post("/register",registerUser)
UserRouter.post("/login",loginUser)
UserRouter.post("/logout",isAuth,logoutUser)
UserRouter.get("/alluser",isAuth,alluser)
UserRouter.get("/findpeople/:userId",isAuth,alluser)
UserRouter.get("/rr",(req, res) => {
    return res.send(true);
})


module.exports = UserRouter;