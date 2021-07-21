function smoothPose(pose) {
  var newPose = {}
  for (const [key, value] of Object.entries(pose)) {
    newPose[key] = {
      x: smooth(value.x, 'pose-x-' + key),
      y: smooth(value.y, 'pose-y-' + key)
    }
  }
  return newPose
}

var allSmoothedValues = {}
function smooth(value, mapKey) {
  if (allSmoothedValues[mapKey] == undefined) {
    allSmoothedValues[mapKey] = [value]
    return value
  }
  if (allSmoothedValues[mapKey].length > 10) {
    allSmoothedValues[mapKey].shift()
  }
  allSmoothedValues[mapKey].push(value)
  var total = 0;
  for (var i = 0; i < allSmoothedValues[mapKey].length; i++) {
    total += allSmoothedValues[mapKey][i];
  }
  var avg = total / allSmoothedValues[mapKey].length;
  return avg;
}
function applyFade(startingValue, endingValue, param, time) {
  console.log(startingValue)
  var currentGain = startingValue
  var myUpdatedInterval = setInterval(function() {
    currentGain = currentGain + (endingValue - startingValue) / (time / 50)
    console.log(currentGain)
    param.linearRampToValueAtTime(currentGain, 0);
    if ((startingValue < endingValue && currentGain > endingValue)
      || (startingValue > endingValue && currentGain < endingValue)) {
      clearInterval(myUpdatedInterval)
    }
  }, 50);

}
function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

function find_slope(A, B) {
  return find_angle({
    x: A.x - 5,
    y: A.y
  }, A, B)
}

function scale(x, inmin, inmax, outmin, outmax) {
  if (x < inmin) {
    x = inmin
  }
  if (x > inmax) {
    x = inmax
  }
  var indiff = inmax - inmin
  var outdiff = outmax - outmin
  var scale = outdiff / indiff
  var xscaleable = x - inmin
  return outmin + (xscaleable * scale)
}


function find_angle(A, B, C) {
  var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
  var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
  return radians_to_degrees(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)));
}

function scaleForParam(outputMax, actualIn, expectedMax) {
  if (actualIn > expectedMax) {
    return outputMax
  }
  if (actualIn < 0) {
    return 0
  }
  return outputMax * (actualIn / expectedMax)
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

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */


var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var vTubeIsYou = document.getElementById("vTubeIsYou");
var startButton = document.getElementById("start");



// ==================================== IMAGES AND RESOURCES ====================================

var ACTUALLY_NOT_STARTED = 'ACTUALLY_NOT_STARTED'
var NOT_STARTED_SECTION = 'NOT_STARTED_SECTION'
var OPENING_TUBE_TORIAL = 'OPENING_TUBE_TORIAL'
var TUBE_DUO_SECTION = 'TUBE_DUO_SECTION'
var SPACE_TUBE_SECTION = 'SPACE_TUBE_SECTION'
var SUNFLOWER_SECTION = 'SUNFLOWER_SECTION'
var CLOUD_SECTION = 'CLOUD_SECTION'
var CAR_TUBE_SECTION = 'CAR_TUBE_SECTION'
var ENDED_SECTION = 'ENDED_SECTION'
var TUBE_FINAL_SECTION = 'TUBE_FINAL_SECTION'
var TUBE_GONE_FINAL_SECTION = 'TUBE_GONE_FINAL_SECTION'
var SECTION = ACTUALLY_NOT_STARTED



const sunflower_head_image = new Image(200, 200); // Using optional size for image
sunflower_head_image.src = './res/sunflower.png';

const earth_image = new Image(200, 200);
earth_image.src = './res/planets/earth.png';
const europa_image = new Image(200, 200);
europa_image.src = './res/planets/europa.png';
const jupiter_image = new Image(200, 200);
jupiter_image.src = './res/planets/jupiter.png';
const mars_image = new Image(200, 200);
mars_image.src = './res/planets/mars.png';
const pluto_image = new Image(200, 200);
pluto_image.src = './res/planets/pluto.png';
const saturn_image = new Image(200, 200);
saturn_image.src = './res/planets/saturn.png';
const venus_image = new Image(200, 200);
venus_image.src = './res/planets/venus.png';


// Create gradient
var verticalGrd = ctx.createLinearGradient(0, 0, 0, 600);
var steps_in_gradient = 200
for (var i = 0; i < steps_in_gradient; i++) {
  verticalGrd.addColorStop((i / steps_in_gradient), "black");
  verticalGrd.addColorStop((i / steps_in_gradient) + (1 / (steps_in_gradient * 2)), "grey");
}


// Create gradient
var horizontalGrd = ctx.createLinearGradient(0, 0, 800, 0);
var steps_in_gradient = 200
for (var i = 0; i < steps_in_gradient; i++) {
  horizontalGrd.addColorStop((i / steps_in_gradient), "black");
  horizontalGrd.addColorStop((i / steps_in_gradient) + (1 / (steps_in_gradient * 2)), "grey");
}



// The detected positions will be inside an array
let poses = [];

function askPermissionForVideo() {
  console.log("hi")
  var askPermission = document.getElementById("askPermission");
  var loading = document.getElementById("loading");
  loading.style.display = "block";
  askPermission.style.display = "none";

  // Create a webcam capture
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(function(stream) {
      video.srcObject = stream;
      video.play();
    });
  }
}







