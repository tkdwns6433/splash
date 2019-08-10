const express = require('express');
const app = express();
const os = require('os');
var network = os.networkInterfaces();
var lan = Object.keys(network)[1];
var cors = require('cors');


var corsOption = {
	origin: ['http://127.0.0.1', 'http://' + network[lan][0]['address']],
	optionsSuccessStatus: 200,
	credentials: true
}

app.use(express.static('public'));
app.listen('8390', () => {
	console.log('port:8390 rest api server start');
});

app.get('/requesthls', cors(corsOption), (req, res) => {
	var hls ='http://';
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
})

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

var ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');

var encodingList = new Array();
var isEncoding = false;
var curFile = null;
app.post('/uploadEncoding', upload.array('files'), (req, res) => {
	res.status(200).send();
	var files = req.files;
	var getMetadata = require('./models/metadata.js');
	for(i in files){
		getMetaData(files[i], createTomongodb);
	}
	console.log(files.length + ' file upload completed, encoding Started');
	encodingFilter(files);
});

var options = '';
var encOp = {format: 'mp4', audio: 'aac', video: 'h264', vcodec: 'libx264', acodec: 'aac'};


async function encodingFilter(files){
	for(i in files){
		var needEncoding = true;
                var checker =  ffmpeg().input(files[i]['path']).ffprobe(function(err, data){
                        if(data == undefined){
                                console.log('invalid data');
                                return;
                        }
                        //format
                        var formats =  data['format']['format_name'].split(',');
                        for(k in formats){
                                if(formats[k] == encOp['format']){
                                        needEncoding = false;
                                        break;
                                }
                        }
                        //video codec
                        if(data['streams'][0]['codec_name'] != encOp['video']){
                                needEncoding = true;
                        }
                        //audio codec
                        if(data['streams'][1]['codec_name'] != encOp['audio']){
                                needEncoding = true;
                        }
			if(needEncoding){
				encodingList.push(data['format']['filename']);
			}
		});
	}
}


function promisifyCommand (command) {
	return Promise.promisify( (cb) => {
                        command
			.on( 'end', () => { cb(null) })
			.on( 'error', (error) => { cb(error) })
                        .run()
                })
}

var runEncodingServer = async function(){
	if(encodingList.length != 0 && isEncoding == false){
		curFile = encodingList.shift();
		console.log('start encoding ' + curFile);
	}
	else{
		console.log(encodingList.length + ' more files to encoding ' + encodingList);
		return;
	}
	isEncoding = true;
	var path = require('path');
	outputName = curFile.replace(path.extname(curFile), ''); 
        var command =  ffmpeg(options)
                                .on('progress', function(progress){
                                        console.log('processing : ' + progress.percent);
                                })
                                .input(curFile)
                                .output(outputName + '.' + encOp['format'])
                                .audioCodec(encOp['acodec'])
				.videoCodec(encOp['vcodec'])
        command = promisifyCommand(command);
        await command().then(() => {console.log('Encoding finished')}).catch((error) => {});
	isEncoding = false;
}

setInterval(runEncodingServer, 3000);


