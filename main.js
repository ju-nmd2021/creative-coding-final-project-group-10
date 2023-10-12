let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

//Points fingers
/* 0-4 Thumb
   0-8 Index finger
   0-12 Middle finger
   0-16 Ring finger
   0-20 Pinky
*/
// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const { getBarsBeats, addTimes, getTransportTimes, mergeMusicDataPart } =
  toneRhythm.toneRhythm(Tone.Time);

const synth = new Tone.FMSynth().toMaster();
const seq = new Tone.Sequence(
  (time, tone) => {
    synth.triggerAttackRelease(tone, 0.6, time);
  },
  ["C3", ["A2", "E3", "D3"], "D2", ["G2", "E2"]]
);
Tone.Transport.start();


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
  if (detectionIsActivated) {
    image(video, 0, 0, 640, 480);
    for (let hand of predictions) {
      // const x1 = hand.boundingBox.topLeft[0];
      // const y1 = hand.boundingBox.topLeft[1];
      // const x2 = hand.boundingBox.bottomRight[0];
      // const y2 = hand.boundingBox.bottomRight[1];
      // push();
      // noFill();
      // stroke(0, 255, 0);
      // rectMode(CORNERS);
      // rect(x1, y1, x2, y2);
      // pop();

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

function musicSeq () {
  Tone.start();

  seq.start(0);
  seq.probability = 0.3;
  seq.humanize = "8n";

  // Coutdown was taken from https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
  var timeleft = 10;
  var playTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(playTimer);
      document.getElementById("countdown").innerHTML = "Finished";
      seq.stop(0);
    } else {
      document.getElementById("countdown").innerHTML =
        timeleft + " seconds remaining";
    }
    timeleft -= 1;
  }, 1000);
}

function generateBeat() {
  // document.getElementById("demo").innerHTML = "Hello World";
 
  musicSeq ();
  

  const music = { probability: 0.3, humanize: "32n" };
  localStorage.music = JSON.stringify(music);
}

continueButton.addEventListener("click", startCamera);

function startCamera() {
  //document.getElementById("test").innerHTML = "Camera";

  //Starting the hand detection
  detectionIsActivated = true;

  //Create new buttons together with opening the camera
  //Buttons
  const newButtonRecord = document.createElement("button");
  newButtonRecord.textContent = "Start Recording";
  newButtonRecord.id = "recordButton";
  newButtonRecord.className = "cameraButtons";
  document.body.appendChild(newButtonRecord);

  const newButtonStop = document.createElement("button");
  newButtonStop.textContent = "Stop Recording";
  newButtonStop.id = "stopButton";
  newButtonStop.className = "cameraButtons";
  document.body.appendChild(newButtonStop);

  const newButtonFinish = document.createElement("button");
  newButtonFinish.textContent = "Finish";
  newButtonFinish.id = "finishButton";
  newButtonFinish.className = "cameraButtons";
  document.body.appendChild(newButtonFinish);

  //Get sequence from local storage
  newButtonRecord.addEventListener("click", function () {
    /*Tone.start();
    seq.start(0);
    var timeleft = 10;
    var playTimer = setInterval(function () {
      if (timeleft <= 0) {
        clearInterval(playTimer);
        document.getElementById("countdown").innerHTML = "Finished";
        seq.stop(0);
      } else {
        document.getElementById("countdown").innerHTML =
          timeleft + " seconds remaining";
      }
      timeleft -= 1;
    }, 1000); */
    musicSeq();
    const music = JSON.parse(localStorage.music);
    music.probability = seq.probability;
    music.humanize = seq.humanize;
    detectionIsActivated = true;
  });

  //Go to results page
  newButtonFinish.addEventListener("click", function () {
    window.open("result.html");
  });
}

function modelLoaded() {
  console.log("Model Loaded!");
}
