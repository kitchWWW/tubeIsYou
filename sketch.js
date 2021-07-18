
function find_angle(A, B, C) {
  var AB = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
  var BC = Math.sqrt(Math.pow(B[0] - C[0], 2) + Math.pow(B[1] - C[1], 2));
  var AC = Math.sqrt(Math.pow(C[0] - A[0], 2) + Math.pow(C[1] - A[1], 2));
  return Math.abs(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI));
}

function averagePoints(pa, pb) {
  return [(pa.x + pb.x) / 2.0, (pa.y + pb.y) / 2.0]
}

function processAngle(angle) {
  if (angle < 5) {
    return 0
  }
  if (angle > 175) {
    return 1
  }
  return angle * (1 / 180.0)
}

function ramdomizePoint(p, amount) {
  return {
    x: p.x - (amount / 2) + (Math.random() * amount),
    y: p.y - (amount / 2) + (Math.random() * amount)
  }
}

function drawCenteredImage(x, y, sideLength, image) {
  ctx.drawImage(image, x - (sideLength / 2), y - (sideLength / 2), sideLength, sideLength)
}

// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var vTubeIsYou = document.getElementById("vTubeIsYou");
var startButton = document.getElementById("start");



// IMAGES AND RESOURCES

const sunflower_head_image = new Image(200, 200); // Using optional size for image
sunflower_head_image.src = 'res/sunflower.png';

const earth_image = new Image(200, 200);
earth_image.src = 'res/planets/earth.png';
const europa_image = new Image(200, 200);
europa_image.src = 'res/planets/europa.png';
const jupiter_image = new Image(200, 200);
jupiter_image.src = 'res/planets/jupiter.png';
const mars_image = new Image(200, 200);
mars_image.src = 'res/planets/mars.png';
const pluto_image = new Image(200, 200);
pluto_image.src = 'res/planets/pluto.png';
const saturn_image = new Image(200, 200);
saturn_image.src = 'res/planets/saturn.png';
const venus_image = new Image(200, 200);
venus_image.src = 'res/planets/venus.png';





// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function(stream) {
    video.srcObject = stream;
    video.play();
  });
}

var NOT_STARTED_SECTION = 'NOT_STARTED_SECTION'
var TUBE_DUO_SECTION = 'TUBE_DUO_SECTION'
var SPACE_TUBE_SECTION = 'SPACE_TUBE_SECTION'
var SUNFLOWER_SECTION = 'SUNFLOWER_SECTION'
var CLOUD_SECTION = 'CLOUD_SECTION'
var CAR_TUBE_SECTION = 'CAR_TUBE_SECTION'
var ENDED_SECTION = "ENDED_SECTION"
var SECTION = NOT_STARTED_SECTION



