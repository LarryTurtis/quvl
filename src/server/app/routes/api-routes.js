import { saveDoc, listDocs, getDocForCommenting, updateDoc, createGroup } from '../dao/db';

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

module.exports = (app) => {
  app.post('/save', isLoggedIn, saveDoc);

  app.get('/docs/:userId', isLoggedIn, (req, res, next) => {
    listDocs(req.user.userId)
      .then(docs => res.json(docs))
      .catch(next);
  });

  app.get('/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    getDocForCommenting(req.user, req.params.authorId, req.params.docId)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.post('/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    updateDoc(req.params.authorId, req.params.docId, req.user, req.body.nodes, req.body.comment)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.post('/groups', isLoggedIn, (req, res, next) => {
    const name = req.body.name;
    const userId = req.user.userId;
    const emails = req.body.emails.split(',').map(email => email.trim());
    createGroup(userId, name, emails)
      .then(doc => res.json(doc))
      .catch(next);
  });
};


