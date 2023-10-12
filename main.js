let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

const { getBarsBeats, addTimes, getTransportTimes, mergeMusicDataPart } =
  toneRhythm.toneRhythm(Tone.Time);

// const synth = new Tone.FMSynth().toMaster();
// const seq = new Tone.Sequence(
//   (time, tone) => {
//     synth.triggerAttackRelease(tone, 0.6, time);
//   },
//   ["C3", ["A2", "E3", "D3"], "D2", ["G2", "E2"]]
// );
// Tone.Transport.start();

const recorder = new Tone.Recorder();
const synth = new Tone.FMSynth().connect(recorder).toMaster();
recorder.start();
const scaleForSeq = ["C3", "A2", "E3", "D3", "D2", "G2", "E2"];
const seq = new Tone.Sequence(
  (time, tone) => {
    const randomTone = scaleForSeq[Math.floor(Math.random()*scaleForSeq.length)];
    synth.triggerAttackRelease(randomTone, '2n', time);
  }, Array.from({length:16}), '2n'
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

let sense = false;
const synth2 = new Tone.Synth().toDestination();
      const pentatonicScale = ['D2','E2','Gb2','A2','B2'];
      const newSequence = new Tone.Sequence((time,note)=>{
        const randomNote = pentatonicScale[Math.floor(Math.random()*pentatonicScale.length)];
        synth2.triggerAttackRelease(randomNote, '8n', time);
      }, Array.from({length: 16}), '4n');

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
      newSequence.start(0);
   
    }else{
      if (Tone.context.state !== "running") {
        Tone.start();
      }
      newSequence.stop();
      if (sense=== false) {
        sense=true;    
      const synth = new Tone.DuoSynth().toMaster();
      synth.triggerAttackRelease("C4", "4n");
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
  // seq.probability = 0.3;
  // seq.humanize = "8n";
  
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
 

    const music = { probability: 0.3, humanize: "32n" };
    localStorage.music = JSON.stringify(music);
}


continueButton.addEventListener("click", startCamera);

function startCamera() {

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

     generateBeat();
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
