const express = require("express");
const clc = require("cli-color");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoDbSession = require("connect-mongodb-session")(session);
require("dotenv").config();

//file-imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

const server = express();
const PORT = process.env.PORT;

// Middleware for CORS
server.use(cors({
  origin: 'http://localhost:4200', // Replace with the URL of your Angular app
  credentials: true,
}));

//middlwares
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
const { isAuth } = require("./Middlewares/AuthMiddleware");
const UserRouter = require("./routes/user.routes");
const BlogRouter = require("./routes/blog.routes");
const FollowRouter = require("./routes/follow.routes");

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
// server.use("/auth", AuthRouter);
server.use("/",UserRouter);
server.use("/", isAuth, BlogRouter);
server.use("/", isAuth, FollowRouter);
server.listen(PORT, (req, res) => {
  console.log(clc.yellow.underline(`Serrver is running on ${PORT}`));
});
