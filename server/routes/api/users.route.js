var express = require('express');
var router = express.Router();

var UsersController = require('../../controllers/users.controller');


/* GET users listing. */
router.get('/', UsersController.getUser);

// Update list of albums added to playlist
router.put('/playlist', UsersController.updateAlbumPlaylist);

module.exports = router;
