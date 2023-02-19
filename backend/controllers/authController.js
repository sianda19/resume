const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // Create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Change to 1h for production
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "14d" } // Change to 14 days for production
    );

    // Save refreshToken with current user in DB
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
