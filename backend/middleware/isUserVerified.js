const User = require("../model/User");

const isUserVerified = async (req, res, next) => {
  const user = req.user; // Received from verifyJWT middleware
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser.isVerified) {
    return res.sendStatus(403);
  } else {
    next();
  }
};

module.exports = isUserVerified;
