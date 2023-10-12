let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

const { getBarsBeats, addTimes, getTransportTimes, mergeMusicDataPart } =
  toneRhythm.toneRhythm(Tone.Time);

//Synth with recorder
const recorder = new Tone.Recorder();
const synth = new Tone.FMSynth().connect(recorder).toMaster();
recorder.start();
const scaleForSeq = ["C3", "A2", "E3", "D3", "D2", "G2", "E2"];
const seq = new Tone.Sequence(
  (time, tone) => {
    const randomTone =
      scaleForSeq[Math.floor(Math.random() * scaleForSeq.length)];
    synth.triggerAttackRelease(randomTone, "2n", time);
  },
  Array.from({ length: 16 }),
  "2n"
);
Tone.Transport.start();

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose = ml5.handpose(video, modelLoaded);
  handpose.on("hand", (results) => {
    predictions = results;
  });
}

//Synths for open and closed Hand
let sense = false;
const synthOpenHand = new Tone.Synth().connect(recorder).toDestination();
const pentatonicScale = ["D2", "E2", "Gb2", "A2", "B2"];
const newSequence = new Tone.Sequence(
  (time, note) => {
    const randomNote =
      pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
    synthOpenHand.triggerAttackRelease(randomNote, "8n", time);
  },
  Array.from({ length: 16 }),
  "4n"
);

const synthClosedHand = new Tone.Synth().connect(recorder).toDestination();
const pentatonicScaleClosed = ["G4", "A4", "B4", "D4", "E4"];
const newSequenceClosed = new Tone.Sequence(
  (time, note) => {
    const randomNote =
      pentatonicScaleClosed[
        Math.floor(Math.random() * pentatonicScaleClosed.length)
      ];
    synthClosedHand.triggerAttackRelease(randomNote, "8n", time);
  },
  Array.from({ length: 16 }),
  "4n"
);

//Object for storing
let objectOfSequence = {
  beatSequence: ["C3", "A2", "E3", "D3", "D2", "G2", "E2"],
  openHandSequence: ["D2", "E2", "Gb2", "A2", "B2"],
  closedHandSequence: ["G4", "A4", "B4", "D4", "E4"],
};

//Function to store in Local Storage
function storeInLocalStorage() {
  localStorage.objectOfSequence = JSON.stringify(objectOfSequence);
}

//Function to retrieve from Local Storage
function retrieveFromLocalStorage() {
  let objectOfSequence = JSON.parse(localStorage.objectOfSequence);
  objectOfSequence.beatSequence = seq.beatSequence;
  objectOfSequence.openHandSequence = newSequence.openHandSequence;
  objectOfSequence.closedHandSequence = newSequenceClosed.closedHandSequence;
}

function draw() {
  if (detectionIsActivated) {
    image(video, 0, 0, 640, 480);
    for (let hand of predictions) {
      const landmarks = hand.landmarks;
      for (let landmark of landmarks) {
        push();
        noStroke();
        fill(0, 255, 0);
        ellipse(landmark[0], landmark[1], 10);
        pop();
      }

      let x1 = predictions[0].boundingBox.topLeft[0];
      let x2 = predictions[0].boundingBox.bottomRight[0];
      let w = x2 - x1;

      //Calculate the distance between two points of the finger (thumb tip and middle finger tip)
      let thumbX = landmarks[4][0];
      let thumbY = landmarks[4][1];
      let middleFingerX = landmarks[12][0];
      let middleFingerY = landmarks[12][1];

      let currentThumbX = thumbX;
      let currentMiddleFingerX = middleFingerX;

      let currentThumbY = thumbY;
      let currentMiddleFingerY = middleFingerY;

      currentThumbX += (thumbX - currentThumbX) / 4;
      currentMiddleFingerX += (middleFingerX - currentMiddleFingerX) / 4;

      currentThumbY += (thumbY - currentThumbY) / 4;
      currentMiddleFingerY += (middleFingerY - currentMiddleFingerY) / 4;

      let distance = dist(
        currentThumbX,
        currentThumbY,
        currentMiddleFingerX,
        currentMiddleFingerY
      );

      let minDistance = 0.2;
      let maxDistance = 1.5;

      //Map distance to play different tones
      mappedDistance = map(distance / w, 0, 1, 0.2, 2.0);
      if (mappedDistance > 0.8) {
        sense = false;

        Tone.Transport.start();
        newSequenceClosed.stop();
        newSequence.start();
      } else {
        //if (Tone.context.state !== "running") {

        newSequence.stop();
        if (sense === false) {
          sense = true;
          Tone.Transport.start();
          newSequenceClosed.start();
        }
      }
    }
  }
}

const startBeatButton = document.getElementById("startBeatButton");

const continueButton = document.getElementById("continueButton");

startBeatButton.addEventListener("click", generateBeat);

function generateBeat() {
  Tone.start();

  seq.start(0);

  // Coutdown was taken from https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
  var timeleft = 10;
  var playTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(playTimer);
      document.getElementById("countdown").innerHTML = "Finished";
      seq.stop(0);
      //Code for recording and downloading was taken from: https://tonejs.github.io/docs/14.7.77/Recorder
      setTimeout(async () => {
        // the recorded audio is returned as a blob
        const recording = await recorder.stop();
        // download the recording by creating an anchor element and blob url
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement("a");
        anchor.download = "recording.webm";
        anchor.href = url;
        anchor.click();
      }, 4000);
    } else {
      document.getElementById("countdown").innerHTML =
        timeleft + " seconds remaining";
    }
    timeleft -= 1;
  }, 1000);

  storeInLocalStorage();
}

continueButton.addEventListener("click", startCamera);

function startCamera() {
  Tone.start();
  //Starting the hand detection
  detectionIsActivated = true;

  //Create new buttons together with opening the camera
  //Buttons
  const newButtonRecord = document.createElement("button");
  newButtonRecord.textContent = "Start Recording";
  newButtonRecord.id = "recordButton";
  newButtonRecord.className = "cameraButtons";
  document.body.appendChild(newButtonRecord);

  const newButtonFinish = document.createElement("button");
  newButtonFinish.textContent = "Finish";
  newButtonFinish.id = "finishButton";
  newButtonFinish.className = "cameraButtons";
  document.body.appendChild(newButtonFinish);

  //Get sequence from local storage
  newButtonRecord.addEventListener("click", function () {
    generateBeat(); //not needed if storage is working
    retrieveFromLocalStorage();

    setTimeout(async () => {
      // the recorded audio is returned as a blob
      const recording = await recorder.stop();
      // download the recording by creating an anchor element and blob url
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = "recording.webm";
      anchor.href = url;
      anchor.click();
    }, 10000);

    detectionIsActivated = true;
    storeInLocalStorage();
  });

  //Go to results page
  newButtonFinish.addEventListener("click", function () {
    window.open("end.html");
  });
}

function modelLoaded() {
  console.log("Model Loaded!");
}
