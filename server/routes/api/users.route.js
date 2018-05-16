var express = require('express');
var router = express.Router();
var middleware = require("../../middleware/auth.middleware");

var UsersController = require('../../controllers/users.controller');


/* GET users listing. */
router.get('/', UsersController.getUsers);

// Update list of albums added to playlist
router.get('/playlistifiedAlbum', middleware.isLoggedIn, UsersController.getPlaylists);

router.post('/playlistifyAlbum', middleware.isLoggedIn, UsersController.playlistifyAlbum);

router.get('/profile', middleware.isLoggedIn , UsersController.getUser);

module.exports = router;
