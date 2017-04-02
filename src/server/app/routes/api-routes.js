import {
  saveDoc,
  listDocs,
  getDocForCommenting,
  updateDoc,
  createGroup,
  findGroups,
  addMember,
  removeMember
} from '../dao/db';

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

module.exports = (app) => {
  app.post('/save', isLoggedIn, saveDoc);

  app.get('/api/docs/:userId', isLoggedIn, (req, res, next) => {
    listDocs(req.user.userId)
      .then(docs => res.json(docs))
      .catch(next);
  });

  app.get('/api/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    getDocForCommenting(req.user, req.params.authorId, req.params.docId)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.post('/api/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    updateDoc(req.params.authorId, req.params.docId, req.user, req.body.nodes, req.body.comment)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.post('/api/groups', isLoggedIn, (req, res, next) => {
    const name = req.body.name;
    const _id = req.user._id;
    const emails = req.body.emails.split(',').map(email => email.trim());
    createGroup(_id, name, emails)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.get('/api/groups', isLoggedIn, (req, res, next) => {
    const _id = req.user._id;
    findGroups(_id)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.put('/api/groups/:groupId', isLoggedIn, (req, res, next) => {
    if (req.body.type === 'ADD') {
      addMember(req.params.groupId, req.body.member)
        .then(doc => res.json(doc))
        .catch(next);
    }
    if (req.body.type === 'REMOVE') {
      removeMember(req.params.groupId, req.body.member)
        .then(doc => res.json(doc))
        .catch(next);
    }
  });
};


