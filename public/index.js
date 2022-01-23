
const serverIp = "192.168.0.3";
const serverPort = '3000';
const local = true; // true if running locally, false
// if running on remote server

// Global variables here. ---->

// <----

// motion
let device_motion_value = 0;

let rotx = 0, roty = 0, rotz = 0;
let accx = 0, accy = 0, accz = 0;

function preload() {
  setupClient();
}

function setup() {
  setuplogger();
  console.log('Initializing...');
  createCanvas(windowWidth, windowHeight);

  sendData('playerColor', {
    r: 255,
    g: 255,
    b: 255
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  //displayAddress();

  fill(255);
  textAlign(CENTER, CENTER);

  device_motion_value = constrain(device_motion_value - 2, 0, 200);

  if (device_motion_value > 10)
  {
    fill(255, 0, 0);
    text("Moving device", width / 2, height / 2);
  }
  else
  {
    fill(0, 100, 255);
    text("Device is relaxed", width / 2, height / 2);
  }

  // rotation X, Y, Z from device
  // ATTENTION: apparently one MUST call in Z,X,Y order (!?!) or
  //            expect undefined behaviour (... i don't wanna know)
  //
  if (rotz != 0 || rotx != 0 || roty != 0)
  {
    text(`Z rotation = ${rotz}, X rotation${rotx}, Y rotation${roty}`);
  }
  if (accx != 0 || accy != 0 || accz != 0)
  {
    text(`Acceleration X = ${accx}, Y = ${accy}, Z = ${accz}`);
  }
}

/*
window.addEventListener('deviceorientation', function (ev) {
  console.info(ev.alpha, ev.beta, ev.gamma);
  console.log(ev.alpha);
  sendData('deviceorientation', {
    alpha: ev.alpha,
    beta: ev.beta,
    gamma: ev.gamma
  });
})

window.addEventListener('devicemotion', function (ev) {
  console.info(ev.acceleration.y, ev.rotationRate.gamma);
  console.log(ev.acceleration.y);
})
*/

function onReceiveData(data) {
  // Input data processing here. --->

  if (data.type === 'timestamp') {
    print(data.timestamp);
  }
}

// called every time the user touches screen or clicks
function touchMoved()
{
  console.log(`Touched at X = ${mouseX}, Y = ${mouseY}`);
}

// default threshold of 0.5 for device motion on X,Y,Z
function deviceMoved()
{
  device_motion_value = constrain(device_motion_value + 5, 0, 255);

  accx = map(accelerationX, -90, 90, 0.0, 1.0);
  accy = map(accelerationY, -90, 90, 0.0, 1.0);
  accz = map(accelerationZ, -90, 90, 0.0, 1.0);

  rotz = constrain(rotationZ, -TWO_PI, TWO_PI);
  rotx = constrain(rotationX, -TWO_PI, TWO_PI);
  roty = constrain(rotationY, -TWO_PI, TWO_PI);
}