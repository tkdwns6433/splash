var currentPath = 'vods';

var hostname = document.location.hostname;

function setPath(path){
	currentPath = path;
	var actionUpload = document.getElementById('uploadForm');
	actionUpload.action = 'http://' + hostname + ':8390/upload?path=' + path;
	var actionUploadEnc = document.getElementById('uploadFormEncoding');
	actionUploadEnc.action = 'http://' + hostname + ':8390/uploadEncoding?path=' + path;
}

function makeDir(){
	var dirName = prompt('input Directory name');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/makeDir' + '?path=' + currentPath + '&dirName=' + dirName);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
	if (xhr.status = 200) {
		var vodlists = xhr.response;
		getVodList(currentPath);
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

function upperFolder(page)
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

function renameFile(path){
	var rename = prompt('input rename');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + hostname + ':8390/renameFile' + '?path=' + path.value + '&rename=' + rename);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			getVodList(currentPath);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
}

function deleteFile(path){
	if(confirm('really want to delete file or folder?')){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://' + hostname + ':8390/deleteFile' + '?path=' + path.value);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			getVodList(currentPath);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	}
}}

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
			cell4.innerHTML = '<button value=' + children[file]['path'] + '></button>';
		}
		else if(cell3.innerHTML == 'directory'){
	                cell4.innerHTML = '<button value=\'' + children[file]['path'] + '\' onclick=\"moveFolder(this)\"></button>';
		}
		var cell5 = row.insertCell(5);
 		var cell6 = row.insertCell(6);
		cell5.innerHTML =  '<button value=\'' + children[file]['path'] + '\' onclick=\'deleteFile(this)\'></button>';
		cell6.innerHTML =  '<button value=\'' + children[file]['path'] + '\' onclick=\'renameFile(this)\'></button>';
	}
}

function getVodList(dir='vods'){
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
