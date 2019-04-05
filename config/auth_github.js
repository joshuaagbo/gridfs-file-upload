const GitHubStrategy = require('passport-github').Strategy;
const {
  User
} = require('../model/schema');
const {
  github
} = require('./keys');

module.exports = (passport) => {
  passport.use(new GitHubStrategy({
      clientID: github.GITHUB_CLIENT_ID,
      clientSecret: github.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:4300/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user exist;
      User.findOne({
          providerId: profile.id
        })
        .then(user => {
          if (user) {
            return done(null, false, {
              message: 'This email is already used'
            });
          } else {
            // CREATE NEW USER Nd SAVE
            new User({
                username: profile.displayName,
                provider: profile.provider,
                providerId: profile.id
              })
              .save()
              .then((user) => {
                return done(null, user);
              })
              .catch(err => done(err, null));
          }
        })
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  });

};