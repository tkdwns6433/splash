var renameFile = function(filePath, rename){
	var fs = require('fs');
	var path = require('path');
	var basename = path.basename(filePath);
	fs.rename(filePath,  filePath.replace(basename, rename));
}

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	renameFile(req.param('path'), req.param('rename'));
	res.send();
});

module.exports = router;

