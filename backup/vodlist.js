var currentPath = 'vods';

function setPath(path){
	currentPath = path;
	var actionUpload = document.getElementById('uploadForm');
	if(actionUpload != null){
		actionUpload.action = 'http://127.0.0.1:8390/upload?path=' + path;
	}
	var actionUploadEnc = document.getElementById('uploadFormEncoding');
	if(actionUploadEnc != null){
		actionUploadEnc.action = 'http://127.0.0.1:8390/uploadEncoding?path=' + path;
	}
}

function makeDir(){
	var dirName = prompt('input Directory name');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8390/makeDir' + '?path=' + currentPath + '&dirName=' + dirName);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
	if (xhr.status = 200) {
		var vodlists = xhr.response;
		getVodList('admin', currentPath);
	} 
	else {
		console.log('Error ${xhr.status} : ${xhr.statusText}');
	}
	};
}

function playVideo(vodname){
	alert(vodname.value + '  this is file');
}

function moveFolder(page, folderName){
	console.log('before folder');
	var Parent = document.getElementById('tbody');
	while(Parent.hasChildNodes()){
		Parent.removeChild(Parent.firstChild);
	}
	setPath(folderName.value);
	getVodList(page, folderName.value);
	console.log('after folder');
}

function upperFolder(page)
{
	if(currentPath == 'vods'){
		alert('already Top Folder');
	}
	else{
	var path = currentPath.split('/');
	path.pop();
	moveFolder(page, path.join('/'));
	}
}

function renameFile(path){
	var rename = prompt('input rename');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8390/renameFile' + '?path=' + path.value + '&rename=' + rename);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			getVodList('admin', currentPath);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
}

function deleteFile(path){
	if(confirm('really want to delete file or folder?')){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://127.0.0.1:8390/deleteFile' + '?path=' + path.value);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			getVodList('admin', currentPath);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	}
}}

function drawDirectory(page, jsondir='vods'){
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
		if(page == 'front'){
			if(cell3.innerHTML == 'file'){
				cell4.innerHTML = '<button value=' + children[file]['path'] + ' onclick=\'playVideo(this)\'></button>';
			}
			else if(cell3.innerHTML == 'directory'){
	                        cell4.innerHTML = '<button value=' + children[file]['path'] + ' onclick=\"moveFolder(\'front\', this)\"></button>';
			}
				}
		else if(page == 'admin'){
			if(cell3.innerHTML == 'file'){
				cell4.innerHTML = '<button value=' + children[file]['path'] + '></button>';
			}
			else if(cell3.innerHTML == 'directory'){
	                        cell4.innerHTML = '<button value=' + children[file]['path'] + ' onclick=\"moveFolder(\'admin\',this)\"></button>';
			}
			var cell5 = row.insertCell(5);
 			var cell6 = row.insertCell(6);
			cell5.innerHTML =  '<button value=' + children[file]['path'] + ' onclick=\'deleteFile(this)\'></button>';
			cell6.innerHTML =  '<button value=' + children[file]['path'] + ' onclick=\'renameFile(this)\'></button>';
		}
	}}

function getVodList(page, dir='vods'){
	console.log('getVodListCalls');
	setPath(dir);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8390/vodlist' + '?dir=' + dir);
	xhr.withCredentials = true;
	xhr.send();
	xhr.onload = function() {
		if (xhr.status = 200) {
			var vodlists = xhr.response;
			drawDirectory(page,vodlists);
		} 
		else {
			console.log('Error ${xhr.status} : ${xhr.statusText}');
		}
	};
};
