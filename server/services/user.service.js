// Getting User Model 
var User = require('../models/user.model');

// Saving the context of this module inside the _this variable
_this = this;

// Async function to get the Users List
exports.getUsersService = async function(query, page, limit){

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
        var user = await User.findOne({'profile.id': id});

        return user;
    }
    catch(e){
        // return a Error message describing the reason     
        throw Error("Error while Searching the User");
    }
}

exports.getUserOrCreateUserService = async function(user){
    try {
        var userFound = await User.findOne({'profile.id': user.id});

        //console.log('user.token: ', user.token);
        //console.log('userFound token: ', userFound.token);
        if (userFound) {
            if(userFound.token === user.token) {
                console.log('token up-to-date');
                return userFound;
            } else {
                //update token
                userFound.token = user.token;
                var updatedUser = await User.update({'profile.id': userFound.profile.id}, {token: user.token},
                (err, raw) => {
                    if (err) return handleError(err);
                    console.log('Token udpdated', raw);
                });
                
                console.log('retour update: ', updatedUser);
                return userFound;
            }
        } else {
            console.log("creating new user");
            // Creating a new Mongoose Object by using the new keyword
            var newUser = new User({
            profile: {
                displayName : user.displayName,
                id : user.id,
                email : user.email,
                picture: user.picture,
                },
            token: user.token,
            });
            
            var userCreated = await newUser.save();
            return userCreated;
        }
    } catch (error) {
            // return a Error message describing the reason
            throw Error("Error while Searching the User");
    }
}

exports.createUserService = async function(user){
    
    // Creating a new Mongoose Object by using the new keyword
    var newUser = new User({
        profile: {
            displayName : user.displayName,
            id : user.id,
            email : user.email,
            picture: user.picture
        }
    });

    try{

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
    
        var oldUser = await User.findOne({id: id});
    }catch(e){
        throw Error("Error occured while Finding the User")
    }

    // If no old User Object exists return false
    if(!oldUser){
        return false;
    }

   console.log(oldUser)

    //Edit the User Object
    oldUser.displayName = user.displayName ? user.displayName : oldUser.displayName;
    oldUser.email = user.email ? user.email : oldUser.email;

    console.log(oldUser)

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