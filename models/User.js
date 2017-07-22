const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const helpers = require('../utils/helpers');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  aboutMe: { type: String, default: '' },
  _skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  _interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  unreadTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],

  coins: { type: Number, default: 5 },
  loc : {
    type: {type: String},
    coordinates: { type: [], index: '2dsphere', get: helpers.NullInitialization }
  },

  bookmarks:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  facebook: String,
  google: String,
  tokens: Array,
  isAdmin: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },

  acceptsEmails: {
    newExchanges: { type: Boolean, default: true },
    updateExchanges: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
  },

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    status: { type: String, default: '' },
    location: { type: String, default: '' },
    hometown: { type: String, default: '' },
    picture: { type: String, default: '' },
  }
}, { timestamps: true });

userSchema.index({loc: '2dsphere'});


/**
 * Password hash middleware.
 */
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }

  bcrypt.hash(user.password, 10)
  .then(hash => {
      user.password = hash;
      next();
  })
  .catch(err => next(err))
});

userSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.password) { return next(); }
    bcrypt.hash(this._update.password, 10)
    .then(hash => {
        this._update.password = hash;
        next();
    })
    .catch(err => next(err))
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
        if (!candidatePassword || !this.password) {
            resolve(false);
        } else {
            bcrypt.compare(candidatePassword, this.password)
            .then(isMatch => resolve(isMatch))
            .catch(err => reject(err))
        }
    });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
