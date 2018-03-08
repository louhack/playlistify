// Getting Album Model
var Album = require('../models/album.model');

// Saving the context of this module inside the _this variable
_this = this;

// Async function to get the Album List
exports.getAlbumsService = async function(query, page, limit){

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit,
        sort:{'sputnikMusic.releaseDate.year': -1, 'sputnikMusic.releaseDate.month': -1, 'sputnikMusic.note': -1, 'artistName': 1}
    }

    // Try Catch the awaited promise to handle the error

    try {
        var albums = await Album.paginate(query, options);

        // Return the albums list that was retured by the mongoose promise
        return albums;

    } catch (e) {

        // return a Error message describing the reason
        throw Error('Error while Paginating Albums');
    }
}

exports.createAlbumService = async function(album){

    // Creating a new Mongoose Object by using the new keyword
    var newAlbum = new Album({
        artistName : album.artistName,
        albumName : album.albumName,
        idAlbumSputnik : album.idAlbumSputnik,
        imagePath : album.imagePath,
        note : album.note,
        releaseMonth : album.releaseMonth,
    });

    try{

        // Commit album
        var savedAlbum = await newAlbum.save();

        return savedAlbum;
    }catch(e){

        // return a Error message describing the reason
        throw Error("Error while Creating Album");
    }
}

exports.updateAlbumService = async function(album){
    var id = album._id;

    try{
        //Find the old Album Object by the IdSputnik

        var oldAlbum = await Album.findById(id);
    }catch(e){
        throw Error("Error occured while Finding the Album")
    }

    // If no old Album Object exists return false
    if(!oldAlbum){
        return false;
    }

    console.log('Album retrieve from DB  **** ', oldAlbum)

    //Edit the Album Object
    oldAlbum.artistName = album.artistName ? album.artistName : oldAlbum.artistName;
    oldAlbum.albumName = album.albumName ? album.albumName : oldAlbum.albumName;
    oldAlbum.sputnikMusic.imagePath = album.sputnikMusic.imagePath ? album.sputnikMusic.imagePath : oldAlbum.sputnikMusic.imagePath;
    oldAlbum.sputnikMusic.note = album.sputnikMusic.note ? album.sputnikMusic.note : oldAlbum.sputnikMusic.note;
    oldAlbum.sputnikMusic.releaseDate = album.sputnikMusic.releaseDate ? album.sputnikMusic.releaseDate : oldAlbum.sputnikMusic.releaseDate;
    oldAlbum.spotify.id = album.spotify.id  ? album.spotify.id : oldAlbum.spotify.id;

    console.log('Updated Album to save *** ', oldAlbum)

    try{
        var savedAlbum = await oldAlbum.save()
        return savedAlbum;
    }catch(e){
        throw Error("And Error occured while updating the Album");
    }
}

exports.deleteAlbumService = async function(id){

    // Delete the Album
    try{
        var deleted = await Album.remove({_id: id});
        if(deleted.result.n === 0){
            throw Error("Album Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Album")
    }
}
