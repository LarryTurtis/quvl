import {
  saveDoc,
  listDocs,
  getDocForCommenting,
  updateDoc,
  deleteComment,
  filterDeletedComments,
  createGroup,
  findGroups,
  addMember,
  removeMember,
  promoteMember,
  demoteMember,
  createWorkshop,
  addMemberToWorkshop,
  cancelWorkshop,
  removeMemberFromWorkshop,
  submitDocToWorkshop,
  removeDocFromWorkshop,
  saveBugReport
} from '../dao/db';
import ses from '../ses';
import Mailer from '../Mailer';

const sesMailer = new Mailer(ses);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

module.exports = (app) => {
  app.post('/api/save', isLoggedIn, saveDoc);
  app.post('/api/bugreport', isLoggedIn, saveBugReport);

  app.get('/api/docs/:userId', isLoggedIn, (req, res, next) => {
    if (req.params.userId.toString() === req.user.userId.toString()) {
      listDocs(req.user.userId)
        .then(docs => res.json(docs))
        .catch(next);
    }
    else {
      res.status(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/api/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    getDocForCommenting(req.user, req.params.authorId, req.params.docId)
      .then(doc => res.json(filterDeletedComments(doc)))
      .catch(next);
  });

  app.post('/api/docs/:authorId/:docId', isLoggedIn, (req, res, next) => {
    updateDoc(req.params.authorId, req.params.docId, req.user, req.body.nodes, req.body.comment)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.delete('/api/docs/:authorId/:docId/:commentId', isLoggedIn, (req, res, next) => {
    deleteComment(req.params.authorId, req.params.docId, req.params.commentId, req.user)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.post('/api/groups', isLoggedIn, (req, res, next) => {
    if (req.user.demoUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const name = req.body.name;
    const _id = req.user._id;
    const emails = req.body.emails.split(',').map(email => email.trim());
    createGroup(_id, name, emails)
      .then(doc => res.json(doc))
      .then(() => {
        emails.forEach(email => {
          sesMailer.sendInvite(email, req.user.email, name);
        });
      })
      .catch(next);
  });

  app.get('/api/groups', isLoggedIn, (req, res, next) => {
    const _id = req.user._id;
    findGroups(_id)
      .then(doc => res.json(doc))
      .catch(next);
  });

  app.put('/api/groups/:groupId', isLoggedIn, (req, res, next) => {
    if (req.user.demoUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    if (req.body.type === 'ADD') {
      addMember(req.params.groupId, req.body.member, req.user._id)
        .then(doc => res.json(doc))
        .catch(next);
    }
    if (req.body.type === 'REMOVE') {
      removeMember(req.params.groupId, req.body.member, req.user._id)
        .then(doc => res.json(doc))
        .catch(next);
    }
    if (req.body.type === 'PROMOTE') {
      promoteMember(req.params.groupId, req.body.member, req.user._id)
        .then(doc => res.json(doc))
        .catch(next);
    }
    if (req.body.type === 'DEMOTE') {
      demoteMember(req.params.groupId, req.body.member, req.user._id)
        .then(doc => res.json(doc))
        .catch(next);
    }
  });

  app.post('/api/groups/:groupId/workshops', isLoggedIn, (req, res, next) => {
    // create a new workshop
    createWorkshop(req.params.groupId, req.body.date, req.body.slots, req.user._id)
      .then(workshop => res.json(workshop))
      .catch(next);
  });

  app.put('/api/groups/:groupId/workshops/:workshopId', isLoggedIn, (req, res, next) => {
    // update a workshop
    if (req.body.type === 'ADD_MEMBER') {
      addMemberToWorkshop(req.params.groupId, req.params.workshopId, req.user._id)
        .then(workshop => res.json(workshop))
        .catch(next);
    }
    if (req.body.type === 'REMOVE_MEMBER') {
      removeMemberFromWorkshop(req.params.groupId, req.params.workshopId, req.user._id)
        .then(workshop => res.json(workshop))
        .catch(next);
    }
    if (req.body.type === 'SUBMIT') {
      submitDocToWorkshop(req.params.groupId, req.params.workshopId, req.body.docId, req.user._id)
        .then(workshop => res.json(workshop))
        .catch(next);
    }
    if (req.body.type === 'WITHDRAW') {
      removeDocFromWorkshop(req.params.groupId, req.params.workshopId, req.user._id)
        .then(workshop => res.json(workshop))
        .catch(next);
    }
    if (req.body.type === 'RESCHEDULE') {

    }
    if (req.body.type === 'CANCEL') {
      cancelWorkshop(req.params.groupId, req.params.workshopId, req.user._id)
        .then(workshop => res.json(workshop))
        .catch(next);
    }
    if (req.body.type === 'ADD_SLOT') {

    }
  });
};


