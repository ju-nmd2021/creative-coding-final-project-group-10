let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

const { getBarsBeats, addTimes, getTransportTimes, mergeMusicDataPart } =
  toneRhythm.toneRhythm(Tone.Time);

const synth = new Tone.DuoSynth().toMaster();
const delay = new Tone.Delay("4n", 0.5).toDestination();
const seq = new Tone.Sequence(
  (time, tone) => {
    synth.triggerAttackRelease(tone, 0.8, time);
  },
  ["C3", ["G2", "D3", "E3"], "D2", ["G2", "C2"]]
);
Tone.Transport.start();

synth.connect(delay);
delay.toDestination();

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

function generateBeat() {
  // document.getElementById("demo").innerHTML = "Hello World";

  Tone.start();

  seq.start(0);
  seq.probability = 0.3;
  seq.humanize = "32n";

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
    Tone.start();
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
    }, 1000);
    const music = JSON.parse(localStorage.music);
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
