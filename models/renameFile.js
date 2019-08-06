var renameFile = function(filePath, rename){
	console.log('renamefilecalls');
	var fs = require('fs');
	var popPath = filePath.split('/');
	popPath.pop();
	var joinPath = popPath.join('/');
	fs.rename(filePath, joinPath +'/' + rename);
}

module.exports = renameFile;

