const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const captureButton = document.getElementById('captureButton');
const recordButton = document.getElementById('recordButton');
const stopRecordButton = document.getElementById('stopRecordButton');
const switchCameraButton = document.getElementById('switchCameraButton');
const filterSelect = document.getElementById('filterSelect');
const mediaGallery = document.getElementById('mediaGallery');

let stream;
let currentStream;
let mediaRecorder;
let chunks = [];
let mediaStreamConstraints = {
    video: true,
    audio: false,
};

// Function to start the camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
        video.srcObject = stream;
        currentStream = stream;
    } catch (err) {
        console.error('Error accessing the camera: ', err);
    }
}

// Function to stop the camera
function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        currentStream = null;
    }
}

// Function to capture a photo
function capturePhoto() {
    if (currentStream) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoURL = canvas.toDataURL('image/png');
        const photoElement = new Image();
        photoElement.src = photoURL;
        mediaGallery.appendChild(photoElement);
    }
}

// Function to start recording video
function startRecording() {
    if (currentStream) {
        mediaRecorder = new MediaRecorder(currentStream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        chunks = [];
    }
}

// Function to stop recording video
function stopRecording() {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

// Function to handle recorded data
function handleDataAvailable(event) {
    chunks.push(event.data);
}

// Function to switch cameras
async function switchCamera() {
    mediaStreamConstraints = {
        video: {
            facingMode: (mediaStreamConstraints.video.facingMode === 'user') ? 'environment' : 'user'
        },
        audio: false
    };
    stopCamera();
    await startCamera();
}

// Function to apply filters to the video
function applyFilter() {
    const selectedFilter = filterSelect.value;
    video.style.filter = selectedFilter;
}

// Event listeners for the buttons
startButton.addEventListener('click', startCamera);
stopButton.addEventListener('click', stopCamera);
captureButton.addEventListener('click', capturePhoto);
recordButton.addEventListener('click', startRecording);
stopRecordButton.addEventListener('click', stopRecording);
switchCameraButton.addEventListener('click', switchCamera);
filterSelect.addEventListener('change', applyFilter);
