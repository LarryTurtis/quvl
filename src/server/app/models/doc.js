// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

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
  comments: [{
    commentId: Number,
    author: String,
    content: String,
    created_at: { type: Date, default: Date.now },
    authorId: Number,
    picture: String,
    index: Number
  }]
});

docSchema.plugin(autoIncrement.plugin, {
  model: 'Doc',
  field: 'docId',
  startAt: 0,
  incrementBy: 1
});

// create the model for users and expose it to our app
const docModel = mongoose.model('Doc', docSchema);

export default docModel;
