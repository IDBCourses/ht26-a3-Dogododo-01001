/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program- Describes the rules of the instrument
 *   state    — the parts of your program that change over time. Describes what s happenign right NOW
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js"; //imports what's in shape.js

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

const note = "C4"; // the note played when the pointer goes down
const maxStretch = 150; //the maximum allowed distance between the original grab point and the pointer. In pixels
const circleRadius = 50; // the radius of the circle in pixels

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let isDragging = false; // the starting state of the grabbing is false because the user hasn't yet dragged the circle. I used "let" here becasue it's a changing varibale as the user itneracts.
let startX = 0; // remembers the horizontal position where the user first grabbed grabbed the circle
let startY = 0; // remembers the vertical position where the user first grabbed the circle
//the isnital value is zero because I don't know which position the player is gonna grab the circle from.

let isBroken = false; //The pointer has not entered the circle and left.
let circle; //declaring the variable "circle"
// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds. I can use "update" to calculate pointer speed and stretch distance
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds. I can use "use" to update the sound and visuals.
}

// ---------- Controls (Event Handlers) ----------
// Plays a note whenerver the pointer gose down regardless where y or x axis.
function pointerDown(event) {
  Tone.start(); //enables audio playback after user inrteraction.

  if (isBroken) {
    return;
  } //if the pointer exits the circle the function doesn't take place
  startX = event.clientX; //Updates the exisiting variable 0 I wrote before with the Horizontal position of the pointer when pressed down.
  startY = event.clientY; //Updates the exisiting variable 0 I wrote before with the Vertical position of the pointer when pressed down.

  isDragging = true; //records that the player has started an interaction.

  console.log("Grabbed at", startX, startY); //Logs the position of x and y of the pointer.
}

function pointerUp(event) {
  //the user is not pressing down the pointer.
  isDragging = false;
  isBroken = false;
  circle.setSize(100, 100); //resets the circel back to original when the user let's go of grabbing
}

function pointerMove(event) {
  if (!isDragging) {
    //checks if the circle is not grabbed. "!" means "not". "!" reverses a boolean value.
    return; //exits the function if there is no grab and doesn't calculate the position.
  }

  const x = event.clientX / window.innerWidth; //tells where the pointer is horizontally on the screen based on the width of the screen
  const y = event.clientY / window.innerHeight; //tells where the pointer is vertically on the screen based on the height of the screen

  const distance = Math.hypot(event.clientX - startX, event.clientY - startY); //calculates the distance between two points. Pythagoras done for you.
  const deltaX = event.clientX - startX; //how far left or right the pointer moves from the grab position
  const deltaY = event.clientY - startY; //how far up or down the pointer moves from the grab position
  const stretch = Math.max(0, distance - circleRadius); //will write what it does later

  circle.setSize(100 + stretch, 100 + stretch);

  console.log("Distance:", distance);

  if (stretch > maxStretch) {
    //resets the shape after pointer exceeds limit
    isBroken = true; //remembers that the pointer has left the circle limit
    isDragging = false; // stops the dragging calculation
    circle.setSize(100, 100); //resets the circle back to original size when the user exceeds maxStretch
    console.log("No sound");
  }
}
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  circle = createShape("circle"); //accessible by setup and pointermove. (maybe)
  circle.setPosition(0.5, 0.5);

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove); //tells the browser to listen for when the pointer moves and run the function of pointerMove.
  window.addEventListener("pointerup", pointerUp); //tells the browser to listen for when the pointer is not being dragged.
}
setup(); // Always remember to call setup()!
