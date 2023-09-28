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

// let timeLeft = 10;
// let timeCounting;
// function timeCounter() {
//   if (timeLeft > 0) {
//     timeCounting = setTimeout(timeCounter, 1000);
//   }
//   if (timeCounting === 10000) {
//     clearTimeout(timeCounting);
//     seq.stop(0);
//   }
// }

function generateBeat() {
  // document.getElementById("demo").innerHTML = "Hello World";

  Tone.start();

  seq.start(0);
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
  image(video, 350, 70, 640, 480);
}
