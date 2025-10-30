var express = require('express');

var router = express.Router();
var albums = require('./api/album.route');
var user = require('./api/users.route');
var script = require('./api/script.route');


router.use('/albums', albums);

router.use('/user', user);

router.use('/script', script);

module.exports = router;
