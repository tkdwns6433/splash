var vodlist = function(vodfolder){
	var dt = require('directory-tree');
	return tree = dt(vodfolder);
}

console.log(vodlist('../vods/'));

module.exports = vodlist;

