const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");
//google auth
passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.Redirect_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let email = profile.emails[0].value;
      let newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: email,
        status: "Active",
      };
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          const createdUser = await User.create(newUser);
          done(null, createdUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
//facebook auth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_APP_CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let email = profile.emails[0].value;

      let newUser = {
        facebookId: profile.id,
        name: profile.displayName,
        email: email,
        status: "Active",
      };
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
          done(null, user);
        } else {
          const createdUser = await User.create(newUser);
          done(null, createdUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


module.exports = passport;
