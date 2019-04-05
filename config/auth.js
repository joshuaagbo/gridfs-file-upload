const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {
  User
} = require('../model/schema');
const {
  google
} = require('./keys');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: google.GOOGLE_CLIENT_ID,
      clientSecret: google.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4300',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      // done(profile);
    }));
};