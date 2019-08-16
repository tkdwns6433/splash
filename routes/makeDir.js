var makeDir = function(path, dirName){
	var fs = require('fs');
	fs.mkdirSync(path + '/' + dirName);
}

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	makeDir(req.params.path, req.params.dirName);
	res.send();
});

module.exports = router;

