var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var AlbumSchema = new mongoose.Schema({
    artistName: String,
    albumName: String,
    idAlbumSputnik: String,
    imagePath: String,
    note: Number,
    releaseMonth: String,
    spotidyId: String,
});

AlbumSchema.plugin(mongoosePaginate);
const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;