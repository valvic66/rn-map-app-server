const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified('password')) {
    return next();
  }
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) {
      return next(err);
    };
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) {
        return next(err);
      };
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePasswords = function(password) {
  const user = this;
  
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, result) => {
      if(error) {
        return reject(error);
      };
      if(!result) {
        return reject(error);
      };
      resolve(true);
    });
  });
};

mongoose.model('User', userSchema);