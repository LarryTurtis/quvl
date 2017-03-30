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

function canView(user, doc) {
  const email = user.email;
  return (doc.sharedWith.indexOf(email) >= 0 || doc.authorId === user.userId);
}

function getDoc(authorId, docId) {
  return new Promise((resolve, reject) => {
    Doc.findOne({ authorId, docId }, (err, found) => {
      console.log(err, found, 'getting doc')
      if (err) {
        reject(err);
      }
      else {
        resolve(found);
      }
    });
  });
}

export function getDocForCommenting(user, authorId, docId) {
  return getDoc(authorId, docId)
    .then(doc => {
      if (canView(user, doc)) {
        return doc;
      }
      throw new Error('Unauthorized');
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

function createNewRevision(requested, operations, commentId, authorId) {
  const latestRevisionId = requested.revisions.length - 1;
  const saved = requested.revisions[latestRevisionId].doc;
  const id = latestRevisionId + 1;

  let doc = wrapTags(saved, operations);
  doc = doc.replace(/data-comment-id="\*"/g, 'data-comment-id="' + commentId + '"');
  doc = doc.replace(/data-author-id="\*"/g, 'data-author-id="' + authorId + '"');

  return { id, doc, operations };
}

export function updateDoc(authorId, docId, user, nodes, content) {
  return getDocForCommenting(user, authorId, docId)
    .then(doc => {
      const commentId = doc.comments.length - 1;
      const newRevision = createNewRevision(doc, nodes, commentId, authorId);

      doc.comments.push({ commentId, authorId, docId, content });
      doc.revisions.push(newRevision);

      return new Promise((resolve, reject) => {
        doc.save((err, success) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(success);
          }
        });
      });
    });
}