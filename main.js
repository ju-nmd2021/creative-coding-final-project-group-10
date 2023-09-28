const synth = new Tone.MonoSynth().toDestination();
const pingPongDelay = new Tone.PingPongDelay("4n", 0.5).toDestination();
const seq = new Tone.Sequence(
  (time, tone) => {
    synth.triggerAttackRelease(tone, 0.8, time);
  },
  ["C2", ["E2", "D2", "E2"], "D1", ["G1", "C1"]]
);
Tone.Transport.start();

synth.connect(pingPongDelay);
pingPongDelay.toDestination();

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
  // document.getElementById("demo").innerHTML = "Hello World";

  Tone.start();

  seq.start(0);

  // Coutdown was taken from https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
  var timeleft = 10;
  var downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "Finished";
      seq.stop(0);
    } else {
      document.getElementById("countdown").innerHTML =
        timeleft + " seconds remaining";
    }
    timeleft -= 1;
  }, 1000);
}

continueButton.addEventListener("click", startCamera);

function startCamera() {
  //   document.getElementById("test").innerHTML = "Camera";

  //Create new buttons together with opening the camera
  image(video, 350, 50, 640, 480);

  const newButtonRecord = document.createElement("button");
  newButtonRecord.textContent = "Start Recording";
  newButtonRecord.id = "record-button";
  newButtonRecord.className = "camera-buttons";
  document.body.appendChild(newButtonRecord);

  const newButtonStop = document.createElement("button");
  newButtonStop.textContent = "Stop Recording";
  newButtonStop.id = "stop-button";
  newButtonStop.className = "camera-buttons";
  document.body.appendChild(newButtonStop);

  const newButtonFinish = document.createElement("button");
  newButtonFinish.textContent = "Finish";
  newButtonFinish.id = "finish-button";
  newButtonFinish.className = "camera-buttons";
  document.body.appendChild(newButtonFinish);

  newButtonFinish.addEventListener("click", function () {
    window.open("result.html");
  });
}
