//return driver matches for the user
var permissions = require("./permissions.js");
var db = require("../dao/db.js");
var fs = require("fs");
var multer = require('multer')
var upload = multer({ storage: multer.memoryStorage({}) })
var path = require('path');
var appDir = path.dirname(require.main.filename);

module.exports = function(app, passport) {
    app.post('/save', isLoggedIn, db.saveDoc);
    app.get('/doc/:userId/:docId', isLoggedIn, db.getDocForCommenting);
    app.post('/doc/:userId/:docId', isLoggedIn, db.updateDoc);
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
}