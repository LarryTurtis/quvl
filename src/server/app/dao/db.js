var User = require('../models/user');
var Doc = require('../models/doc');
var ObjectId = require("mongoose").Types.ObjectId
var crypto = require('crypto');
var validator = require('validator');
var setRanges = require('./setRanges');
var wrapTags = require('./wrapTags');
var counter = 0;
var moment = require('moment');
var sanitizeHtml = require('sanitize-html');

function handleError(err, res) {
  if (err) {
    console.log(err);
    if (res) return res.status(500).send({ "message": "Error!" });
    return true;
  }
  return false;
}


exports.getUser = function(req, res) {
  if (req.user && req.user._id) {
    User.findById(req.user._id)
      .populate({ path: "docs", model: Doc })
      .populate({ path: "docsSharedWithUser", model: Doc })
      .exec(function(err, user) {
        console.log(user);
        if (err) return handleError(err, res);
        res.json({ loggedIn: req.authenticated, user: user })
      });
  } else {
    res.json({ loggedIn: req.authenticated, user: null, message: "" })
  }
}

exports.saveDoc = function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if (err) return handleError(err, res);
    var docId = user.docs.length;
    var doc = new Doc();
    var cleanContent = sanitizeHtml(req.body.doc, {
      allowedAttributes: {
        'a': ['href'],
        '*': ['data-*']
      }
    });
    cleanContent = setRanges(cleanContent);
    var email = req.user.local.email || req.user.google.email || req.user.facebook.email;
    var emails = req.body.sharedWith && req.body.sharedWith.split(",") || [];
    doc.name = req.body.docname || "Untitled_" + Date.now();
    doc.revisions.push({ id: 0, doc: cleanContent });
    doc.docId = docId;
    doc.sharedWith = emails;
    doc.authorId = req.user.userId;
    doc.save(function(err, savedDoc) {
      if (err) return handleError(err, res);
      user.docs.push(savedDoc._id.toString());
      user.save(function(err, savedUser) {
        if (err) return handleError(err, res);
        User.update({ $or: [{ 'local.email': { $in: emails } }, { 'facebook.email': { $in: emails } }, { 'google.email': { $in: emails } }] }, { $push: { docsSharedWithUser: savedDoc._id } }, { multi: true },
          function(err, docs) {
            if (err) return handleError(err, res);
            return res.redirect('/doc/' + req.user.userId + '/' + docId);
          });
      });
    });
  });
}


exports.getOriginalDoc = function(req, res) {

  getDoc(req.params.userId, req.params.docId, doc => {

    if (doc) {

      res.render('pages/doc', { loggedIn: true, name: doc.name, doc: doc.revisions[0], user: req.user, moment: moment });

    } else {

      res.send("Not Found");

    }

  });
}

exports.getDocForCommenting = function(req, res) {

  getDoc(req.params.userId, req.params.docId, doc => {

    var email = req.user.local.email || req.user.google.email || req.user.facebook.email;

    //ensure the doc has been shared with the user, or the user is the owner of the document.
    if (doc && (doc.sharedWith.indexOf(email) >= 0 || doc.authorId === req.user.userId)) {

      var latestRevisionId = doc.revisions.length - 1;
      var revision = doc.revisions[latestRevisionId];

      // use to filter comments
      // doc.comments = doc.comments.filter(comment => {
      //   return comment.authorId === req.user.userId;
      // });

      res.render('pages/doc', { loggedIn: true, name: doc.name, doc: revision.doc, revision: revision.id, comments: doc.comments, user: req.user, moment: moment });
    } else {
      res.send("Not Found");
    }
  });
}

exports.getAggregatedComments = function(req, res) {
  getDoc(req.params.userId, req.params.docId, doc => {
    /*
    strategy: add special comments before and after wrapper tags to make it easy to identify spans
    these should contain the original doc index where they were placed.

    we should go from the end of the doc to the beginning, so that we don't have to worry about the effect
    in place insertions will have on these indexes.

    each time we complete a version update, all of the indexes on the next version will need to be incremented by
    the total number of characters inserted from the previous version. 
     */
  });
}

function getDoc(userId, docId, callback) {
  Doc.findOne({ "authorId": userId, "docId": docId }, function(err, found) {
    if (err) return handleError(err, res);
    if (!found) return handleError(!found, res);
    callback(found);
  });
}


/**
 * This logic will set the proper index in the document (ie. the comments can be sorted by their appearance in the doc.)
 * We step through the document via regex and keep track of the comment ids in the order they first appear. 
 * @type {RegExp}
 */
function sortComments(content) {
  var regex = /data-comment-id="([0-9]+)"/g;
  var seen = {}
  var counter = 0;
  var m;
  do {
    m = regex.exec(content);
    if (m) {
      if (!seen[m[1]]) {
        seen[m[1]] = counter;
        counter++;
      }
    }
  } while (m);

  return seen;
}

exports.updateDoc = function(req, res) {

  //the only doc that a user should be able to directly update is his or her local version.

  //make sure the user has permission to update this doc.
  //also, at some point we need to ensure users who don't own the doc
  //can't mutate it in weird ways.

  getDoc(req.params.userId, req.params.docId, doc => {
    if (doc) {

      //temporary hack. we will do a foreign lookup on these later. right now we store the same 
      //value over and over again.
      var commentId = doc.comments && doc.comments.length;
      var authorId = req.user.userId;
      var email = req.user.local.email || req.user.google.email || req.user.facebook.email;
      var picture = req.user.local.picture || req.user.google.picture || req.user.facebook.picture;

      doc.comments.push({ commentId: commentId, authorId: authorId, author: email, picture: picture, content: req.body.comment });

      var newRevision = createNewRevision(doc, req.body.revision, JSON.parse(req.body.nodes), commentId, authorId);

      doc.revisions.push(newRevision);

      doc.save(function(err) {
        if (err) return handleError(err, res);
        res.status(200).json(doc);
      });
    } else {
      res.send("Not found");
    }
  });
}

function createNewRevision(doc, workingRevisionId, operations, commentId, authorId) {

  var latestRevisionId = doc.revisions.length - 1;
  var saved = doc.revisions[latestRevisionId].doc;
  var working = doc.revisions[workingRevisionId].doc;

  var id = latestRevisionId += 1;
  var requested = wrapTags.wrap(saved, operations);
  requested = requested.replace(/data-comment-id="\*"/g, 'data-comment-id="' + commentId + '"');
  requested = requested.replace(/data-author-id="\*"/g, 'data-author-id="' + authorId + '"');

  var newRevision = { id: id, doc: requested, operations: operations }

  return newRevision;

}

exports.findToken = function(token, done) {
  User.findOne({ access_token: token },
    function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false)
      return done(null, user, { scope: 'all' })
    }
  );
}

exports.saveUserEmail = function(req, res) {
  if (validator.isEmail(req.body.email)) {
    Email.findOne({ address: req.body.email }, function(err, result) {
      if (handleError(err, res)) return;
      if (handleError(result, res)) return;
      var email = new Email();
      email.address = req.body.email;
      return email.save(function(err) {
        if (handleError(err, res)) return;
        res.status(200).json({ "message": "success" });
      });
    })
  } else {
    return res.status(400).json({});
  }
}