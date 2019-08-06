var autoEncoding = async function(files, options='', encOp={format: 'mp4', audio: 'aac', video: 'h264', vcodec: 'libx264', acodec: 'aac'}){
	var ffmpeg = require('fluent-ffmpeg');
	const Promise = require('bluebird');
	function promisifyCommand (command) {
		return Promise.promisify( (cb) => {
			command
			.on( 'end', () => { cb(null)})
			.on( 'error', () => {cb(error)})
			.run()
		})
	}
	for(i in files){
		var checker =  ffmpeg().input(files[i]['path']).ffprobe(i, async function(err, data){
			console.log('checker called');
			if(data == undefined){
				console.log('invalid data');
				return;
			}
			var needEncoding = true;
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
				
				var command = await ffmpeg(options)
						.on('progress', function(progress){
					console.log('processing : ' + progress.percent);
				})
				.input(data['format']['filename'])
				.output(replaceFormat)
				.audioCodec(encOp['acodec']).videoCodec(encOp['vcodec'])
				console.log('after command');
				command = await promisifyCommand(command);
				await command()
				.then ( () => {})
				.catch ( (error) => {})
			}
		});
		checker = await promisifyCommand(checker);
		console.log('await checker called');
		await checker()
		.then( () => {})
		.catch( (error) => {})
	}
}


//test code
//autoEncoding([{path : 'vods/transfer1.avi'}, {path: 'test.js'}, {path: 'vods/transfer2.avi'}, {path: 'sample_720p.mp4'}]);

module.exports = autoEncoding;

	

