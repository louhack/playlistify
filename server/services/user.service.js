// Getting User Model
var User = require('../models/user.model');
var Playlists = require('../models/playlist.model');

// Saving the context of this module inside the _this variable
_this = this;

// Async function to get the Users List
exports.getUsersService = async function(req, res, next){

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

exports.getUserService = async function(id) {
    try {
        var user = await User.findOne({'spotify.id': id});

        return user;
    }
    catch(e){
        // return a Error message describing the reason
        throw Error("Error while Searching the User");
    }
}

exports.getUserOrCreateUserService = async function(user){
    try {
        var userFound = await User.findOne({'spotify.id': user.spotify.id});

        if (userFound) {
            if(userFound.spotify.accessToken === user.spotify.accessToken) {
                return userFound;
            } else {
                //update token
                this.updateTokenService(userFound.spotify.id, user.spotify.accessToken, user.spotify.expires_in)
                .then(res => {
                  return res;

                },err => console.log(err));
            }

              //  userFound.spotify.accessToken = user.spotify.accessToken;
              //  userFound.spotify.expires_in = user.spotify.expires_in;
        } else {
            // Creating a new Mongoose Object by using the new keyword
           var newUser = new User(user);

            var userCreated = await newUser.save();
            return userCreated;
        }
    } catch (error) {
            // return a Error message describing the reason
            console.log(error);
            throw Error("Error while Searching the User");
    }
}

exports.updateTokenService = async function(id,accessToken, expires_in) {
  try {
   var usr = await User.findOneAndUpdate({'spotify.id': id}, {'spotify.accessToken': accessToken, 'spotify.expires_in': expires_in, 'lastLoggedIn': Date.now()});
  } catch (error) {
    console.log('Error while updating Token: ', error);
  }
  return usr;
}
exports.createUserService = async function(user){

    // Creating a new Mongoose Object by using the new keyword
    try{
      var newUser = new User(user);
      // Commit user
      var savedUser = await newUser.save();

        return savedUser;
    }catch(e){

        // return a Error message describing the reason
        throw Error("Error while Creating User");
    }
}

exports.updateUserService = async function(user){
    var id = user.id;

    try{
        //Find the old User Object by the Id Spotify

        var oldUser = await User.findOne({'spotify.id': id});
    }catch(e){
        throw Error("Error occured while Finding the User")
    }

    // If no old User Object exists return false
    if(!oldUser){
        return false;
    }

    //Edit the User Object
    oldUser.profile.displayName = user.profile.displayName ? user.profile.displayName : oldUser.profile.displayName;
    oldUser.profile.email = user.profile.email ? user.profile.email : oldUser.profile.email;

    try{
        var savedUser = await oldUser.save()
        return savedUser;
    }catch(e){
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUserService = async function(id){

    // Delete the User
    try{
        var deleted = await User.remove({_id: id});
        if(deleted.result.n === 0){
            throw Error("User Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the User")
    }
  }

exports.getPlaylistsService = async function(){
  try {
   return 'get user\'s playlist';
  } catch (error) {
    console.log('ERROR WHILE GET PLAYLISTS : ' + error);
  }

exports.saveAlbumPlaylistService = async function() {
  try {
    return 'save album\'s playlist';
  } catch (error) {
    console.log('ERROR WHILE SAVING ALBUM\'S PLAYLIST : ' + error);

  }
}
}
