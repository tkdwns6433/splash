const mongoose = require('mongoose');

module.exports = () => {
	const connect = () => {
		mongoose.connect('mongodb://localhost:27017/metadata',{
			dbName: 'metadata',useNewUrlParser:true,
		}, (error) => {
			if(error){
				console.log('connection error', error);
			} else {
				console.log('mongodb connection success');
			}
		});
	}
	connect();
	mongoose.connection.on('error', (error) => {
		console.error('mongodb connection error', error);
	});
	mongoose.connection.on('disconnected', () => {
		console.error('mongodb disconnected. retry connection.');
		connect();
	});
	require('./vodmeta');
};
