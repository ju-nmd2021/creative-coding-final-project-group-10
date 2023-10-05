let video;
let handpose;
let predictions = [];
let detectionIsActivated = true;

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

// function draw() {
//   noStroke();

//   for (var i = 0; i < points.length; i++) {
//     let red = map(points[i].x, 0, width, red1, red2);
//     let green = map(points[i].y, 0, height, green1, green2);
//     let blue = map(points[i].x, 0, width, blue1, blue2);

//     fill(red, green, blue);

//     let angle = map(
//       noise(points[i].x * angleControl, points[i].y * angleControl),
//       0,
//       1,
//       0,
//       720
//     );

//     points[i].add(createVector(cos(angle), sin(angle)));

//     ellipse(points[i].x, points[i].y, 1);
//   }
// }




function modelLoaded() {
  console.log("Model Loaded!");
}