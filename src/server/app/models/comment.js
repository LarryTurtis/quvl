// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const commentSchema = mongoose.Schema({
  commentId: Number,
  content: String,
  created_at: { type: Date, default: Date.now },
  authorId: Number,
  docId: Number,
  index: Number
});

export default commentSchema;
