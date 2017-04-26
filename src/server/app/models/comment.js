// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import User from './user';

const commentSchema = mongoose.Schema({
  commentId: Number,
  content: String,
  created_at: { type: Date, default: Date.now },
  author: { type: String, ref: User },
  docId: Number,
  index: Number
});

commentSchema.index({ index: 1 });

export default commentSchema;
