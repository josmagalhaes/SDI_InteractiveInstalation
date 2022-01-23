
// networking and game object
const serverIp = "192.168.0.3";
const serverPort = '3000';
const local = true;
let game;

// global canvas
const screen_width = 512;
const screen_height = 512;

// enable to debug
const debug = false;
p5.disableFriendlyErrors = (debug == false) ? true : false;

// QR code related stuff
let qr_img;
// an HTML div to display it in:
let tagDiv;

function preload() {
  setupHost();
}

function setup() {
  setuplogger();
  console.log('Initializing...');
  createCanvas(windowWidth, windowHeight);

  // Host/Game setup here. ---->
  game = new Game(screen_width, screen_height, WEBGL);

  // qrcode for server, room
  qr_img = generate_qrcode(room_url(), 4, 6);
  // create the HTML tag div
  tagDiv = createDiv();
  tagDiv.position(screen_width - 100, screen_height - 100);
}

function draw() {
  background(0);

  if (isHostConnected(display = true)) {
    // Display server address
    //displayAddress();
    displayCustomAddress(color(255, 180), 12, 10, screen_height - 14);
    tagDiv.html(qr_img);
  }
}

function onClientConnect(data) {
  // Client connect logic here. --->
  console.log(data.id + ' has connected.');

  if (!game.checkId(data.id))
  {
    game.add(data.id,
      random(0.25 * width, 0.75 * width),
      random(0.25 * height, 0.75 * height),
      60, 60
    );
  }

  // <----
}

function onClientDisconnect(data)
{
  // Client disconnect logic here. --->
  if (game.checkId(data.id))
  {
        game.remove(data.id);
  }
  // <----
}

// Displays server address in lower left of screen
function room_url(roomId = null)
{
    if (roomId == null || roomId === "undefined")
        return `${serverIp}:${serverPort}/?=sdi4`;

    return `${serverIp}:${serverPort}/?=${roomId}`;
}

function generate_qrcode(qr_input_string, margin, size)
{
    // qrcode for server, room
    // const qr_input_string = room_url();
    let qr = qrcode(0, "L");
    qr.addData(qr_input_string);
    qr.make();
    const qr_img = qr.createImgTag(margin, size, "qr code");
    return qr_img;
}

function displayCustomAddress(textcolor, font_size, xpos, ypos)
{
    push();
    fill(textcolor);
    textSize(font_size);
    text(`Enter the room at : ${serverIp}:${serverPort}/?=${roomId} or scan the QR code`, xpos, ypos);
    pop();
}

function onReceiveData(data) {
  // Input data processing here. --->
  console.log(data);

  if (data.type === 'joystick')
  {
        processJoystick(data);
  }
  else if (data.type === 'button')
  {
        processButton(data);
  }
  else if (data.type === 'playerColor')
  {
        game.setColor(data.id, data.r * 255, data.g * 255, data.b * 255);
  }

  // <----

  /* Example:
     if (data.type === 'myDataType') {
       processMyData(data);
     }

     Use `data.type` to get the message type sent by client.
  */
}

// This is included for testing purposes to demonstrate that
// messages can be sent from a host back to all connected clients
function mousePressed()
{
    console.log("Mouse pressed: sending timestamp millis() to client.")
    sendData("timestamp", {
        timestamp: millis()
    });
}

////////////
// Input processing
function processJoystick(data)
{
    fill(0, 255, 0);
    text("process joystick data", width / 2, height / 2);
}

function processButton(data)
{
    fill(255, 200, 0);
    text("process button");
}

////////////
// Game
// This simple placeholder game makes use of p5.play
class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.players = {};
    this.numPlayers = 0;
    this.id = 0;
  }

  add(id, x, y, w, h) {
    this.players[id].id = "p" + this.id;
    this.players[id].color = color(255, 255, 255);
    print(this.players[id].id + " added.");
    this.id++;
    this.numPlayers++;
  }

  draw() {
      ;
  }

  setColor(id, r, g, b) {
    this.players[id].color = color(r, g, b);
    this.players[id].shapeColor = color(r, g, b);

    print(this.players[id].id + " color added.");
  }

  remove(id) {
    this.colliders.remove(this.players[id]);
    this.players[id].remove();
    delete this.players[id];
    this.numPlayers--;
  }

  checkId(id) {
    if (id in this.players) {
      return true;
    } else {
      return false;
    }
  }

  printPlayerIds(x, y) {
    push();
    noStroke();
    fill(255);
    textSize(16);
    text("# players: " + this.numPlayers, x, y);

    y = y + 16;
    fill(200);
    for (let id in this.players) {
      text(this.players[id].id, x, y);
      y += 16;
    }

    pop();
  }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }