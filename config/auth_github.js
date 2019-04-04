const passport = require('passport')
const GithubStrategy = require('passport-github').Strategy;
const {
  User
} = require('../model/schema');
const {
  github
} = require('./keys');

function github_Strategy() {
  passport.use(new GithubStrategy({
      clientID: github.GITHUB_CLIENT_ID,
      clientSecret: github.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:4300/auth/github/callback',
    },
    () => {
      console.log('Now authenticated with your github account');
    }));
};