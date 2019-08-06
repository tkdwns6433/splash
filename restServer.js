const express = require('express');
const app = express();
var cors = require('cors');

var corsOption = {
	origin: ['http://127.0.0.1:3000', 'http://211.110.58.139'],
	optionsSuccessStatus: 200,
	credentials: true
}
app.use(express.static('public'));
app.listen('8390', () => {
	console.log('port:8390 rest api server start');
});

app.get('/vodlist',cors(corsOption), (req, res) => {
	var vodlist = require('./models/vodlist');
	var result = vodlist(req.param('dir'));
	if(result != null){
		res.send(result);
	}
	else
	{
		res.send('error 400');
	}
});

app.get('/renameFile', cors(corsOption), (req, res) => {
	var renameFile = require('./models/renameFile');
	renameFile(req.param('path'), req.param('rename'));
	res.send();
});

app.get('/deleteFile', cors(corsOption), (req, res) => {
	var deleteFile = require('./models/deleteFile');
	deleteFile(req.param('path'));
	res.send();
});

app.get('/makeDir', cors(corsOption), (req, res) => {
	var makeDir = require('./models/makeDir');
	makeDir(req.param('path'), req.param('dirName'));
	res.send();
});

var multer = require('multer');
var fs = require('fs-extra');

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

app.post('/upload', upload.array('files'), (req, res) => {
	res.status(200).send();
	console.log('upload completed in right folder');
});

var encodingList = [];
var isEncoding = false;
var curEncode = null;
app.post('/uploadEncoding', upload.array('files'), (req, res) => {
	res.status(200).send();
	console.log('upload completed, encoding Stated');
	var files = req.files;
        //input files and get filtered list path->ffprobe->filter->path
	//append encodingList only need path
	for(i in files){
		encodingList.push(files[i]);
	}
});

var options = '';
var encOp = {format: 'mp4', audio: 'aac', video: 'h264', vcodec: 'libx264', acodec: 'aac'};

var ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');
function promisifyCommand (command) {
	return Promise.promisify( (cb) => {
                        command
                        .run()
                })
}

var runEncodingServer = async function(){
	if(encodingList.length != 0 && isEncoding == false){
		console.log('Encoding Started');
		curFile = encodingList.shift();
		isEncoding = true;
	}
	else{
		console.log(encodingList + ' ' + encodingList.length);
		if(isEncoding){
			console.log('encoding is processing');
		}
		else{
			console.log('No file to encode');
		}
		return;
	}
        var command =  ffmpeg(options)
                                .on('progress', function(progress){
                                        console.log('processing : ' + progress.percent);
                                })
                                .input(curFile['path'])
                                .output(curFile['path'] + '.' + encOp['format'])
                                .audioCodec(encOp['acodec']).videoCodec(encOp['vcodec'])
        command = await promisifyCommand(command);
        await command()
        .then ( () => {console.log(curFile['path'] + 'Encoding Success');})	
        .catch ( (error) => {});
	isEncoding = false;
}

setInterval(runEncodingServer, 3000);


