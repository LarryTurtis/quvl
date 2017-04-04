import mongoose from 'mongoose';
import User from './user';
import Doc from './doc';
import Group from './group';

const workshopSchema = mongoose.Schema({
  date: Date,
  group: { type: String, ref: Group },
  slots: Number,
  members: [{
    user: { type: String, ref: User },
    submitted: Boolean,
    doc: { type: String, ref: Doc }
  }]
});

const workshopModel = mongoose.model('Workshop', workshopSchema);

export default workshopModel;
