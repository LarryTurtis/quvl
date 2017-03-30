// app/models/user.js
// load the things we need
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import autoIncrement from 'mongoose-auto-increment';

// define the schema for our user model
const userSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  access_token: String,
  local: {
    email: String,
    password: String,
    picture: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    picture: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    picture: String
  }

});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1492,
  incrementBy: 1
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
const userModel = mongoose.model('User', userSchema);

export default userModel;
