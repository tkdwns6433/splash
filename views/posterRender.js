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
        xhr.open('GET', 'http://' + hostname + ':8390/synopsis?json=' + JSON.stringify(query));
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
      
