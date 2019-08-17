var express = require('express');
var router = express.Router();

var Vodmeta = require('../schemas/vodmeta');

router.get('/', (req, res) => {
        var json = JSON.parse(req.param('json'));
        var keys = Object.keys(json);
        var query = new Object;
        for(i in keys){
                query[keys[i]] = new RegExp(json[keys[i]]);
        }
        Vodmeta.find(query)
        .then((vodmetas) => {
                res.send(vodmetas);
        })
        .catch((err) => {
                console.error(err);
                next(err);
        });
});

module.exports = router;
