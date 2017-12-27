var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    profile: {
        displayName: {
            type: String,
        },
        id: {
            type: String,
            index: true,
        },
        email: String,
        picture: { 
            height: Number,
            url: String,
            width: Number,
            default: [],
            type: Array,
        }
    },
    token: {
        type: String,
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