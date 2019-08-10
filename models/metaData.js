var responseFalse = {Title: 'N/A', Year: 'N/A', Rated: 'N/A', Released: 'N/A', Runtime:'N/A', Genre:'N/A', Director:'N/A', Write:'N/A', Actors:'N/A', Plot:'N/A', Language:'N/A', Country:'N/A', Awards:'N/A', Poster:'N/A', Ratings:'N/A', Metascore:'N/A', imdRating:'N/A', imdVotes:'N/A',imdID:'N/A', Type:'N/A', DVD:'N/A', BoxOffice:'N/A', Production:'N/A', Website:'N/A', Response:'False'}

function getMetaData(file, callback){
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://www.omdbapi.com/?i=tt3896198&apikey=c71d670a' + '&t=' + file['originalname']);		
	xhr.send();
	xhr.onload = function(){
		if(xhr.status = 200) {
			var metadata = JSON.parse(xhr.responseText);
			if(metadata['Response'] == 'False'){
				metadata = responseFalse;	
			}
			metadata['path'] = file['path'];
			callback(metadata);
		}
		else{
			cosnole.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};

};



var file = [{originalname : 'seven', path : 'some'}, {originalname : 'gagawq', path: 'any'}];
for(i in file){
	getMetaData(file[i], function(file){console.log(file);});
}


