var express = require('express')

var router = express.Router()
var albums = require('./api/album.route')


router.use('/albums', albums);


module.exports = router;