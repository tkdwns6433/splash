var makeDir = function(path, dirName){
	console.log('makeDir');
	var fs = require('fs');
	fs.mkdirSync(path + '/' + dirName);
}

module.exports = makeDir;

