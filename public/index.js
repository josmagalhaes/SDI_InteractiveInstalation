function setup() {
  setuplogger();
  console.log('Initializing...');
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
}

window.addEventListener('deviceorientation', function (ev) {
  console.info(ev.alpha, ev.beta, ev.gamma);
  console.log(ev.alpha);
})

window.addEventListener('devicemotion', function (ev) {
  console.info(ev.acceleration.y, ev.rotationRate.gamma);
  console.log(ev.acceleration.y);
})