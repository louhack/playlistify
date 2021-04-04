var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

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
      sources: String
    },
    spotify: {
      id: String,
      release_date: String,
      cover: String,
      total_tracks: Number,
      release_date_precision: String,
    },
    sortDate: {
      day: Number,
      month: Number,
      year: Number
    },
    created: {
      type: Date,
      //default: Date.now
    },
    lastModified: Date
});

AlbumSchema.plugin(mongoosePaginate);
const Album = mongoose.model('Album', AlbumSchema);

Album.paginate().then({});

module.exports = Album;
