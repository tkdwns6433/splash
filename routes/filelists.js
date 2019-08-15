var express = require('express');
var vodlist = require('../models/vodlist');

var router = express.Router();

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
