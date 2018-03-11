// Accessing the Album Service
var AlbumService = require('../services/album.service');

// Saving the context of this module inside the _this variable
_this = this;


// Async Controller function to get the Albums List
exports.getAlbums = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value
  console.log(req.query);
    var page = req.query.page ? +req.query.page : 1
    var limit = req.query.limit ? +req.query.limit : 50;

    try{

        var albums = await AlbumService.getAlbumsService({}, page, limit)

        // Return the albums list with the appropriate HTTP Status Code and Message.
        return res.status(200).json({status: 200, data: albums, message: "Albums Successfully Received"});

    }catch(e){

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({status: 400, message: e.message});

    }
}

exports.createAlbum = async function(req, res, next){

    // Req.Body contains the form submit values.

    // var album = {
    //     title: req.body.title,
    //     description: req.body.description,
    //     status: req.body.status

    // }

    var album = req.body.album;

    try{

        // Calling the Service function with the new object from the Request Body

        var createdAlbum = await AlbumService.createAlbumService(album)
        return res.status(201).json({status: 201, data: createdAlbum, message: "Album Succesfully Created"})
    }catch(e){

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({status: 400, message: "Album Creation was Unsuccesfull"})
    }
}

exports.updateAlbum = async function(req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    // console.log(req.body)

    var album = {
      _id: req.body._id,
      artistName: req.body.artistName ? req.body.artistName : null,
      albumName: req.body.albumName ? req.body.albumName : null,
      sputnikMusic:{
        id: req.body.sputnikMusic.id ? req.body.sputnikMusic.id : null,
        imagePath: req.body.sputnikMusic.imagePath ? req.body.sputnikMusic.imagePath : null,
        note: req.body.sputnikMusic.note ? req.body.sputnikMusic.note : null,
        releaseDate: {
          month: req.body.sputnikMusic.releaseDate.month ? req.body.sputnikMusic.releaseDate.month : null,
          year: req.body.sputnikMusic.releaseDate.year ? req.body.sputnikMusic.releaseDate.year : null,
        },
      },
      spotify: {
        id: req.body.spotify.id ? req.body.spotify.id : null,
      }
    }


    try{
        var updatedAlbum = await AlbumService.updateAlbumService(album)
        return res.status(200).json({status: 200, data: updatedAlbum, message: "Album Was Succesfully Updated"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeAlbum = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await AlbumService.deleteAlbumService(id)
        return res.status(204).json({status:204, message: "Album Succesfully Deleted"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}
