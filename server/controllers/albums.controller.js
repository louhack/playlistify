// Getting Album Model
// const { query } = require('@angular/animations');
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
    sort:{'sortDate.year': -1, 'sortDate.month': -1,'sortDate.day': -1}
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

exports.search = async function search (req, res, next){
  // console.log("Search function");
  //  console.log(req.query.q);
  var searchItem = req.query.q;
  var scope = req.query.scope;
  var sources = req.query.sources;
  var page = req.query.page ? +req.query.page : 1;
  var limit = req.query.limit ? +req.query.limit : 20;
  var result = {};

  var options = {
    page,
    limit,
    sort:{'sortDate.year': -1, 'sortDate.month': -1,'sortDate.day': -1}
  };

  try {
    var query={};
    const searchAlbums = {albumName: {$regex: searchItem, $options:'i'}};
    const searchArtists = {artistName: {$regex: searchItem, $options:'i'}};
    const searchAllTypes = {$or: [searchArtists, searchAlbums]};

    const searchSources = ((sources == "sputnikMusic") ? {sputnikMusic: {$exists: true}} : (sources=="hbih") ? {heavyBIsH: {$exists: true}} : (sources =="ylr") ? {yourLastRites: {$exists: true}} : "");
    //TODO add source , heavyBIsH: {$exists: true}
    // console.log("sources : " + JSON.stringify(searchSources));
    query = (scope=="albums" ? searchAlbums : (scope == "artists" ? searchArtists: searchAllTypes));
    if (searchSources != ""){
      Object.assign(query, searchSources);
    }
    // console.log(query);



    // console.log("final query " + JSON.stringify(query));
    // if (searchItem) {
      // if (scope=="all"){
        // console.log("SEARCH ALL");
        foundAlbums = await Album.paginate(query, options);

      // } else if (scope == "albums") {
        // Object.assign(query,{albumName: {$regex: searchItem, $options:'i' }});
        // console.log(JSON.stringify(query));
// {albumName: {$regex: searchItem, $options:'i' }}
        // foundAlbums = await Album.paginate(query, options);

      // } else {
        // foundAlbums = await Album.paginate({artistName: {$regex: searchItem, $options:'i' }}, options);
      // }
      //console.log(foundAlbums);
    // }
    // else {
      // return res.status(400).json({status: 400, message: "No data to search for"});

    // }
    // console.log(JSON.stringify(foundAlbums));
    return res.status(200).json({status: 200, data: foundAlbums, message: "Search Successful"});

  } catch (error) {
    return res.status(400).json({status: 400, data: error.message, message: "Error while searching"});
  }
}

