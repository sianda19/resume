const User = require("../model/User");
const Token = require("../model/Token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationMail = require("../utils/sendVerificationMail");

const handleNewUser = async (req, res) => {
  const { user, pwd, email } = req.body;
  if (!user || !pwd || !email)
    return res.status(400).json({
      error: "One or more fields (username, password, email) is/are missing",
    });

  // Check for duplicate users in DB
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create and store the new user
    await User.create({
      username: user,
      email: email,
      password: hashedPwd,
    });

    const verificationToken = jwt.sign(
      { email: email },
      process.env.VERIFICATION_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Store the verification token corresponding to the user in DB
    await Token.create({
      email: email,
      verifyToken: verificationToken,
    });

    // Send email with verification link
    sendVerificationMail(email, verificationToken);
    res
      .status(201)
      .json({ success: `New user ${user} with email id ${email} created!` });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { handleNewUser };
