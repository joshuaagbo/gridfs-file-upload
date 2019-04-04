const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String
  },
  provd_Id: {
    type: String
  },
  provider: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};