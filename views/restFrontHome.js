var currentPath = 'vods';

var hostname = document.location.hostname;

function setPath(path){
	currentPath = path;
}

function playVideo(vodname){
	var path = vodname.value;
	console.log(path);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/requesthls' + '?vodpath=' + path);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var hls = xhr.response;
			var src = document.getElementById('video-src');
			src.src = hls;
			fluidPlayer('main-player',
				{
					layoutControls:{
						subtitlesEnabled: true,
						layout: 'default',
						playButtonShowing: false
					}
				}
			);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};

}

function moveFolder(folderName){
	var Parent = document.getElementById('tbody');
	while(Parent.hasChildNodes()){
		Parent.removeChild(Parent.firstChild);
	}
	setPath(folderName.value);
	getVodList(folderName.value);
}

function upperFolder()
{
	if(currentPath == 'vods'){
		alert('already Top Folder');
	}
	else{
	var path = currentPath.split('/');
	path.pop();
	moveFolder(path.join('/'));
	}
}

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
