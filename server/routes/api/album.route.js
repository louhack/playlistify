var express = require('express');

var router = express.Router();

// Getting the Album Controller that we just created

var AlbumsController = require('../../controllers/albums.controller');


// Map each API to the Controller Functions

router.get('/', AlbumsController.getAlbums);

router.post('/', AlbumsController.createAlbum);

router.put('/', AlbumsController.updateAlbum);

router.delete('/:id',AlbumsController.removeAlbum);


// Export the Router

module.exports = router;