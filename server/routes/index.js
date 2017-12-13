var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

module.exports = router;
