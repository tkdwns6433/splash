var deleteFile = function(filePath){
	console.log('deletefilecalls');
	var fs = require('fs');
	fs.unlink(filePath);
}

module.exports = deleteFile;

