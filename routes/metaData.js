var responseFalse = {Title: 'N/A', Year: 'N/A', Rated: 'N/A', Released: 'N/A', Runtime:'N/A', Genre:'N/A', Director:'N/A', Write:'N/A', Actors:'N/A', Plot:'N/A', Language:'N/A', Country:'N/A', Awards:'N/A', Poster:'N/A', Ratings:'N/A', Metascore:'N/A', imdRating:'N/A', imdVotes:'N/A',imdID:'N/A', Type:'N/A', DVD:'N/A', BoxOffice:'N/A', Production:'N/A', Website:'N/A', Response:'False'}

var getMetaData = function (file, format, callback){
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
	var xhr = new XMLHttpRequest();
	var path = require('path');
	xhr.open('GET', 'http://www.omdbapi.com/?i=tt3896198&apikey=c71d670a' + '&t=' + file['originalname'].replace(path.extname(file['originalname']),''));		
	xhr.send();
	xhr.onload = function(){
		if(xhr.status = 200) {
			console.log('movie api 200');
			var metadata = JSON.parse(xhr.responseText);
			if(metadata['Response'] == 'False'){
				metadata = responseFalse;	
			}
			if(path.extname(file['originalname']) == format){
				metadata['path'] = file['path'];
			}
			else{
				metadata['path'] = file['path'].replace(path.extname(file['originalname']),'.mp4')
			}
			metadata['originalname'] = file['originalname'].replace(path.extname(file['originalname']),'.mp4')
			callback(metadata);
		}
		else{
			cosnole.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};

};

module.exports = getMetaData;

