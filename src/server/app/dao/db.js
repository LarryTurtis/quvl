import validator from 'validator';
import moment from 'moment';
import sanitizeHtml from 'sanitize-html';
import User from '../models/user';
import Doc from '../models/doc';
import setRanges from './setRanges';
import wrapTags from './wrapTags';

function handleError(err, res) {
  if (err) {
    console.log(err);
    if (res) return res.status(500).send({ 'message': 'Error' });
    return true;
  }
  return false;
}

export function getUser(req, res) {
  if (req.user && req.user._id) {
    User.findById(req.user._id)
      .populate({ path: 'docs', model: Doc })
      .populate({ path: 'docsSharedWithUser', model: Doc })
      .exec((err, user) => {
        if (err) return handleError(err, res);
        res.json({ loggedIn: req.authenticated, user })
      });
  }
  else {
    res.json({ loggedIn: req.authenticated, user: null, message: '' })
  }
};

const findUser = (id) =>
  new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(user);
      }
    });
  });

export function listDocs(authorId) {
  return new Promise((resolve, reject) => {
    Doc.find({ authorId }, (err, docs) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(docs);
      }
    });
  });
}


const saveNewDoc = (user, name, content, sharedWith) =>
  new Promise((resolve, reject) => {
    const cleanContent = sanitizeHtml(content, {
      allowedAttributes: {
        'a': ['href'],
        '*': ['data-*']
      }
    });
    const rangedContent = setRanges(cleanContent);
    const doc = new Doc({
      revisions: [{ id: 0, doc: rangedContent }],
      sharedWith,
      name,
      authorId: user.userId
    });
    doc.save((err, saved) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(saved);
      }
    });
  });

const shareDocWithUsers = (emails, docId) =>
  new Promise((resolve, reject) => {
    User.update({
      $or: [
        { 'local.email': { $in: emails } },
        { 'facebook.email': { $in: emails } },
        { 'google.email': { $in: emails } }
      ]
    },
      { $push: { docsSharedWithUser: docId } },
      { multi: true },
      (err, docs) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(docs);
        }
      });
  });


export function saveDoc(req, res) {
  let id;
  findUser(req.user._id)
    .then(user => {
      const name = req.body.name || `Untitled_${Date.now()}`;
      const content = req.body.doc;
      const shared = (req.body.sharedWith && req.body.sharedWith.split(',')) || [];
      return saveNewDoc(user, name, content, shared);
    })
    .then(saved => {
      id = saved.docId;
      return shareDocWithUsers(id);
    })
    .then(() => {
      res.json({ id });
    });
};

export function getOriginalDoc(req, res) {

  getDoc(req.params.userId, req.params.docId, doc => {

    if (doc) {

      res.render('pages/doc', { loggedIn: true, name: doc.name, doc: doc.revisions[0], user: req.user, moment: moment });

    } else {

      res.send("Not Found");

    }

  });
}

export function getDocForCommenting(req, res) {

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

export function getAggregatedComments(req, res) {
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
  Doc.findOne({ "authorId": userId, "docId": docId }, function (err, found) {
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

export function updateDoc(req, res) {

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

      doc.save(function (err) {
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

export function findToken(token, done) {
  User.findOne({ access_token: token },
    function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false)
      return done(null, user, { scope: 'all' })
    }
  );
}

export function saveUserEmail(req, res) {
  if (validator.isEmail(req.body.email)) {
    Email.findOne({ address: req.body.email }, function (err, result) {
      if (handleError(err, res)) return;
      if (handleError(result, res)) return;
      var email = new Email();
      email.address = req.body.email;
      return email.save(function (err) {
        if (handleError(err, res)) return;
        res.status(200).json({ "message": "success" });
      });
    })
  } else {
    return res.status(400).json({});
  }
}