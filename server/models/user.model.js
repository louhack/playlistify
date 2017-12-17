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
            height: number,
            url: string,
            width: number,
            default: [],
            type: Array,
        }
    },
    oauth: {
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