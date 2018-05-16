var mongoose = require('mongoose');

var PlaylistSchema = new mongoose.Schema({
    idSpotify: String,
    name: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album"
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = Playlist;
