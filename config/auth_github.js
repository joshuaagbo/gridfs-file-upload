const GoogleStrategy = require('passport-github').Strategy;
const {
  User
} = require('../model/schema');
const {
  github
} = require('./keys');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: github.GOOGLE_CIENT_SECRET,
      clientSecret: github.GOOGLE_CIENT_SECRET,
      callbackURL: 'http://localhost:4300/auth/github/callback',
    },
    () => {
      console.log('Now authenticated with your github account');
    }));
};