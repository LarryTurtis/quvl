import db from '../dao/db';
import permissions from './permissions';

module.exports = (app, passport) => {
  app.post('/auth/facebook/exchange', permissions.verifyFB, passport.authenticate('facebook-exchange'), (req, res) => {
    res.json(req.user);
  });
  app.post('/auth/google/exchange', permissions.verifyGoogle, passport.authenticate('google-exchange'), (req, res) => {
    res.json(req.user);
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  // process the signup form
  app.post('/api/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // process the login form
  app.post('/api/login', passport.authenticate('local-login'), (req, res) => {
    const { user } = req;
    res.json({ user });
  });

  // route for logging out
  app.get('/api/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/login', isLoggedIn, function (req, res) {
    if (req.authenticated) {
      res.json({ loggedIn: true });
    }
    else {
      res.json({ loggedIn: false });
    }
  });

  app.get('/api/profile', isLoggedIn, function (req, res) {
    if (req.authenticated) {
      res.render('pages/profile', { loggedIn: true, user: req.user });
    } else {
      res.redirect("/login");
    }
  });

  app.get('/api/signup', isLoggedIn, function (req, res) {
    if (req.authenticated) {
      res.render('pages/signup', { loggedIn: true });
    } else {
      res.render('pages/signup', { loggedIn: false });
    }
  });

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // facebook -------------------------------

  // send to facebook to do the authentication
  // app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

  // // handle the callback after facebook has authorized the user
  // app.get('/connect/facebook/callback',
  //     passport.authorize('facebook', {
  //         successRedirect: '/profile',
  //         failureRedirect: '/'
  //     }));

  // // google ---------------------------------

  // // send to google to do the authentication
  // app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

  // // the callback after google has authorized the user
  // app.get('/connect/google/callback',
  //     passport.authorize('google', {
  //         successRedirect: '/profile',
  //         failureRedirect: '/'
  //     }));

  // // facebook -------------------------------
  // app.get('/unlink/facebook', function(req, res) {
  //     var user            = req.user;
  //     user.facebook.token = undefined;
  //     user.save(function(err) {
  //         res.redirect('/profile');
  //     });
  // });

  // // twitter --------------------------------
  // app.get('/unlink/twitter', function(req, res) {
  //     var user           = req.user;
  //     user.twitter.token = undefined;
  //     user.save(function(err) {
  //        res.redirect('/profile');
  //     });
  // });

  // // google ---------------------------------
  // app.get('/unlink/google', function(req, res) {
  //     var user          = req.user;
  //     user.google.token = undefined;
  //     user.save(function(err) {
  //        res.redirect('/profile');
  //     });
  // });

  // app.get('/', isLoggedIn, db.getUser);
  app.get('/newdoc', isLoggedIn, function (req, res) {
    if (req.authenticated) {
      res.render('pages/newdoc', { loggedIn: req.authenticated });
    } else {
      res.redirect('/login');
    }
  });
  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      req.authenticated = true;
    return next();
  }
};