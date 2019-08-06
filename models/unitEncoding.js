var autoEncoding = function(file, options='', encOp={format: 'mp4', audio: 'aac', video: 'h264', vcodec: 'libx264', acodec: 'aac'}){
	var ffmpeg = require('fluent-ffmpeg');
	var checker = ffmpeg();
	var command = ffmpeg(options);
	var needEncoding = true;
	checker.input(file['path']).ffprobe(i, function(err, data){
		if(data == undefined){
			console.log('invalid data');
			return;
		}
		//format
		var formats =  data['format']['format_name'].split(',');
		for(k in formats){
			if(formats[i] == encOp['format']){
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
			var replaceFormat = data['format']['filename'];
			for(l in formats){
				replaceFormat = replaceFormat.replace('.' + formats[l],'.' + encOp['format']);
			}
			command.on('progress', function(progress){
				console.log('processing : ' + progress.percent);
			});
			command.input(data['format']['filename']);
			command.output(replaceFormat);
			command.audioCodec(encOp['acodec']).videoCodec(encOp['vcodec']);
			}
		});
	if(needEncoding){
		return command;
	}
	else{
		return () => { console.log('no need for encoding');};
	}
}


//test code
//autoEncoding([{path : 'vods/transfer1.avi'}, {path: 'test.js'}, {path: 'vods/transfer2.avi'}, {path: 'sample_720p.mp4'}]);

module.exports = autoEncoding;

	

