
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

