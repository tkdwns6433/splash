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
        xhr.open('GET', 'http://' + hostname + ':8390/getDepth?json=' + JSON.stringify(json) + '&distinct=' + library[depthStacks.length]);
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

