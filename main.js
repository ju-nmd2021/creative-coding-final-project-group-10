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

  let timeLeft;
  let timeCounting;
  if(timeLeft > 0){
    timeCounting = setTimeout(timeCounter, 1000)
  }
  if(timeCounting === 30000){
    clearTimeout(timeCounting);
    seq.stop(0);
  }
}

continueButton.addEventListener("click", startCamera);

function startCamera() {
  //   document.getElementById("test").innerHTML = "Camera";
  image(video, 350, 70, 640, 480);
}
