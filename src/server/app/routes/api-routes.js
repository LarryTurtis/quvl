import { saveDoc, listDocs, getDocForCommenting, updateDoc } from '../dao/db';

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

  app.get('/docs/:userId/:docId', isLoggedIn, getDocForCommenting);
  app.post('/docs/:userId/:docId', isLoggedIn, updateDoc);
};


