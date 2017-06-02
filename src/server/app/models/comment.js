// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import User from './user';
const ObjectId = mongoose.Schema.ObjectId;

const commentSchema = mongoose.Schema({
  commentId: Number,
  content: String,
  created_at: { type: Date, default: Date.now },
  author: { type: ObjectId, ref: User },
  docId: Number,
  index: Number,
  deleted: { type: Boolean, default: false }
});

commentSchema.index({ index: 1 });

export default commentSchema;
