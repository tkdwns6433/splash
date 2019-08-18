var currentPath = 'vods';

var hostname = document.location.hostname;

var library = ['Type', 'Genre', 'Actors'];
var depthStacks = new Array();


function goBack(){
	if(depthStacks.length == 0){
		alert('first filter!');
	}
	else if(depthStacks.length == library.length){
		depthStacks.pop();
		renderDepth(library[depthStacks.length]);
	}
	else{
		depthStacks.pop();
		renderDepth(library[depthStacks.length]);
	}
}



function appendPara(div, data){
	var para = document.createElement('p');
	var node = document.createTextNode(data);
	para.appendChild(node);
	div.appendChild(para);
}

function setModalMetaData(data){
	var poster = document.getElementById('modal-poster');
	console.log('called');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/synopsis?json='+ JSON.stringify({"originalname":data}));
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var metadata = JSON.parse(xhr.response)[0];
			console.log(metadata);
			var str = new String(metadata['Poster']);
			if(str == 'N/A'){
				poster.src = 'http://103.117.231.226//Admin/main/no_poster.png'
			}else{
				poster.src = metadata['Poster'];
			}
			document.getElementById('Title').innerHTML = metadata['Title'];
			document.getElementById('Year').innerHTML = metadata['Year'];
			document.getElementById('Runtime').innerHTML = 'Runtime : ' + metadata['Runtime'];
			document.getElementById('Genre').innerHTML = 'Genre : ' +  metadata['Genre'];
			document.getElementById('Director').innerHTML = 'Director : ' +  metadata['Director'];
			document.getElementById('Actors').innerHTML = 'Actors : ' +  metadata['Actors'];
			document.getElementById('Plot').innerHTML = metadata['Plot'];
			document.getElementById('Language').innerHTML = 'Language : ' +  metadata['Language'];
			document.getElementById('Metascore').innerHTML = 'Metascore : ' +  metadata['Metascore'];
			document.getElementById('Path').innerHTML = metadata['path'];
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};

	//get request and change modal
}


