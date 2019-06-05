// Getting Album Model
var Album = require('../models/album.model');

// Saving the context of this module inside the _this variable
_this = this;


// Async Controller function to get the Albums List
exports.getAlbums = async function getAlbums (req, res, next){

  // Check the existence of the query parameters, If the exists doesn't exists assign a default value
  var page = req.query.page ? +req.query.page : 1;
  var limit = req.query.limit ? +req.query.limit : 20;


  // var albums = await AlbumService.getAlbumsService({}, page, limit)
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit,
    sort:{'sortDate.year': -1, 'sortDate.month': -1, 'sputnikMusic.note': -1,'sortDate.day': -1}
  };

    // Try Catch the awaited promise to handle the error
  try {
    var albums = await Album.paginate({}, options);

    // Return the albums list with the appropriate HTTP Status Code and Message.
    return res.status(200).json({status: 200, data: albums, message: "Albums Successfully Received"});

  } catch (e) {
    // return a Error message describing the reason
    return res.status(400).json({status: 400, message: e.message});
  }

}

exports.createAlbum = async function createAlbum (req, res, next){

    // Req.Body contains the form submit values.

    // var album = {
    //     title: req.body.title,
    //     description: req.body.description,
    //     status: req.body.status

    // }

    var album = req.body.album;

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
    var createAlbum = await newAlbum.save();

    return res.status(201).json({status: 201, data: createdAlbum, message: "Album Succesfully Created"});

  }catch(e){
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({status: 400, message: "Album Creation was Unsuccesfull"});
  }
}

exports.updateAlbum = async function updateAlbum (req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400, message: "Id must be present"});
    }


    var id = req.body._id;

    var album = {
      _id: req.body._id,
      artistName: req.body.artistName ? req.body.artistName : null,
      albumName: req.body.albumName ? req.body.albumName : null,

      spotify: {
        id: req.body.spotify.id ? req.body.spotify.id : null,
        releaseDate: req.body.spotify.release_date ? req.body.spotify.release_date : null,
        cover: req.body.spotify.images[1].url ? req.body.spotify.images[1].url : null,
        total_tracks: req.body.spotify.total_tracks ? req.body.spotify.total_tracks : null
      }
    };

    if (req.body.sputnikMusic != null) {
      album.sputnikMusic =
      {
        id: req.body.sputnikMusic.id ? req.body.sputnikMusic.id : null,
        imagePath: req.body.sputnikMusic.imagePath ? req.body.sputnikMusic.imagePath : null,
        note: req.body.sputnikMusic.note ? req.body.sputnikMusic.note : null,
        releaseDate: {
          month: req.body.sputnikMusic.releaseDate.month ? req.body.sputnikMusic.releaseDate.month : null,
          year: req.body.sputnikMusic.releaseDate.year ? req.body.sputnikMusic.releaseDate.year : null,
        },
      };
  }

  if (req.body.heavyBIsH != null) {
    album.heavyBIsH =
    {
      releaseDate: {
        month: req.body.heavyBIsH.releaseDate.month,
        year: req.body.heavyBIsH.releaseDate.year
      },
      id: req.body.heavyBIsH.id,
      imagePath: req.body.heavyBIsH.imagePath
    };
  }


    try{
        //Find the Album to update by the IdSputnik
      var albumToUpdate = await Album.findById(id);
      // If no Album Object exists return false
      if(!albumToUpdate){
          return false;
      }

      //Edit the Album Object
      albumToUpdate.artistName =  albumToUpdate.artistName ? albumToUpdate.artistName : album.artistName;
      albumToUpdate.albumName = albumToUpdate.albumName ? albumToUpdate.albumName : album.albumName;

      if (album.sputnikMusic != null) {
        albumToUpdate.sputnikMusic.imagePath = albumToUpdate.sputnikMusic.imagePath ? albumToUpdate.sputnikMusic.imagePath : album.sputnikMusic.imagePath;
        albumToUpdate.sputnikMusic.note = albumToUpdate.sputnikMusic.note ? albumToUpdate.sputnikMusic.note : album.sputnikMusic.note;
        albumToUpdate.sputnikMusic.releaseDate = albumToUpdate.sputnikMusic.releaseDate ? albumToUpdate.sputnikMusic.releaseDate : album.sputnikMusic.releaseDate;

      }

      if (album.heavyBIsH != null) {
        albumToUpdate.heavyBIsH.imagePath = albumToUpdate.heavyBIsH.imagePath ? albumToUpdate.heavyBIsH.imagePath : album.heavyBIsH.imagePath;
        albumToUpdate.heavyBIsH.releaseDate = albumToUpdate.heavyBIsH.releaseDate ? albumToUpdate.heavyBIsH.releaseDate : album.heavyBIsH.releaseDate;
      }

      albumToUpdate.spotify.id = albumToUpdate.spotify.id  ? albumToUpdate.spotify.id : album.spotify.id;
      albumToUpdate.spotify.releaseDate = albumToUpdate.spotify.releaseDate ? albumToUpdate.spotify.releaseDate : album.spotify.releaseDate;
      albumToUpdate.spotify.cover = albumToUpdate.spotify.cover ? albumToUpdate.spotify.cover : album.spotify.cover;
      albumToUpdate.spotify.total_tracks = albumToUpdate.spotify.total_tracks ? albumToUpdate.spotify.total_tracks : album.spotify.total_tracks;
      //console.log(album.spotify);
      //console.log(albumToUpdate.spotify.releaseDate);

      var updatedAlbum = await albumToUpdate.save();
        //var updatedAlbum = await AlbumService.updateAlbumService(album)
      return res.status(200).json({status: 200, data: updatedAlbum, message: "Album Was Succesfully Updated"});

    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.removeAlbum = async function removeAlbum (req, res, next){
    var id = req.params.id;
    try{
        var deleted = await Album.remove({_id: id});
        if(deleted.result.n === 0){
          throw Error("Album Could not be deleted");
        }
        //var deleted = await AlbumService.deleteAlbumService(id)
        return res.status(204).json({status:204, message: "Album Succesfully Deleted"});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }

}
