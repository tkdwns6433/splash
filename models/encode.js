var autoEncoding = async function(file, options='', encOp={format: 'mp4', audio: 'aac', video: 'h264', vcodec: 'libx264', acodec: 'aac'}){
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
		var command =  ffmpeg(options)
				.on('progress', function(progress){
					console.log('processing : ' + progress.percent);
				})
				.input(files[i]['path'])
				.output(files[i]['path'] + '.mp4')
				.audioCodec(encOp['acodec']).videoCodec(encOp['vcodec'])
				command = await promisifyCommand(command);
				await command()
				.then ( () => {})
				.catch ( (error) => {})
			}
}


//test code
//autoEncoding([{path : 'vods/transfer1.avi'}, {path: 'test.js'}, {path: 'vods/transfer2.avi'}, {path: 'sample_720p.mp4'}]);

module.exports = autoEncoding;

	