exports.createAlbum = async function createAlbum (req, res, next){

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

  console.log(req.body);

  var id = req.body._id;

  // var album = {
  //   _id: req.body._id,
  //   artistName: req.body.artistName ? req.body.artistName : null,
  //   albumName: req.body.albumName ? req.body.albumName : null,

  // }
  var album = req.body;

  // if (req.body.spotify && Object.keys(req.body.spotify).length !== 0 && req.body.spotify.constructor === Object) {
  //   album.spotify = {};
  //   cover_req = [];

  //   if(req.body.spotify.images && req.body.spotify.images.length > 0) {
  //     cover_req = req.body.spotify.images;
  //   }

  //   album.spotify =
  //   {
  //     id: req.body.spotify.id != "" ? req.body.spotify.id : null,
  //     release_date: req.body.spotify.release_date ? req.body.spotify.release_date : null,
  //     release_date_precision: req.body.spotify.release_date_precision ? req.body.spotify.release_date_percision : null,
  //     total_tracks: req.body.spotify.total_tracks ? req.body.spotify.total_tracks : null,
  //   }

  //   // console.log("Spotify ID : " + album.spotify.id);

  //   album.spotify.cover = cover_req.length > 0 ? (cover_req[1].url ? cover_req[1].url : null) : null;
  // }

  // if (req.body.sputnikMusic != null) {
  //   album.sputnikMusic =
  //   {
  //     id: req.body.sputnikMusic.id ? req.body.sputnikMusic.id : null,
  //     imagePath: req.body.sputnikMusic.imagePath ? req.body.sputnikMusic.imagePath : null,
  //     note: req.body.sputnikMusic.note ? req.body.sputnikMusic.note : null,
  //     releaseDate: {
  //       month: req.body.sputnikMusic.releaseDate.month ? req.body.sputnikMusic.releaseDate.month : null,
  //       year: req.body.sputnikMusic.releaseDate.year ? req.body.sputnikMusic.releaseDate.year : null,
  //     },
  //   };
  // }

  // if (req.body.heavyBIsH != null) {
  //   album.heavyBIsH =
  //   {
  //     releaseDate: {
  //       month: req.body.heavyBIsH.releaseDate.month,
  //       year: req.body.heavyBIsH.releaseDate.year
  //     },
  //     id: req.body.heavyBIsH.id,
  //     imagePath: req.body.heavyBIsH.imagePath
  //   };
  // }


    try{
        //Find the Album to update by the IdSputnik
      var albumToUpdate = await Album.findById(id);
      // If no Album Object exists return false
      if(!albumToUpdate){
          return false;
      }

  //     //Edit the Album Object
  //     albumToUpdate.artistName =  albumToUpdate.artistName == album.artistName ? albumToUpdate.artistName : album.artistName;
  //     albumToUpdate.albumName = albumToUpdate.albumName == album.albumName ? albumToUpdate.albumName : album.albumName;

  //     if (album.sputnikMusic != null) {
  //       albumToUpdate.sputnikMusic.imagePath = albumToUpdate.sputnikMusic.imagePath ? albumToUpdate.sputnikMusic.imagePath : album.sputnikMusic.imagePath;
  //       albumToUpdate.sputnikMusic.note = albumToUpdate.sputnikMusic.note ? albumToUpdate.sputnikMusic.note : album.sputnikMusic.note;
  //       albumToUpdate.sputnikMusic.releaseDate = albumToUpdate.sputnikMusic.releaseDate ? albumToUpdate.sputnikMusic.releaseDate : album.sputnikMusic.releaseDate;

  //     }

  //     if (album.heavyBIsH != null) {
  //       albumToUpdate.heavyBIsH.imagePath = albumToUpdate.heavyBIsH.imagePath ? albumToUpdate.heavyBIsH.imagePath : album.heavyBIsH.imagePath;
  //       albumToUpdate.heavyBIsH.releaseDate = albumToUpdate.heavyBIsH.releaseDate ? albumToUpdate.heavyBIsH.releaseDate : album.heavyBIsH.releaseDate;
  //     }

  //     if (album.spotify !=null) {
  //       albumToUpdate.spotify.id = album.spotify.id;//albumToUpdate.spotify.id  ? albumToUpdate.spotify.id : album.spotify.id;
  //       albumToUpdate.spotify.release_date = albumToUpdate.spotify.release_date ? albumToUpdate.spotify.release_date : album.spotify.release_date;
  //       albumToUpdate.spotify.release_date_precision = albumToUpdate.spotify.release_date_precision ? albumToUpdate.spotify.release_date_precision : album.spotify.release_date_precision;
  //       albumToUpdate.spotify.cover = albumToUpdate.spotify.cover ? albumToUpdate.spotify.cover : album.spotify.cover;
  //       albumToUpdate.spotify.total_tracks = albumToUpdate.spotify.total_tracks ? albumToUpdate.spotify.total_tracks : album.spotify.total_tracks;
  //     }
  //     //console.log(album.spotify);
      //console.log(albumToUpdate.spotify.releaseDate);

      albumToUpdate.artistName = album.artistName;
      albumToUpdate.albumName = album.albumName;

      if (album.sputnikMusic != null) {
          albumToUpdate.sputnikMusic = album.sputnikMusic;
      }

      if (album.heavyBIsH){
        albumToUpdate.heavyBIsH;
      }

      if (album.spotify !=null) {
        albumToUpdate.spotify = album.spotify;
      }

      if(album.yourLastRites != null){
        albumToUpdate.yourLastRites = album.yourLastRites;
      }
      // albumToUpdate = (Album) album;
      albumToUpdate.lastModified = new Date();

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
