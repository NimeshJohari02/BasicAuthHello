const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authfun = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "NewSecretToken");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    req.currToken = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ Error: "Please Enter Valid Auth" });
  }
};
module.exports = authfun;
