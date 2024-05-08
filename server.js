const express = require("express");
const clc = require("cli-color");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
require("dotenv").config();

//file-imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");
const { BlogRouter } = require("./Controllers/BlogController");

const server = express();
const PORT = process.env.PORT;

//middlwares
server.use(express.json());
const { isAuth } = require("./Middlewares/AuthMiddleware");

const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

server.use(
  session({
    secret: process.env.SECRECT_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//routes

server.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Welcome to your blogging app",
  });
});

server.use("/auth", AuthRouter);
server.use("/blog", isAuth, BlogRouter);

server.listen(PORT, (req, res) => {
  console.log(clc.yellow.underline(`Server is running on ${PORT}`));
});
