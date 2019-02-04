var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var AlbumSchema = new mongoose.Schema({
    artistName: String,
    albumName: String,
    sputnikMusic:{
      id: String,
      imagePath: String,
      note: Number,
      releaseDate: {
        month: Number,
        year: Number
      },
    },
    heavyBIsH:{
      id: String,
      reviewLink: String,
      imagePath: String,
      releaseDate: {
        month: Number,
        year: Number
      },
    },
    spotify: {
      id: String,
      releaseDate: String,
      cover: String,
      total_tracks: Number
    },
    created: {
      type: Date,
      //default: Date.now
    },
    lastModified: Date
});

AlbumSchema.plugin(mongoosePaginate);
const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
