var express = require('express');
var router = express.Router();

var deleteFile = function(filePath){
	var fs = require('fs-extra');
	fs.removeSync(filePath);
}

router.get('/', (req, res) => {
	deleteFile(req.param('path'));
	res.send();
});

module.exports = router;

