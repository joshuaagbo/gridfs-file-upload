const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {
  User
} = require('../model/schema');
const {
  google
} = require('./keys');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: google.GOOGLE_CIENT_SECRET,
      clientSecret: google.GOOGLE_CIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
    }));
};