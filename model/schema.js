const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  user: {
    type: Object
  }
});

const User = mongoose.model('User', userSchema);
module.exports = {
  User
};