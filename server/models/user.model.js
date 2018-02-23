var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    profile: {
        displayName: {
            type: String,
        },
        email: {
          type: String,
        },
    },
    spotify: {
        id: {
          type: String,
          index: true,
        },
        picture: {
          height: Number,
          url: String,
          width: Number,
          default: [],
          type: Array,
        },
        accessToken: {
          type: String,
        },
        refreshToken: {
          type: String,
        }
    },
    created: {
      type: Date,
      default: Date.now
    },
    lastLoggedIn: {
      type: Date,
      default: Date.now
    },
});

UserSchema.set('toJSON', {
    virtuals: true
  })

const User = mongoose.model('User', UserSchema);
module.exports = User;
