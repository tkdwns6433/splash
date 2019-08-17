var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
        var hls ='http://';
	const os = require('os');
	var network = os.networkInterfaces();
	var lan = Object.keys(network)[1];
        const fs = require('fs');
        const path = require('path');
        var srt = req.param('vodpath').replace(path.extname(req.param('vodpath')),'.srt');
        if(fs.existsSync(srt)){
                hls += network[lan][0]['address'] + ':8000/,' + req.param('vodpath') + ',' + srt + ',.urlset/master.m3u8';
        }
        else{
                hls += network[lan][0]['address'] + ':8000/' + req.param('vodpath') + '/index.m3u8';
        }
        res.send(hls);
});

module.exports = router;

