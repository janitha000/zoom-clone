const socket = io('/')
const videoGrid = document.getElementById('video-grid');
let myVideo = document.createElement('video');
myVideo.muted = true;


let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream)
})

const connectToNewUser = () => {
    console.log('User connected')
}

socket.emit('join-room', ROOM_ID);

socket.on('user-connected', () => {
    connectToNewUser()
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}