function drawBaseImage() {
  ctx.clearRect(0, 0, 800, 600);
  if (SECTION === NOT_STARTED_SECTION) {
    // 
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(video, 800, 0, -800, 600);
    ctx.restore();
  } else if (SECTION === SUNFLOWER_SECTION) {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, 800, 600);
  } else if (SECTION === SPACE_TUBE_SECTION) {

  } else if (SECTION === CLOUD_SECTION) {

  } else if (SECTION === ENDED_SECTION) {
    ctx.drawImage(video, 0, 0, 800, 600);
  } else {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 800, 600);
  }
}
var clouds = []
function drawPoseImage(pose) {
  if (SECTION === NOT_STARTED_SECTION) {
    return
  } else if (SECTION === SUNFLOWER_SECTION) {
    console.log(pose)
    ctx.beginPath(); // Start a new path
    ctx.lineWidth = 50;
    ctx.strokeStyle = "#88CC22";
    ctx.moveTo(pose.nose.x, pose.nose.y);
    var intersect = averagePoints(pose.leftShoulder, pose.rightShoulder)
    intersect[1] = intersect[1] + 50
    ctx.lineTo(...intersect);
    var base = averagePoints(pose.leftShoulder, pose.rightShoulder)
    ctx.lineTo(base[0], base[1] + 600); // Draw a line to (150, 100)
    ctx.moveTo(...intersect);
    ctx.lineTo(pose.leftWrist.x, pose.leftWrist.y);
    ctx.moveTo(...intersect);
    ctx.lineTo(pose.rightWrist.x, pose.rightWrist.y);
    var intersect2 = [...intersect]
    intersect2[1] = intersect[1] + 125
    ctx.moveTo(...intersect2);
    ctx.lineTo(pose.rightWrist.x - 30, pose.rightWrist.y + 150);
    var intersect3 = [...intersect]
    intersect3[1] = intersect[1] + 175
    ctx.moveTo(...intersect3);
    ctx.lineTo(pose.leftWrist.x + 50, pose.leftWrist.y + 150);
    ctx.stroke();
    drawCenteredImage(pose.nose.x, pose.nose.y, 300, sunflower_head_image)
  } else if (SECTION === SPACE_TUBE_SECTION) {
    drawCenteredImage(pose.rightElbow.x, pose.rightElbow.y, 200, jupiter_image)
    drawCenteredImage(pose.nose.x, pose.nose.y, 200, saturn_image)
    drawCenteredImage(pose.rightWrist.x, pose.rightWrist.y, 70, pluto_image)
    drawCenteredImage(pose.leftWrist.x, pose.leftWrist.y, 90, mars_image)
    drawCenteredImage(pose.leftElbow.x, pose.leftElbow.y, 100, europa_image)
    drawCenteredImage(pose.rightShoulder.x, pose.rightShoulder.y, 50, earth_image)
    drawCenteredImage(pose.leftShoulder.x, pose.leftShoulder.y, 60, venus_image)
  } else if (SECTION === CLOUD_SECTION) {
    ctx.lineWidth = 40;
    ctx.strokeStyle = "#FFFFFF";
    clouds.push(ramdomizePoint(pose.nose, 60))
    clouds.push(ramdomizePoint(pose.leftWrist, 60))
    clouds.push(ramdomizePoint(pose.rightWrist, 60))
    while (clouds.length > 40) {
      clouds.shift()
    }
    for (var i = 0; i < clouds.length; i++) {
      var cloud = clouds[i]
      ctx.beginPath()
      ctx.arc(cloud.x, cloud.y, 20, 0, 2 * Math.PI)
      ctx.stroke();
    }
  }
}

function updateAudioStates(pose) {
  if (SECTION === NOT_STARTED_SECTION) {
    return
  }

}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas

  drawBaseImage()


  // We can call both functions to draw all keypoints and the skeletons
  if (poses.length > 0) {
    pose = poses[0].pose
    drawPoseImage(pose)
    updateAudioStates(pose)
  }

  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on("pose", gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready");
  poseNet.multiPose(video);
}



let oscillator = null
let gainNode = null
let audioCtx = null
let biquadFilter = null

function start() {
  vTubeIsYou.play()
// vwholething.style.display = 'inline'
// vintro.style.display = 'none'
// vintro.style.marginRight = '-400px';
// vwholething.play()
// vcello.play()
}

function go() {
  // create web audio api context
  // audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // // create Oscillator node
  // oscillator = audioCtx.createOscillator();
  // gainNode = audioCtx.createGain();
  // gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  // oscillator.type = 'square';
  // oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz


  // biquadFilter = audioCtx.createBiquadFilter();

  // // Manipulate the Biquad filter

  // biquadFilter.type = "lowpass";
  // biquadFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
  // biquadFilter.gain.setValueAtTime(1, audioCtx.currentTime);

  // oscillator.connect(gainNode);
  // gainNode.connect(biquadFilter);
  // biquadFilter.connect(audioCtx.destination);
  // // oscillator.start();





  vTubeIsYou.play()

  SECTION = CLOUD_SECTION

  // setTimeout(function() {
  //   oscillator.start();
  //   startButton.style.display = 'block'
  // }, 23000);



}