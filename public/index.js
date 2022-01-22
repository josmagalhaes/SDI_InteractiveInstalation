const serverIp = '10.0.0.23';
const serverPort = '3000';
const local = true; // true if running locally, false
// if running on remote server

// Global variables here. ---->

// <----

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
  displayAddress();
}


window.addEventListener('deviceorientation', function (ev) {
  console.info(ev.alpha, ev.beta, ev.gamma);
  console.log(ev.alpha);
})

window.addEventListener('devicemotion', function (ev) {
  console.info(ev.acceleration.y, ev.rotationRate.gamma);
  console.log(ev.acceleration.y);
})

function onReceiveData(data) {
  // Input data processing here. --->

  if (data.type === 'timestamp') {
    print(data.timestamp);
  }
}