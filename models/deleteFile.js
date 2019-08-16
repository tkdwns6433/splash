var deleteFile = function(filePath){
	var fs = require('fs-extra');
	fs.removeSync(filePath);
}

module.exports = deleteFile;

