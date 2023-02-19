const User = require("../model/User");
const Token = require("../model/Token");

const verifyUser = async (req, res) => {
  if (!req?.params?.email) {
    return res.status(400).json({ error: `An email parameter is required` });
  }
  if (!req?.params?.token) {
    return res
      .status(400)
      .json({ error: `A verification token parameter is required` });
  }

  const email = req.params.email;
  const token = req.params.token;

  // Check for email in tokens collection in DB
  const foundUser = await Token.findOne({ email: email }).exec();
  if (!foundUser)
    return res
      .status(403)
      .json({ error: `User with email ${email} not found` });

  try {
    // Check if the verification tokens match
    const isMatching = token === foundUser.verifyToken;

    if (isMatching) {
      // Set the user as verified
      const userDocument = await User.findOne({ email: email }).exec();
      userDocument.isVerified = true;
      await userDocument.save();

      // Delete the verified user's document from the tokens collection
      await Token.deleteOne({ email: email });
    } else {
      return res.sendStatus(403);
    }

    res
      .status(201)
      .json({ success: `User with email ${email} has been verified!` });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { verifyUser };
