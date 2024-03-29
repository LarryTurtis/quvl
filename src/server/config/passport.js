import User from '../app/models/user';

const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const md5 = require('md5');
// load up the user model
const configAuth = require('../config/auth.js');

// var credentials = require('./credentials');

// expose this function to our app using module.exports
module.exports = (passport) => {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    (req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ email }, (err, user) => {
          if (err) {
            return done(err);
          }

          const newUser = user || new User();
          const url = `https://www.gravatar.com/avatar/${md5(email)}`;
          // set the user's local credentials
          newUser.email = email;
          newUser.picture = url;
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.picture = url;

          // save the user
          return newUser.save((error) => {
            if (error) {
              throw error;
            }
            return done(null, newUser);
          });
        });
      });
    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email': email }, function (err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
      });

    }));


  // code for login (use('local-login', new LocalStategy))
  // code for signup (use('local-signup', new LocalStategy))

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  },

    // facebook will send back the token and profile
    function (req, token, refreshToken, profile, done) {

      const email = profile.emails && profile.emails[0].value;

      // asynchronous
      process.nextTick(function () {

        // check if the user is already logged in
        if (!req.user) {

          // find the user in the database based on their facebook id
          User.findOne({ email }, function (err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
              return done(err);

            // if the user is found, then log them in
            if (user && user.facebook.email) {
              return done(null, user); // user found, return that user
            } else {
              // if there is no user found with that facebook id, create them
              var newUser = user || new User();
              console.log(profile);
              // set all of the facebook information in our user model
              newUser.facebook.id = profile.id; // set the users facebook id                   
              newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.facebook.email = email; // facebook can return multiple emails so we'll take the first
              newUser.email = email;
              newUser.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=square";
              newUser.facebook.picture = "https://graph.facebook.com/" + profile.id + "/picture?type=square";
              console.log(profile);

              // save our user to the database
              newUser.save(function (err) {
                if (err)
                  throw err;

                // if successful, return the new user
                return done(null, newUser);
              });
            }

          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = email;
          user.email = email;

          // save the user
          user.save(function (err) {
            if (err)
              throw err;
            return done(null, user);
          });
        }

      });

    }));

  passport.use(new GoogleStrategy({

    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
    function (req, token, refreshToken, profile, done) {

      const email = profile.emails[0].value;

      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function () {

        if (!req.user) {

          // try to find the user based on their google id
          User.findOne({ email }, function (err, user) {
            if (err)
              return done(err);

            if (user && user.google) {

              // if a user is found, log them in
              return done(null, user);
            }
            else {
              // if the user isnt in our database, create a new user
              console.log(profile);
              var newUser = user || new User();

              // set all of the relevant information
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.name = profile.displayName;
              newUser.google.email = email; // pull the first email
              newUser.email = email; // pull the first email
              newUser.google.picture = profile._json.image.url;
              newUser.picture = profile._json.image.url;

              // save the user
              newUser.save(function (err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.google.id = profile.id;
          user.google.token = token;
          user.google.name = profile.displayName;
          user.google.email = email;
          user.email = email;

          // save the user
          user.save(function (err) {
            if (err)
              throw err;
            return done(null, user);
          });
        }
      });
    }));

};