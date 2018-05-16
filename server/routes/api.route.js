var express = require('express');

var router = express.Router();
var albums = require('./api/album.route');
var user = require('./api/users.route');


router.use('/albums', albums);

router.use('/user', user);

module.exports = router;
