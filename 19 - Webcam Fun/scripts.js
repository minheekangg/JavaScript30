const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//get video live stream to render on the screen
function getVideo () {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream, video.src)
        video.srcObject = localMediaStream; //live video feed
        video.play();
    })
    .catch(err=>console.log(err))
}

getVideo();