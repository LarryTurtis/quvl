// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import User from './user';

const groupSchema = mongoose.Schema({
  name: String,
  members: [{
    user: { type: String, ref: User },
    admin: Boolean
  }]
});

groupSchema.plugin(autoIncrement.plugin, {
  model: 'Group',
  field: 'groupId',
  startAt: 0,
  incrementBy: 1
});

// create the model for users and expose it to our app
const groupModel = mongoose.model('Group', groupSchema);

export default groupModel;
