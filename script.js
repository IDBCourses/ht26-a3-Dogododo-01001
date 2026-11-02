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
//contains fixed values of my instrument

const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]; // Array of notes that I want my instrument to play. I used const because I don't intend to change or re-assign the array of notes for the instrument.
const maxStretch = 250; //the maximum allowed distance between the original grab point and the pointer. Measured in pixels

// ---------- State ----------
// info about what is happening live. Things that are changin belong in state. Fixed stuff belongs in settings.
let isBroken = false;
let startX = 0;
let startY = 0;
let circles = []; //holds the seven smaller circles. Will later use circles.push to give info
let activeCircle = null; //remembers which circle you are currently grabbing. Starts null becasue user haasn't grabbed a circle when the program first starts.
let circle; //declaring the variable "circle". Will use later to station the big circle in the middle.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.Synth().toDestination(); // Plays one note at once. Also I need to change the frequency of each circle on its own later which is why I changed from Tone.PolySynth to Tone.Synth. In other words it's Monophonic.

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100);
}
// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100);
}

// ---------- Controls (Event Handlers) ----------
// Functions that should respond to events

function pointerDown(event) {
  Tone.start(); //starts the Tone.js audio context. Used to play a sound when user interacts

  for (const circle of circles) {
    // the program goes through the 7 cricles to see if the user has graabbed one.
    let distance = Math.hypot(
      //calculates the pythagoras. In other words the distance from the point of origin to the current.
      event.clientX - circle.homeX, //"homeX" is the original horizontal centre of the grabbed small circle. It is stored in "setup"
      event.clientY - circle.homeY, //"homeY" is the original vertical centre of the grabbed small circle. It is stored in "setup"
    );

    if (distance < 20) {
      activeCircle = circle; //tells the program which circles is currently selected
      startX = circle.homeX;
      startY = circle.homeY;

      synth.triggerAttack(circle.note);

      console.log("Playing note:", circle.note);
      return;
    }
  }
}

function pointerUp(event) {
  if (activeCircle !== null) {
    synth.triggerRelease();

    activeCircle.shape.setPositionPixels(
      activeCircle.homeX - 12,
      activeCircle.homeY - 12,
    );
  }

  activeCircle = null;
  isBroken = false;
}

function pointerMove(event) {
  if (activeCircle === null) // checks wether a circle is selected
  {
    return;
  }

  const deltaX = event.clientX - activeCircle.homeX;
  const deltaY = event.clientY - activeCircle.homeY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= maxStretch) {
    synth.triggerRelease();

    activeCircle.shape.setPositionPixels(
      activeCircle.homeX - 12,
      activeCircle.homeY - 12,
    );

    activeCircle = null;
    isBroken = true;
    return;
  }

  const baseFrequency = Tone.Frequency(activeCircle.note).toFrequency();
  const pitch = baseFrequency * Math.pow(2, distance / maxStretch);

  synth.frequency.rampTo(pitch, 0.05);

  activeCircle.shape.setPositionPixels(event.clientX - 12, event.clientY - 12);
}
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update();
  use();

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Create the big stationary circle
  circle = createShape("circle");
  circle.setSize(200, 200);
  circle.setPositionPixels(centerX - 100, centerY - 100);

  // Create seven small circles around it
  const radius = 65;
  const pointSize = 24;

  for (let i = 0; i < notes.length; i++) {
    const angle = (i / notes.length) * Math.PI * 2;

    const x = centerX + radius * Math.cos(angle) - pointSize / 2;
    const y = centerY + radius * Math.sin(angle) - pointSize / 2;

    const point = createShape("circle"); //Use the create shape function provided by shape.js to create tiny circles and change their appearance and positions.
    point.setSize(24, 24); // This method comes from the shape functionality Imported at first. Sets the size of the circles
    point.setColour(60, 100, 50, 1); //Sets the color of the circle
    point.setPositionPixels(x, y); //sets the position of the circles

    circles.push({
      shape: point, // tha actual yellow ball
      note: notes[i], // the musial note assigned to the ball
      homeX: x + pointSize / 2, // original horizontal centre
      homeY: y + pointSize / 2, // original vertical centre
    });

    console.log("Created point", i, x, y);
  }

  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
}

setup();
