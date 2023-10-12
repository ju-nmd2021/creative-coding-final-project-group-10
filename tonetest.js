let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

const {
  getBarsBeats,
  addTimes,
  getTransportTimes,
  mergeMusicDataPart
} = toneRhythm.toneRhythm(Tone.Time);

//const synth = new Tone.MonoSynth().toMaster();
const synth = new Tone.FMSynth().toMaster();
//const pingPongDelay = new Tone.PingPongDelay("4n", 0.5).toDestination();
/* const seq = new Tone.Sequence(
  (time, tone) => {
    synth.triggerAttackRelease(tone, 0.8, time);
  },
  ["C2", ["E2", "D2", "E2"], "D1", ["G1", "C1"],'4n', '8n']
);
Tone.Transport.start(); */

var arp = new Tone.Pattern(callback, ["C3", "E3", "G3"], "upDown");
arp.pattern = "downUp";

/* synth.connect(pingPongDelay);
pingPongDelay.toDestination(); */

function setup() {
  createCanvas(innerWidth, innerHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose = ml5.handpose(video, modelLoaded);
  handpose.on("hand", (results) => {
    predictions = results;
  });
}

function draw() {
  image(video, 0, 0, 640, 480);

  if (detectionIsActivated) {
    for (let hand of predictions) {
      const x1 = hand.boundingBox.topLeft[0];
      const y1 = hand.boundingBox.topLeft[1];
      const x2 = hand.boundingBox.bottomRight[0];
      const y2 = hand.boundingBox.bottomRight[1];
      push();
      noFill();
      stroke(0, 255, 0);
      rectMode(CORNERS);
      rect(x1, y1, x2, y2);
      pop();

      const landmarks = hand.landmarks;
      for (let landmark of landmarks) {
        push();
        noStroke();
        fill(0, 255, 0);
        ellipse(landmark[0], landmark[1], 10);
        pop();
      }
    }
  }
}


const startBeatButton = document.getElementById("startBeatButton");

const continueButton = document.getElementById("continueButton");

startBeatButton.addEventListener("click", generateBeat);

function generateBeat() {
  // document.getElementById("demo").innerHTML = "Hello World";

  Tone.start();
  
  arp.start(0);
  /* seq.probability=0.3;
  seq.humanize = "32n"; */

  // Coutdown was taken from https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
  var timeleft = 10;
  var downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "Finished";
      arp.stop(0);
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

  //Starting the hand detection
  detectionIsActivated = true;

  //Create new buttons together with opening the camera
  //Buttons
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

function modelLoaded() {
  console.log("Model Loaded!");
}


   // const pentatonicScaleD = ['D2','E2','Gb2','A2','H2'];
      // const scale = new Tone.Pattern((time,note)=>{
      //   synth.triggerAttackRelease(note, "4n", time);
      // }, pentatonicScaleD, "upDown");

      // //const synth = new Tone.Synth().toMaster();
      //   scale.start(0);
      //   scale.pattern = "upDown";
      // synth.triggerAttackRelease("pentatonicScaleD", "2n");