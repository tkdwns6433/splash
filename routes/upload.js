var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
        storage: multer.diskStorage({
                destination: (req, file, callback) => {
                        var path = req.param('path');
                        callback(null, path);
                },
                filename : (req, file, callback) => {
                        callback(null, file.originalname);
                }
        })
});

router.post('/', upload.array('files'), (req, res) => {
        res.status(200).send();
        console.log('upload completed in right folder');
});

module.exports = router;

