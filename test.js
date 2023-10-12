let video;
let handpose;
let predictions = [];
let detectionIsActivated = true;

// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

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

  // if (detectionIsActivated) {
  //   for (let hand of predictions) {
  //     // const x1 = hand.boundingBox.topLeft[0];
  //     // const y1 = hand.boundingBox.topLeft[1];
  //     // const x2 = hand.boundingBox.bottomRight[0];
  //     // const y2 = hand.boundingBox.bottomRight[1];
  //     // push();
  //     // noFill();
  //     // stroke(0, 255, 0);
  //     // rectMode(CORNERS);
  //     // rect(x1, y1, x2, y2);
  //     // pop();

  //     const landmarks = hand.landmarks;
  //     for (let landmark of landmarks) {
  //       push();
  //       noStroke();
  //       fill(0, 255, 0);
  //       ellipse(landmark[0], landmark[1], 10);
  //       pop();
  //     }
  //   }
  // }
  drawHand();
}

drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through fingers
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        let finger = Object.keys(fingerJoints)[j];
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            landmarks[firstJointIndex][0],
            landmarks[firstJointIndex][1]
          );
          ctx.lineTo(
            landmarks[secondJointIndex][0],
            landmarks[secondJointIndex][1]
          );
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = landmarks[i][0];
        // Get y point
        const y = landmarks[i][1];
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = style[i]["color"];
        ctx.fill();
      }
    });
  }
};

function modelLoaded() {
  console.log("Model Loaded!");
}
