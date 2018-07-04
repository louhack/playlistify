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
    spotify: {
      id: String,
    },
    created: {
      type: Date,
      default: Date.now
    },
    lastModified: Date
});

AlbumSchema.plugin(mongoosePaginate);
const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
