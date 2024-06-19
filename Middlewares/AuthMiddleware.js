const isAuth = (req, res, next) => {
  // console.log("next",next);
  // console.log("ses",req.session);
  // if (req.session.isAuth) {
  //   next();
  // } else {
  //   return res.send({
  //     status: 400,
  //     message: "Invalid Session, Please login Again",
  //   });
  // }
  next();
};

module.exports = { isAuth };
