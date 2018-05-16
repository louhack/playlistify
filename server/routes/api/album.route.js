var express = require('express');

var router = express.Router();

var middleware = require("../../middleware/auth.middleware");

// Getting the Album Controller that we just created
var AlbumsController = require('../../controllers/albums.controller');


// Map each API to the Controller Functions

router.get('/', AlbumsController.getAlbums);

router.post('/', middleware.isLoggedIn, AlbumsController.createAlbum);

router.put('/', middleware.isLoggedIn, AlbumsController.updateAlbum);

router.delete('/:id', middleware.isLoggedIn, AlbumsController.removeAlbum);


// Export the Router

module.exports = router;
