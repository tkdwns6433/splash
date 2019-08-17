var express = require('express');
var router = express.Router();

var vodlist = function(vodfolder){
        var dt = require('directory-tree');
        return tree = dt(vodfolder);
}

router.get('/', (req, res) => {
	var result = vodlist(req.param('dir'))
        if(result != null){
                res.send(result);
        }
        else
        {
                res.send('error 400');
        }
});

module.exports = router;
