import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
import md5 from 'md5';
import mongoose from 'mongoose';
import User from '../models/user';
import Doc from '../models/doc';
import Group from '../models/group';
import setRanges from './setRanges';
import wrapTags from './wrapTags';

const ObjectId = mongoose.Schema.ObjectId;

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

const findUserByEmail = (email) =>
  new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(user);
      }
    });
  });

const createUser = (email) =>
  findUserByEmail(email).then(user => {
    if (!user) {
      return new Promise((resolve, reject) => {
        if (!validator.isEmail(email)) {
          throw new Error('Not a valid email');
        }
        else {
          const newUser = new User({
            email, picture: `https://www.gravatar.com/avatar/${md5(email)}`
          });
          newUser.save((err, saved) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(saved);
            }
          });
        }
      });
    }
    return user;
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

function isMemberOfGroup(userId, groupId) {
  return new Promise(resolve => {
    Group.findOne({ groupId, 'members.user': userId }, (err, doc) => {
      resolve(err || doc);
    });
  });
}

function canView(user, doc) {
  if (doc.authorId === user.userId) {
    return new Promise(resolve => resolve(true));
  }
  const promises = doc.sharedWith.map(groupId => isMemberOfGroup(user._id, groupId));
  return Promise.all(promises).then(results => results.some(x => x));
}

function getDoc(authorId, docId) {
  return new Promise((resolve, reject) => {
    Doc.findOne({ authorId, docId })
      .populate({ path: 'comments.author', model: 'User', select: 'userId picture email name' })
      .exec((err, found) => {
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
  let foundDoc;
  return getDoc(authorId, docId)
    .then(doc => {
      foundDoc = doc;
      return canView(user, foundDoc);
    })
    .then(foundUser => {
      if (foundUser) {
        return foundDoc;
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
  doc = doc.replace(/data-id="\*/g, `data-id="${authorId}-${commentId}`);

  return { id, doc, operations };
}

export function updateDoc(authorId, docId, user, nodes, content) {
  return getDocForCommenting(user, authorId, docId)
    .then(doc => {
      const commentId = doc.comments.length;
      const newRevision = createNewRevision(doc, nodes, commentId, authorId);

      doc.comments.push({ commentId, author: user._id.toString(), docId, content });
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
      })
        .then(saved => saved.populate({ path: 'comments.author', model: 'User', select: 'userId picture email name' })
          .execPopulate());
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
  const dupes = {};
  const userEmails = users.map(user => user.email);
  return emails.filter(email => {
    const ok = !dupes[email] && userEmails.indexOf(email) < 0;
    dupes[email] = true;
    return ok;
  });
};

export function findGroups(_id) {
  return new Promise((resolve, reject) => {
    Group.find({ 'members.user': _id })
      .populate({ path: 'members.user', model: 'User', select: 'userId picture email name' })
      .populate({ path: 'workshops.members.user', model: 'User', select: 'userId picture email name' })
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
      .populate({ path: 'workshops.members.user', model: 'User', select: 'userId picture email name' })
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
  const user = createUser(member.email);
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
  // need to ensure creator always remains admin and can't demote himself (or be demoted)
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

export function addMemberToWorkshop(group, workshopId, userId) {
  return new Promise((resolve, reject) => {
    Group.findOneAndUpdate(
      {
        groupId: group,
        'members.user': userId,
        'workshops._id': workshopId,
        workshops: {
          $elemMatch: {
            'members.user': { $ne: userId }
          }
        }
      },
      {
        $push: {
          'workshops.$.members': { user: userId }
        }
      },
      {
        new: true
      },
      (err, doc) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      }
    );
  })
    .then(saved => {
      if (saved) {
        const populateQuery = [
          { path: 'members.user', model: 'User', select: 'userId picture email name' },
          { path: 'workshops.members.user', model: 'User', select: 'userId picture email name' }
        ];
        return saved.populate(populateQuery).execPopulate();
      }
      return null;
    });
}

export function cancelWorkshop(groupId, workshopId, userId) {
  return findGroup(groupId)
    .then(foundGroup => {
      if (!isAdmin(foundGroup.members, userId)) {
        throw Error('Not Authorized');
      }
      return new Promise((resolve, reject) =>
        Group.update({ groupId }, { $pull: { workshops: { _id: workshopId } } },
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

export function removeMemberFromWorkshop(groupId, workshopId, userId) {
  return new Promise((resolve, reject) => {
    Group.findOneAndUpdate(
      {
        groupId,
        'workshops._id': workshopId
      },
      {
        $pull: {
          'workshops.$.members': { user: userId }
        }
      },
      {
        new: true
      },
      (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(groupId);
        }
      }
    );
  })
    .then(findGroup);
}

export function submitDocToWorkshop(groupId, workshopId, docId, userId) {
  return new Promise((resolve, reject) => {
    Group.findOne(
      {
        groupId,
        'members.user': userId,
        'workshops._id': workshopId,
        workshops: {
          $elemMatch: {
            'members.user': userId
          }
        }
      },
      (err, doc) => {
        if (err || !doc) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      }
    );
  })

    // this BS approach is necessary because mongodb does not support positional $ on
    // nested arrays
    .then(found => new Promise((resolve, reject) => {
      found.workshops.forEach(workshop => {
        if (workshop._id.toString() === workshopId) {
          workshop.members.forEach(member => {
            if (member.user === userId.toString()) {
              member.doc = docId;
              member.submitted = true;
              found.markModified('workshops');
              found.save((err, saved) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve(saved);
                }
              });
            }
          });
        }
      });
    }))
    .then(() => new Promise((resolve, reject) =>
      Doc.findOneAndUpdate(
        {
          docId
        },
        {
          $push: {
            sharedWith: groupId
          }
        },
        (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(groupId);
          }
        })
    ))
    .then(findGroup);
}

export function removeDocFromWorkshop(groupId, workshopId, userId) {
  let docId;
  return new Promise((resolve, reject) => {
    Group.findOne(
      {
        groupId,
        'members.user': userId,
        'workshops._id': workshopId,
        workshops: {
          $elemMatch: {
            'members.user': userId
          }
        }
      },
      (err, doc) => {
        if (err || !doc) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      }
    );
  })

    // this BS approach is necessary because mongodb does not support positional $ on
    // nested arrays
    .then(found => new Promise((resolve, reject) => {
      found.workshops.forEach(workshop => {
        if (workshop._id.toString() === workshopId) {
          workshop.members.forEach(member => {
            if (member.user === userId.toString()) {
              docId = member.doc;
              member.doc = undefined;
              member.submitted = false;
              found.markModified('workshops');
              found.save((err, saved) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve(saved);
                }
              });
            }
          });
        }
      });
    }))
    .then(() => new Promise((resolve, reject) =>
      Doc.findOneAndUpdate(
        {
          docId
        },
        {
          $pull: {
            sharedWith: groupId
          }
        },
        (err) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(groupId);
          }
        })
    ))
    .then(findGroup);
}