//// ==================================== CLOUD_SECTION AUDIO STUFF ====================================
var cloud_whiteNoiseA
var cloud_whiteNoiseB
var cloud_lowPassFilter
var cloud_highPassFilter

var cloud_lowPassFilter = new Pizzicato.Effects.LowPassFilter({
  frequency: 400,
  peak: 10
});
var cloud_highPassFilter = new Pizzicato.Effects.LowPassFilter({
  frequency: 10,
  peak: 10
});
var cloud_whiteNoiseA = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/noise.wav'
  }
}, function() {
  console.log("loaded A")
  cloud_whiteNoiseA.addEffect(cloud_lowPassFilter);
  cloud_whiteNoiseA.volume = .05
});
var cloud_whiteNoiseB = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/noise.wav'
  }
}, function() {
  console.log("loaded B")
  cloud_whiteNoiseB.addEffect(cloud_highPassFilter);
  cloud_whiteNoiseB.volume = .05
});

//// ==================================== MODULAR SYNTH AUDIO STUFF ====================================

var AudioContext = window.AudioContext ||
window.webkitAudioContext;

const modular_context = new AudioContext();
const modular_masterVolume = modular_context.createGain();
modular_masterVolume.connect(modular_context.destination);
modular_masterVolume.gain.setValueAtTime(0.0, 0);

const modular_osc = modular_context.createOscillator();
const modular_noteGain = modular_context.createGain();
const modular_lfo = modular_context.createOscillator();
const modular_lfoGain = modular_context.createGain();

const modular_biquadFilter = modular_context.createBiquadFilter();

modular_biquadFilter.frequency.value = 300;
modular_biquadFilter.Q.value = 10


//// ==================================== MODULAR SYNTH AUDIO STUFF ====================================

const thermin_masterVolume = modular_context.createGain();
thermin_masterVolume.connect(modular_context.destination);
thermin_masterVolume.gain.setValueAtTime(0.0, 0);

const thermin_osc = modular_context.createOscillator();
const thermin_noteGain = modular_context.createGain();
const thermin_lfo = modular_context.createOscillator();
const thermin_lfoGain = modular_context.createGain();


//// ==================================== SPACE TUBE CONTINUE TEXT AUDIO STUFF ====================================
var space_audioFile
var space_delay

space_delay = new Pizzicato.Effects.Delay({
  feedback: 0.6,
  time: 0.4,
  mix: 0.5
});
var space_audioFile = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/weContinueTubeLonger.wav'
  }
}, function() {
  console.log("loaded spaceFile")
  space_audioFile.addEffect(space_delay);
  space_audioFile.volume = .2
});



//// ==================================== CAR TUBE TEXT AUDIO STUFF ====================================
var car_audioFile
var car_delay

car_delay = new Pizzicato.Effects.Delay({
  feedback: 0.6,
  time: 0.4,
  mix: 0.5
});
var car_audioFile = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/TubeVoiceEnding.wav'
  }
}, function() {
  console.log("loaded car file")
  car_audioFile.addEffect(car_delay);
  car_audioFile.volume = .4 // .2 was "too soft"
});


//// ==================================== FLOWER AUDIO STUFF ====================================
var flower_e1
var flower_e2
var flower_e3
var flower_e4

var flower_e1 = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/2.m4a'
  }
}, function() {
  console.log("loaded flower_e1")
  flower_e1.volume = 0
  flower_e1.loop = true
});

var flower_e2 = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/b.wav'
  }
}, function() {
  console.log("loaded flower_e1")
  flower_e2.volume = 0
  flower_e2.loop = true
});

