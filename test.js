let video;
let handpose;
let predictions = [];
let detectionIsActivated = false;

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

function modelLoaded() {
  console.log("Model Loaded!");
}
