const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String },
  providerId: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
