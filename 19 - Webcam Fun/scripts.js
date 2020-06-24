const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//get video live stream to render on the screen
function getVideo () {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
        // console.log(localMediaStream, video.src)
        video.srcObject = localMediaStream; //live video feed
        video.play();
    })
    .catch(err=>console.log(err))
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height; 
    //format canvas to be height and width of the video captured.

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height) //start videp at top left, with width and height

        //TO ADD FILTERS:
        // take pixels out
        let pixels = ctx.getImageData(0,0,width, height);
        // mess with them
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.8;
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0,0);
    }, 16); //every 16ms canvas will upload.
};


function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    //take the data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'photo');
    link.innerHTML = `<img src="${data}" alt="photo" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i <  pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red: increase by 100
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //green: decrease by 50
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue: decrease by 50%
    }
    return pixels
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // red: backward by 150
        pixels.data[i + 100] = pixels.data[i + 1]; //green: forward by 100px
        pixels.data[i - 150] = pixels.data[i + 2]; //blue: backward by 150
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input)=> {
        levels[input.name] = input.value;
    });

    for ( i = 0; i < pixels.data.length; i+=4){
        red = pixels.data[i+0];
        green = pixels.data[i+1];
        blue = pixels.data[i+2];
        alpha = pixels.data[i+3];

        if (red >= levels.rmin 
            && green >= levels.gmin 
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax ) {
                pixels.data[i + 3] = 0;
            }
    }
}

getVideo();

video.addEventListener('canplay', paintToCanvas)