var flower_e3 = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/e.wav'
  }
}, function() {
  console.log("loaded flower_e3")
  flower_e3.volume = 0
  flower_e3.loop = true
});

var flower_e4 = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './audio/crickets.wav'
  }
}, function() {
  console.log("loaded flower_e4")
  flower_e4.volume = 0
  flower_e4.loop = true
});

//// ==================================== END CUSTOM AUDIO SETUP STUFF ====================================

function startSection(section, stopPreviousSection) {
  SECTION = section
  console.log("here!")
  console.log(section)
  if (SECTION === ACTUALLY_NOT_STARTED) {

  } else if (SECTION === NOT_STARTED_SECTION) {

  } else if (SECTION === OPENING_TUBE_TORIAL) {
    if (stopPreviousSection) {
      // nothing to do
    }
    applyFade(0, .02, modular_masterVolume.gain, 20000)
  } else if (SECTION === TUBE_DUO_SECTION) {
    if (stopPreviousSection) {
      applyFade(0.02, 0, modular_masterVolume.gain, 1000)
    }
    space_audioFile.play()

  } else if (SECTION === SPACE_TUBE_SECTION) {
    if (stopPreviousSection) {
      // really should call space_audioFile.stop, but we'll let it play out
    }
    console.log("hello! doing the thing!")
    applyFade(0, .1, thermin_masterVolume.gain, 1000)

  } else if (SECTION === SUNFLOWER_SECTION) {
    if (stopPreviousSection) {
      applyFade(.1, 0, thermin_masterVolume.gain, 1000)
    }
    console.log("playing flower_e4");
    flower_e1.play()
    flower_e2.play()
    flower_e3.play()
    flower_e4.play()
    // do the actual sunflower sounds

  } else if (SECTION === CLOUD_SECTION) {
    if (stopPreviousSection) {
      flower_e1.stop()
      flower_e2.stop()
      flower_e3.stop()
      flower_e4.stop()
    }
    cloud_whiteNoiseA.play()
    cloud_whiteNoiseB.play()
  } else if (SECTION === CAR_TUBE_SECTION) {
    if (stopPreviousSection) {
      cloud_whiteNoiseA.stop()
      cloud_whiteNoiseB.stop()
    }
    console.log("playing the file!!!!!")
    car_audioFile.play()
  } else if (SECTION === TUBE_FINAL_SECTION) {
    if (stopPreviousSection) {
      // same thing, we will let it play out
    }
    applyFade(0, .02, modular_masterVolume.gain, 1000)

  } else if (SECTION === TUBE_GONE_FINAL_SECTION) {
    // nothing, we keep doing the same thing
  } else if (SECTION === ENDED_SECTION) {
    if (stopPreviousSection) {
      modular_masterVolume.gain.setValueAtTime(0, 0)
    }
  } else {
    console.log("MISSED A THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }
}


function updateAudio(pose) {
  rightArmOpen = smooth(find_angle(pose.rightShoulder, pose.rightElbow, pose.rightWrist), 'rightArmOpen')
  leftArmOpen = smooth(find_angle(pose.leftShoulder, pose.leftElbow, pose.leftWrist), 'leftArmOpen')
  rightArmUp = smooth(find_angle(pose.rightHip, pose.rightShoulder, pose.rightWrist), 'rightArmUp')
  leftArmUp = smooth(find_angle(pose.leftHip, pose.leftShoulder, pose.leftWrist), 'leftArmUp')
  headAngle = smooth(find_slope(pose.rightEar, pose.leftEar), 'headAngle')

  if (SECTION === ACTUALLY_NOT_STARTED) {

  } else if (SECTION === NOT_STARTED_SECTION) {

  } else if (SECTION === OPENING_TUBE_TORIAL || SECTION === TUBE_FINAL_SECTION || SECTION === TUBE_GONE_FINAL_SECTION) {
    modular_lfoGain.gain.setValueAtTime(scale(rightArmOpen, 0, 180, 0, 300), 0)
    modular_lfo.frequency.setValueAtTime(scale(leftArmOpen, 0, 180, 0, 20), 0);
    modular_osc.frequency.setValueAtTime(scale(leftArmUp, 0, 180, 150, 700), 0)
    var filterFreq = scale(rightArmUp, 0, 180, 2, 140)
    var filterQ = scale(headAngle, 0, 180, 0, 5)
    modular_biquadFilter.frequency.setValueAtTime(filterFreq * filterFreq, 0)
    modular_biquadFilter.Q.setValueAtTime(filterQ * filterQ, 0)
  } else if (SECTION === SUNFLOWER_SECTION) {
    flower_e1.volume = (1 - scale(rightArmUp, 0, 180, 0, 1)) * .4
    flower_e2.volume = scale(rightArmUp, 0, 180, 0, 1) * .4
    flower_e3.volume = scale(leftArmUp, 0, 180, 0, 1) * .4
    flower_e4.volume = (1 - scale(leftArmUp, 0, 180, 0, 1)) * .4
  } else if (SECTION === SPACE_TUBE_SECTION) {
    thermin_lfo.frequency.setValueAtTime(scale(rightArmOpen, 0, 180, 0, 20), 0);
    thermin_osc.frequency.setValueAtTime(scale(leftArmUp, 0, 180, 150, 700), 0)

  } else if (SECTION === CLOUD_SECTION) {
    cloud_lowPassFilter.frequency = (800 - pose.leftWrist.x)
    cloud_highPassFilter.frequency = (800 - pose.rightWrist.x)
    cloud_lowPassFilter.peak = (scaleForParam(20, pose.leftWrist.y, 600))
    cloud_highPassFilter.peak = (scaleForParam(10, pose.rightWrist.y, 600))

    cloud_whiteNoiseA.volume = (scaleForParam(0.12, 600 - pose.leftWrist.y, 600)) // 0.05 was too soft
    cloud_whiteNoiseB.volume = (scaleForParam(0.12, 600 - pose.rightWrist.y, 600))

  } else if (SECTION === TUBE_DUO_SECTION) {
    space_delay.time = Math.abs(.5 - scale(rightArmUp, 0, 180, 0, 1))
    space_delay.mix = scale(leftArmOpen, 0, 180, 0, 1)
    space_delay.feedback = Math.abs(.5 - scale(rightArmOpen, 0, 180, 0, 1))

  } else if (SECTION === CAR_TUBE_SECTION) {

    car_delay.time = Math.abs(.5 - scale(leftArmOpen, 0, 180, 0, 1))
    car_delay.mix = scale(rightArmUp, 0, 180, 0, 1)
    car_delay.feedback = Math.abs(.5 - scale(leftArmUp, 0, 180, 0, 1))

  } else if (SECTION === ENDED_SECTION) {

  } else {

  }
}


function drawBaseImage() {
  ctx.clearRect(0, 0, 800, 600);
  if (SECTION === ACTUALLY_NOT_STARTED) {

  } else if (SECTION === NOT_STARTED_SECTION || SECTION === OPENING_TUBE_TORIAL) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(video, 800, 0, -800, 600);
    ctx.restore();
  } else if (SECTION === SUNFLOWER_SECTION) {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, 800, 600);
  } else if (SECTION === SPACE_TUBE_SECTION) {

  } else if (SECTION === CLOUD_SECTION) {

  } else if (SECTION === TUBE_DUO_SECTION) {

  } else if (SECTION === CAR_TUBE_SECTION) {

  } else if (SECTION === TUBE_FINAL_SECTION || SECTION === TUBE_GONE_FINAL_SECTION) {

  } else if (SECTION === ENDED_SECTION) {
    ctx.drawImage(video, 0, 0, 800, 600);
  } else {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 800, 600);
  }
}
var clouds = []
function drawPoseImage(roughpose) {
  pose = smoothPose(roughpose)
  if (SECTION === NOT_STARTED_SECTION || SECTION === ACTUALLY_NOT_STARTED) {
    return
  } else if (SECTION === SUNFLOWER_SECTION) {
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
  } else if (SECTION === TUBE_DUO_SECTION || SECTION === TUBE_FINAL_SECTION) {

    // this is the "you look like the tube!"
    var intersect = averagePoints(pose.leftShoulder, pose.rightShoulder)
    var hips = averagePoints(pose.leftHip, pose.rightHip)

    ctx.lineWidth = 50;

    ctx.beginPath()
    ctx.strokeStyle = horizontalGrd;
    ctx.moveTo(...intersect)
    ctx.lineTo(pose.rightWrist.x, pose.rightWrist.y);
    ctx.moveTo(...intersect)
    ctx.lineTo(pose.leftWrist.x, pose.leftWrist.y);
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = verticalGrd;
    ctx.moveTo(pose.nose.x, pose.nose.y - 100);
    ctx.lineTo(...intersect);
    ctx.lineTo(...hips)
    ctx.lineTo(400, 1200)
    ctx.stroke()
  } else if (SECTION === TUBE_GONE_FINAL_SECTION) {
    // do nothing, they are just clapping while you make music
  } else if (SECTION === CAR_TUBE_SECTION) {

    // this is the "you look like the tube!"
    var intersect = averagePoints(pose.leftShoulder, pose.rightShoulder)
    intersect = [intersect[0], intersect[1] + 100] // lower it so that it looks more car-flailing like
    var hips = averagePoints(pose.leftHip, pose.rightHip)

    ctx.lineWidth = 50;
    ctx.strokeStyle = "#FF0000";

    ctx.beginPath()
    ctx.moveTo(...intersect)
    ctx.lineTo(pose.rightElbow.x, pose.rightElbow.y);
    ctx.lineTo(pose.rightWrist.x, pose.rightWrist.y);
    ctx.moveTo(...intersect)
    ctx.lineTo(pose.leftElbow.x, pose.leftElbow.y);
    ctx.lineTo(pose.leftWrist.x, pose.leftWrist.y);
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(pose.nose.x, pose.nose.y - 50);
    ctx.lineTo(...intersect);
    ctx.lineTo(...hips)
    ctx.lineTo(400, 1200)
    ctx.stroke()
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
    updateAudio(pose)
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
  var goButton = document.getElementById("go");
  var loading = document.getElementById("loading");
  goButton.style.display = "block";
  loading.style.display = "none";
  console.log("model ready");
  poseNet.multiPose(video);
}



let oscillator = null
let gainNode = null
let audioCtx = null
let biquadFilter = null

function go() {
  canvas.style.display = 'inline'

  // start the thing going, but silently.
  modular_lfo.frequency.setValueAtTime(200, 0);
  modular_lfo.connect(modular_lfoGain);
  modular_lfo.start(0);
  modular_lfoGain.gain.setValueAtTime(200, 0)
  modular_lfoGain.connect(modular_osc.frequency)
  modular_osc.type = 'sawtooth';
  modular_osc.frequency.setValueAtTime(220, 0);
  modular_osc.start(0);
  modular_osc.connect(modular_biquadFilter);
  modular_biquadFilter.connect(modular_noteGain)
  modular_noteGain.connect(modular_masterVolume);

  // start the thing going, but silently.
  thermin_lfo.frequency.setValueAtTime(5, 0);
  thermin_lfo.connect(thermin_lfoGain);
  thermin_lfo.start(0);
  thermin_lfoGain.gain.setValueAtTime(10, 0)
  thermin_lfoGain.connect(thermin_osc.frequency)
  thermin_osc.type = 'sine';
  thermin_osc.frequency.setValueAtTime(220, 0);
  thermin_osc.start(0);
  thermin_osc.connect(thermin_noteGain);
  thermin_noteGain.connect(thermin_masterVolume);




  // start the whole video
  vTubeIsYou.play()


  // // un comment this before pushing
  startSection(NOT_STARTED_SECTION, true)

  setTimeout(function() {
    startSection(OPENING_TUBE_TORIAL, true)
  }, 52000); // 0:52

  setTimeout(function() {
    startSection(TUBE_DUO_SECTION, true)
  }, 121000); // 2:01 

  setTimeout(function() {
    startSection(SPACE_TUBE_SECTION, true)
  }, 195000); // 3:15

  setTimeout(function() {
    startSection(SUNFLOWER_SECTION, true)
  }, 249000); // 4:09

  setTimeout(function() {
    startSection(CLOUD_SECTION, true)
  }, 307000); // 5:07

  setTimeout(function() {
    startSection(CAR_TUBE_SECTION, true)
  }, 354000); // 5:52 // 352 000 was "too early" per previous note

  setTimeout(function() {
    startSection(TUBE_FINAL_SECTION, true)
  }, 408000); // 6:48

  setTimeout(function() {
    startSection(TUBE_GONE_FINAL_SECTION, true)
  }, 435000); // 7:15

  setTimeout(function() {
    startSection(ENDED_SECTION, true)
  }, 477000); // 7:57


  modal.style.display = "none";
}

var pizzStarted = false
window.onclick = function() {
  if (!pizzStarted) {
    let context = Pizzicato.context
    let source = context.createBufferSource()
    source.buffer = context.createBuffer(1, 1, 22050)
    source.connect(context.destination)
    source.start()
  }
}
var modal = document.getElementById("myModal");
modal.style.display = "block";
