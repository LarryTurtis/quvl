// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Comment from './comment';

const docSchema = mongoose.Schema({
  name: String,
  revisions: [{
    id: Number,
    doc: String,
    operations: [{
      start: Number,
      end: Number
    }]
  }],
  docId: Number,
  authorId: Number,
  sharedWith: [String],
  comments: [Comment]
});

docSchema.plugin(autoIncrement.plugin, {
  model: 'Doc',
  field: 'docId',
  startAt: 1,
  incrementBy: 1
});


// create the model for users and expose it to our app
const docModel = mongoose.model('Doc', docSchema);

export default docModel;
