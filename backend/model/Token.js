const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  verifyToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
