var express = require('express');
var router = express.Router();
var middleware = require("../../middleware/auth.middleware");

var ScriptController = require('../../controllers/script.controller');


/* GET users listing. */
// router.get('/', UsersController.getUsers);

// Update list of albums added to playlist
router.post('/startTask/:taskName', ScriptController.startScheduledTask);

router.post('/stopTask/:taskName', ScriptController.stopScheduledTask);

router.get('/taskStatus/:taskName', ScriptController.getTaskStatus);

module.exports = router;