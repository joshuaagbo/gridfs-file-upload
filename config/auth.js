const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {
  User
} = require('../model/schema');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
      clientID: '62476368478-om3mvedac5uocqger55re84uhcc643p0.apps.googleusercontent.com',
      clientSecret: 'AIzaSyBBZdTYNGyruO1ySgrQkcON3EGViUx8mMc',
      callbackURL: 'http://localhost:4300/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken, refreshToken, profile, done);
      // return done(null, profile)
      User.findOrCreate({
        googleId: profile.id
      }, (err, user) => {
        console.log('Error: ', err);
        console.log('User: ', user);
        return done(err, user);
      })
    }));
};