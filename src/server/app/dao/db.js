import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
import md5 from 'md5';
import User from '../models/user';
import Doc from '../models/doc';
import Group from '../models/group';
import setRanges from './setRanges';
import wrapTags from './wrapTags';

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

const createUser = (email) =>
  new Promise((resolve, reject) => {
    if (!validator.isEmail(email)) {
      throw new Error('Not a valid email');
    }
    else {
      const user = new User({
        email, picture: `https://www.gravatar.com/avatar/${md5(email)}`
      });
      user.save((err, saved) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(saved);
        }
      });
    }
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
}

function canView(user, doc) {
  const email = user.email;
  return (doc.sharedWith.indexOf(email) >= 0 || doc.authorId === user.userId);
}

function getDoc(authorId, docId) {
  return new Promise((resolve, reject) => {
    Doc.findOne({ authorId, docId }, (err, found) => {
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
      const commentId = doc.comments.length;
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

const getIdsByEmails = (emails) =>
  new Promise((resolve, reject) => {
    User.find({
      email: {
        $in: emails
      }
    }, (err, success) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(success);
      }
    });
  });

const findNewUsers = (emails, users) => {
  const userEmails = users.map(user => user.email);
  return emails.filter(email => userEmails.indexOf(email) < 0);
};

export function findGroups(_id) {
  return new Promise((resolve, reject) => {
    Group.find({ 'members.user': _id })
      .populate({ path: 'members.user', model: 'User', select: 'userId picture email name' })
      .exec((err, success) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(success);
        }
      });
  });
}

const findGroup = (groupId) =>
  new Promise((resolve, reject) => {
    Group.findOne({ groupId })
      .populate({ path: 'members.user', model: 'User', select: 'userId picture email name' })
      .exec((err, group) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(group);
        }
      });
  });

export function createGroup(_id, name, emails) {
  return getIdsByEmails(emails)
    .then(users => {
      const newUsers = findNewUsers(emails, users);
      const promises = newUsers.map(user => createUser(user));
      return Promise.all(promises)
        .then(results => [...results, ...users]);
    })
    .then(members => {
      const memberIds = members.map(member => {
        return { user: member._id, admin: false };
      });
      const group = new Group({
        name,
        members: [...memberIds, { user: _id, admin: true }]
      });
      return new Promise((resolve, reject) => {
        group.save((err, success) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(success.groupId);
          }
        });
      })
        .then(findGroup);
    });
}

const isAdmin = (members, userId) => members.some(member =>
  member.user._id.toString() === userId.toString()
  && member.admin);


const isMember = (members, userId) => members.some(member =>
  member.user._id.toString() === userId.toString());

export function addMember(groupId, member, userId) {
  const group = findGroup(groupId);
  const user = member._id ? findUser(member._id) : createUser(member.email);
  return Promise.all([group, user])
    .then(results => {
      const foundGroup = results[0];
      const foundUser = results[1];
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      foundGroup.members.push({ user: foundUser._id.toString(), admin: false });
      return new Promise((resolve, reject) => {
        foundGroup.save((err, savedGroup) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(groupId);
          }
        });
      });
    }).then(findGroup);
}

export function removeMember(groupId, member, userId) {
  return findGroup(groupId)
    .then(foundGroup => {
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      return new Promise((resolve, reject) =>
        Group.update({ groupId }, { $pull: { members: { user: member._id.toString() } } },
          (err) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(groupId);
            }
          }));
    })
    .then(findGroup);
}

export function promoteMember(groupId, member, userId) {
  return findGroup(groupId)
    .then(foundGroup => {
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      return new Promise((resolve, reject) =>
        Group.update({ groupId, members: { $elemMatch: { user: member._id.toString() } } }, { $set: { 'members.$.admin': true } },
          (err) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(groupId);
            }
          }));
    })
    .then(findGroup);
}


export function demoteMember(groupId, member, userId) {
  return findGroup(groupId)
    .then(foundGroup => {
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      return new Promise((resolve, reject) =>
        Group.update({ groupId, members: { $elemMatch: { user: member._id.toString() } } }, { $set: { 'members.$.admin': false } },
          (err) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(groupId);
            }
          }));
    })
    .then(findGroup);
}

export function createWorkshop(group, date, slots, userId) {
  return findGroup(group)
    .then(foundGroup => {
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      return new Promise((resolve, reject) => {
        const workshop = {
          date,
          slots
        };
        foundGroup.workshops.push(workshop);
        foundGroup.save((err, saved) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(saved);
          }
        });
      });
    });
}
