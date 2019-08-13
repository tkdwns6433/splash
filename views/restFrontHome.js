var currentPath = 'vods';

var hostname = document.location.hostname;

var library = ['Genre', 'Actors', 'Director'];
var depthStacks = new Array();

renderDepth(library[0]);

function gnbHTML(meta){
	var div = document.createElement('div');
	div.className = 'col-sm-3'
	var button = document.createElement('button');
	button.innerHTML = meta;
	button.className = 'btn btn-primary btn-lg btn-block';
	button.setAttribute('onclick', 'renderDepth(\'' + meta + '\')');
	div.appendChild(button);
	return div;
}

function goBack(){
	if(depthStacks.length == 0){
		alert('first filter!');
	}
	else if(depthStacks.length == library.length){
		depthStacks.pop();
		renderDepth(library[depthStacks.length]);
	}
	else{
		console.log('go back called');
		console.log('before : ', depthStacks);
		depthStacks.pop();
		console.log('after : ', depthStacks);
		console.log(depthStacks.length);
		renderDepth(library[depthStacks.length]);
	}
}

function renderDepth(filter){
	var posters = document.getElementById('posters');
	var gnb = document.getElementById('gnb');
	if(!library.includes(filter) && library.length != depthStacks.length){
		depthStacks.push(filter);
	}
	var json = new Object();
	for(i in depthStacks){
		json[library[i]] = depthStacks[i]
	}
	if(depthStacks.length == library.length){
		gnb.innerHTML = 'VOD LIST';
		renderPoster(json);
		return;
	}
	gnb.innerHTML = library[depthStacks.length];
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/metaDistinct?json=' + JSON.stringify(json) + '&distinct=' + library[depthStacks.length]);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var res = xhr.response.substr(1).slice(0, -1);
			var gnb = res.split(',');
			for(i in gnb){
				gnb[i] = gnb[i].replace(/"/g, "");
			}
			var div = document.getElementById('p-row');
			while(div.firstChild){
				div.removeChild(div.firstChild);
			}
			for(i in gnb){
				var button = gnbHTML(gnb[i]);
				div.appendChild(button);
			}
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
};

function playVideo(){
	var path = document.getElementById('Path').innerHTML;
	console.log(path);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/requesthls' + '?vodpath=' + path);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			if(document.getElementById('main-player') != null){
				var fluidWrapper = document.getElementById('fluid_video_wrapper_main-player');
				fluidWrapper.remove();
			}
			var hls = xhr.response;
			var src = document.createElement('source');
			src.src = hls;
			src.type = 'application/x-mpegURL';
			var video = document.createElement('video');
			document.getElementById('modal-player-content').appendChild(video);
			video.id = 'main-player';
			video.appendChild(src);
			fluidPlayer('main-player',
				{
					layoutControls:{
						subtitlesEnabled: true,
						layout: 'default',
						playButtonShowing: false
					}
				}
			);
			var fluidWrapper = document.getElementById('fluid_video_wrapper_main-player');
			fluidWrapper.style.width = '100%';
			fluidWrapper.style.height= '100%';
			$("#modal-synopsis").modal('hide');
			$("#modal-player").modal('show');
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};

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
	xhr.open('GET', 'http://' + hostname + ':8390/metadata?json='+ JSON.stringify({"originalname":data}));
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

function posterHTML(meta){
	var div = document.createElement('div');
	div.className = 'col-sm-3'
	var img = document.createElement('img');
	var str = new String(meta['Poster']);
	if(str == 'N/A'){
		img.src = 'http://103.117.231.226//Admin/main/no_poster.png'
	}else{
		img.src = meta['Poster'];
	}
	img.style.width = '300px'; img.style.height = '445px';
	img.className = 'img-responsive';
	img.dataset.target = '.bd-example-modal-lg';
	img.dataset.toggle='modal';
	img.setAttribute('onclick', 'setModalMetaData(\'' + meta['originalname'] + '\')');
	div.appendChild(img);
	appendPara(div, meta['Title']);
	appendPara(div, meta['Year']);
	appendPara(div, meta['originalname']);
	return div;
}

function renderPoster(query='{}'){
	var posters = document.getElementById('posters');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/metadata?json=' + JSON.stringify(query));
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var metadatas = JSON.parse(xhr.response);
			var div = document.getElementById('p-row');
			while(div.firstChild){
				div.removeChild(div.firstChild);
			}
			for(i in metadatas){
					var poster = posterHTML(metadatas[i]);
					div.appendChild(poster);
			}
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
};


