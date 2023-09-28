let video;

function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

const startBeatButton = document.getElementById("startBeatButton");

const continueButton = document.getElementById("continueButton");

startBeatButton.addEventListener("click", generateBeat);

function generateBeat() {
  document.getElementById("demo").innerHTML = "Hello World";
}

continueButton.addEventListener("click", startCamera);

function startCamera() {
//   document.getElementById("test").innerHTML = "Camera";
  image(video, 0, 0, 640, 480);
}
