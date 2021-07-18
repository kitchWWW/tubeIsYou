// B is center point
function find_angle(A, B, C) {
  var AB = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
  var BC = Math.sqrt(Math.pow(B[0] - C[0], 2) + Math.pow(B[1] - C[1], 2));
  var AC = Math.sqrt(Math.pow(C[0] - A[0], 2) + Math.pow(C[1] - A[1], 2));
  return Math.abs(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI));
}

function processAngle(angle) {
  if (angle < 10) {
    return 0
  }
  if (angle > 170) {
    return 1
  }
  return angle * (1 / 180.0)
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

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
  });
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints(); 
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

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  console.log(poses);
  for (let i = 0; i < poses.length; i += 1) { 
    if(i = 0){
      pose = poses[i]
      console.log(pose)
     if (oscillator != null) {
        oscillator.frequency.linearRampToValueAtTime(220 * (1 + processAngle(left_arm_angle)), audioCtx.currentTime + .1)
        gainNode.gain.linearRampToValueAtTime(processAngle(right_arm_angle), audioCtx.currentTime + .1)
        biquadFilter.frequency.linearRampToValueAtTime(100 + (44000 * (processAngle(180 - right_elbow_angle) * processAngle(180 - right_elbow_angle))), audioCtx.currentTime + .1)
      }
    }
  }
}

let oscillator = null
let gainNode = null
let audioCtx = null
let biquadFilter = null

function go(){
	// create web audio api context
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // create Oscillator node
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz


  biquadFilter = audioCtx.createBiquadFilter();

  // Manipulate the Biquad filter

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
  biquadFilter.gain.setValueAtTime(1, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(biquadFilter);
  biquadFilter.connect(audioCtx.destination);
  oscillator.start();
}
