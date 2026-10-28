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

const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]; // Array of notes.
const maxStretch = 250; //the maximum allowed distance between the original grab point and the pointer. In pixels
const circleRadius = 50; // the radius of the circle in pixels

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let points = []; //holds the seven smaller circles/points
let activePoint = null; //remembers which poit you are currently grabbing. Starts null becasue no point is grabbed at first.
let startX = 0; // remembers the horizontal position where the user first grabbed grabbed the circle
let startY = 0; // remembers the vertical position where the user first grabbed the circle
//the initial value is zero because I don't know which position the player is gonna grab the circle from.
let isBroken = false; //The circles have not been dragegd to the limit

let circle; //declaring the variable "circle"
let hasPlayedNote = false;
// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.Synth().toDestination(); // can play several notes at once

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
  Tone.start();

  for (const point of points) {
    const distance = Math.hypot(
      event.clientX - point.homeX,
      event.clientY - point.homeY,
    );

    if (distance < 20) {
      activePoint = point;
      startX = point.homeX;
      startY = point.homeY;

      synth.triggerAttack(point.note);

      console.log("Playing note:", point.note);
      return;
    }
  }
}

function pointerUp(event) {
  if (activePoint !== null) {
    synth.triggerRelease();

    activePoint.shape.setPositionPixels(
      activePoint.homeX - 12,
      activePoint.homeY - 12,
    );
  }

  activePoint = null;
  isBroken = false;
}

function pointerMove(event) {
  if (activePoint === null) {
    return;
  }

  const deltaX = event.clientX - activePoint.homeX;
  const deltaY = event.clientY - activePoint.homeY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= maxStretch) {
    synth.triggerRelease();

    activePoint.shape.setPositionPixels(
      activePoint.homeX - 12,
      activePoint.homeY - 12,
    );

    activePoint = null;
    isBroken = true;
    return;
  }

  const baseFrequency = Tone.Frequency(activePoint.note).toFrequency();
  const pitch = baseFrequency * Math.pow(2, distance / maxStretch);

  synth.frequency.rampTo(pitch, 0.05);

  activePoint.shape.setPositionPixels(event.clientX - 12, event.clientY - 12);
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

    const point = createShape("circle");
    point.setSize(24, 24);
    point.setColour(60, 100, 50, 1);
    point.setPositionPixels(x, y);

    points.push({
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
