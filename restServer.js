const express = require('express');
const app = express();

const os = require('os');
var network = os.networkInterfaces();
var lan = Object.keys(network)[1];
const local = 'http://127.0.0.1';
const eth = 'http://' + network[lan][0]['address'];

var connect = require('./schemas');
connect();
var Vodmeta = require('./schemas/vodmeta');

const port = '8390';
app.use(express.static('public'));
app.listen(port, () => {
	console.log('port:' + port + ' rest api server start');
});

var cors = require('cors');
var corsOption = {
	origin: [local, eth],
	optionsSuccessStatus: 200,
	credentials: true
}
app.use(cors(corsOption));

var requesthlsRouter = require('./routes/requesthls.js');
var filelistsRouter = require('./routes/filelists.js');
var deleteFileRouter = require('./routes/deleteFile.js');
var renameFileRouter = require('./routes/renameFile.js');
var makeDirRouter = require('./routes/makeDir.js');
var synopsisRouter = require('./routes/synopsis.js');
var getDepthRouter = require('./routes/getDepth.js');
var uploadRouter = require('./routes/upload.js');

app.use('/vodlist', filelistsRouter);
app.use('/renameFile', renameFileRouter);
app.use('/deleteFile', deleteFileRouter);
app.use('/makeDir', makeDirRouter);
app.use('/requesthls', requesthlsRouter);
app.use('/synopsis', synopsisRouter);
app.use('/getDepth', getDepthRouter);
app.use('/upload', uploadRouter);


//auto Encoding Section

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


var ffmpeg = require('fluent-ffmpeg');
const Promise = require('bluebird');

var encodingList = new Array();
var isEncoding = false;
var curFile = null;
app.post('/uploadEncoding', upload.array('files'), (req, res) => {
	res.status(200).send();
	var files = req.files;
	var getMetaData = require('./models/filedata');
	for(i in files){
		getMetaData(files[i],'.mp4',function(metafile){
			const vodmeta = new Vodmeta(metafile);
			vodmeta.save().
			then((result) => {
				console.log(result);
			})
			.catch((err) => {
				console.error(err);
				next(err);
			});
		});
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
		if(encodingList.length > 0){
			console.log(encodingList.length + ' more files to encoding ' + encodingList);
		}
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


