"use strict";

// TODO
// just move sketch related essentials to static data in a
// globals class.

// essential UI parameters
var screen_width = 0;
var screen_height = 0;
const frame_rate    = 25;

// enable to debug
const debug = true;

// network tests
const serverIp   = "192.168.0.3";
const serverPort  = "3000";
const local = true;

// player aux functions
let player_color, player_color_dim;
let player_colors;

function set_player_colors()
{
    const ndx = Math.floor(Math.random() * 20);
    // ndx from state ramp, and state (palette)
    player_color = Palette.get_rgba_color(ndx, 0);
    player_color_dim = player_color * 0.75;
    return {"active_color" : player_color, "dimmed_color" : player_color_dim};
}

function preload()
{
    setupClient();
}

function setup()
{
    if (debug)
    {
        setuplogger();
        console.log('Initializing...');
    }

    // noCanvas();
    let canvas = createCanvas(windowWidth, windowHeight);
    screen_width = windowWidth;
    screen_height = windowHeight;
    canvas.position(0, 0);
    // setup player colors and other client variables
    player_colors = set_player_colors()
    background(player_colors.active_color);
    frameRate(frame_rate);
    angleMode(RADIANS);


    // Send any initial setup data to your host here.
    /*
        Example:
        sendData('myDataType', {
        val1: 0,
        val2: 128,
        val3: true
        });

        Use `type` to classify message types for host.
    */
    sendData("player_color", {
        r : red(player_colors.active_color),
        g : green(player_colors.active_color),
        b : blue(player_colors.active_color),
        a : alpha(player_colors.active_color),
    });
}

function draw()
{
    background(player_colors.active_color);

    //if (isClientConnected(display = true))
    if (isClientConnected())
    {
        text("Connected!");
    }
    else
    {
        text("Not connected", screen_width / 2, screen_height / 2);
    }
}

// Messages can be sent from a host to all connected clients
function onReceiveData(data)
{
    // Input data processing here. --->
    if (data.type === "timestamp")
    {
        print(data.timestamp);
    }

    // <----
    /* Example:
       if (data.type === "myDataType") {
         processMyData(data);
       }

       Use "data.type" to get the message type sent by host.
    */
}

function mouseClicked(event)
{
    if (debug)
    {
        console.log(`sketch X = ${mouseX}, Y = ${mouseY}`);
    }

    const input_coords = {
        "xcoord" : mouseX/windowWidth,
        "ycoord" : 1 - (mouseY/windowHeight),
        "playercolor" : player_colors.active_color,
    };
    sendData("input_coords", input_coords);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved(event)
{
    ;
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved()
{
    // do some stuff
    return false;
}
