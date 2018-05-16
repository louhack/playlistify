var async = require("async");

// Getting User Model
var User = require('../models/user.model');

var Playlist = require('../models/playlist.model');

var ObjectId = require('mongodb').ObjectID;

// Saving the context of this module inside the _this variable
_this = this;

// Async function to get the Users List
exports.getUsers = async function(req, res, next){

  var page = req.query.page ? +req.query.page : 1
  var limit = req.query.limit ? +req.query.limit : 20;

  // Options setup for the mongoose paginate
  var options = {
      page,
      limit
  }

    // Try Catch the awaited promise to handle the error

    try {
        var users = await User.paginate(query, options);

        // Return the users list that was retured by the mongoose promise
        return users;

    } catch (e) {

        // return a Error message describing the reason
        throw Error('Error while Paginating Users');
    }
}

exports.getUser = async function(req, res, next) {
  try {
    var id = req.user.id;
    var user = await User.findOne({'spotify.id': id});

    var userData = {
      _id: user._id,
      spotify: {
        id: user.spotify.id,
        picture: user.spotify.picture
      },
      profile: {
        displayName: user.profile.displayName,
        email: user.profile.email
      }
    }
    // Return the user with the appropriate HTTP Status Code and Message.
    return res.status(200).json({status: 200, data: userData, message: "User found"});

  } catch (e) {
    // return a Error message describing the reason
    return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getUserOrCreateUser = async function(req, res, next){

}


exports.createUser = async function(req, res, next){

    // Creating a new Mongoose Object by using the new keyword
}

exports.updateUser = async function(req, res, next){


}

exports.deleteUserService = async function(req, res, next){

    // Delete the User

  }

exports.getPlaylists = async function(req, res, next){
  try {
    const userId = req.query.userId;
    var albumIds = [];
    albumIds = req.query.albumId;
    var playlistifiedAlbums = [];

  async.each(albumIds, function(albumId, callback){
      Playlist.findOne({'userId': userId, 'albumId': albumId}
      ,(err, res) => {
          if(err) {
            console.log(err);
          } else {
              if(res){
                console.log('RES : ' + res);
                playlistifiedAlbums.push(res);
              }
            }
            callback();
      });
    },function(err){
      console.log('Playlistified Albums : ' + playlistifiedAlbums);
      if(err) {
        console.log('ERROR WHILE SEARCHING FOR PLAYLIST : %s', err)
      }
      if (playlistifiedAlbums.length > 0){
        return res.status(200).json({status: 200, data: playlistifiedAlbums, message: "Playlist Successfully Found"});
      }
      return res.status(200).json({status: 200, message: "No Playlist Found"});

    });

    // albumIds.forEach(async(albumId) => {
    //   await Playlist.findOne({'userId': userId, 'albumId': albumId}, (err, res) => {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       if(res){
    //         console.log('RES : ' + res);
    //         playlistifiedAlbums.push(res);
    //       }

    //     }
    //   });
    // });



  } catch (e) {
    console.log(e);
  }
}

exports.playlistifyAlbum = async function(req, res, next) {
  try {
    const data = req.body.params.playlist;

    var albumToPlaylistify = new Playlist(data);
    // Commit user
    var savedPlaylistifiedAlbum = await albumToPlaylistify.save();

    console.log(savedPlaylistifiedAlbum);

    return res.status(201).json({status: 201, data: 'OK', message: "Playlist Successfully Created"})

   // return res.status(200).json({status: 200, data: 'ADDED TO PLAYLIST', message: "Playlist Saved"});
  } catch (e) {
    console.log('ERROR : ' + JSON.stringify(e));
    return res.status(400).json({status: 400, message: e.message});

  }
}
