
const socket = io('/')
const videoGrid = document.getElementById('video-grid');
let myVideo = document.createElement('video');
myVideo.muted = true;

let myVideoStream;

let peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val())
            text.val('')
        }
    })

    socket.on('create-message', (msg) => {
        console.log(msg)
        $('ul').append(`<li class='message'><b>user</b><br/>${msg}</li>`)
    })
})

const connectToNewUser = (userId, stream) => {
    console.log(`${userId} User connected`)
    const call = peer.call(userId, stream)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

peer.on('open', id => {
    console.log('peer id', id)
    socket.emit('join-room', ROOM_ID, id);
})


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}

