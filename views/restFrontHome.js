var currentPath = 'vods';

var hostname = document.location.hostname;

function setPath(path){
	currentPath = path;
}

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

function renderPoster(){
	var posters = document.getElementById('posters');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/metadata?json={}');
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var metadatas = JSON.parse(xhr.response);
			var posters = document.getElementById('posters');
			var div = document.createElement('div');
			div.className = 'row';
			posters.appendChild(div);
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

renderPoster();
function drawDirectory(jsondir='vods'){
	var tbody = document.getElementById('tbody');
	while(tbody.hasChildNodes()){
		tbody.removeChild(tbody.firstChild);
	}
        var children = JSON.parse(jsondir)['children'];
	for(file in children){
		var row = tbody.insertRow(tbody.rows.length);
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		cell0.innerHTML = children[file]['name'];
	        cell1.innerHTML = children[file]['size'];
		cell2.innerHTML = children[file]['extension'];
		cell3.innerHTML = children[file]['type'];
		if(cell3.innerHTML == 'file'){
			cell4.innerHTML = '<button value=\'' + children[file]['path'] + '\' onclick=\'playVideo(this)\'></button>';
		}
		else if(cell3.innerHTML == 'directory'){
	                cell4.innerHTML = '<button value=\'' + children[file]['path'] + '\' onclick=\"moveFolder(this)\"></button>';
		}
	}
}

function getVodList(dir='vods'){
	console.log('getVodListCalls');
	setPath(dir);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/vodlist' + '?dir=' + dir);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			drawDirectory(vodlists);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
};
