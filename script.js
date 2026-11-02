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
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]; //The notes I want the instrument to play

// ---------- State ----------
// info about what is happening live. Things that are changin belong in state. Fixed stuff belongs in settings.

let startX = 0; //Stores an orignal Horizontal position. Used to remember the horizontal starting position of the circle being dragged.
let startY = 0; //Same as above but for Vertical position
let circles = []; // Holds the seven circles, but instead of naming one by one will use .push() later.
let activeCircle = null; //This rememebrs which circle is being dragged.
let bigCircle; //Used to store the stationary big circle later

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.Synth().toDestination(); //This allows one note to play when the user interacts with a circle. Used because it's monophonic and allows easier change of frequency.
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
  Tone.start(); //starts the Tone.js audio stuff. (Actviates the audio system)

  for (const circle of circles) {
    // goes through the array of circles. It's a for....of loop
    let distance = Math.hypot(
      event.clientX - circle.originX,
      event.clientY - circle.originY,
    ); // use this to clauclate the distance between the pointer and the small circles so that it can select a circle

    if (
      distance < 20
    ) //Means if pointer is less than 20 pixels away from a small circle's center
    {
      activeCircle = circle; //remembers which circle is being dragged
      startX = circle.originX; //startX remembers the central original Horizontal position of the grabbed circle.
      startY = circle.originY; // startY remembers the central orginal Veritcal position of the grabbed cricle.
      synth.triggerAttack(circle.note); // tells the program to release the note assigned to the selected circle
      console.log("Playing note:", circle.note); // prints in console the note being played
      return; //stops the for...of loop from continuaously checking the other circles since the circle the user grabbed has been found
    }
  }
}

function pointerUp(event) {
  if (activeCircle !== null) //means if a circle has been grabbed
  {
    synth.triggerRelease(); //tells the porgram to stop playing the note when the player releases the grabbed circle
    activeCircle.shape.setPositionPixels(
      //this tells the porgram to find the shape of the grabbed circle and to return it to it's original postion

      activeCircle.originX - 12, //originX stores the center Horizontal position of the grabbed circle and minus twelve moves the postion to the edge because setPositionPixels takes the position of the edge
      activeCircle.originY - 12, // same but vertical position
    );

    activeCircle = null; // tells the program that no circle is grabbed anymore.
  }
}

function pointerMove(event) {
  if (activeCircle === null) {
    return;
    // the above "if" condition tells the program to not run this function if no circle is grabbed
  }
  const deltaX = event.clientX - activeCircle.originX; //calculates how far the grabbed circle has moved from it's orignal center Horizontal postion. so only horizontaly
  const deltaY = event.clientY - activeCircle.originY; // same but Vertical position
  const distance = Math.hypot(deltaX, deltaY); // this gives us the distance the grabbed circle has moves both vertically and horizontally.
  const startingFrequency = Tone.Frequency(activeCircle.note).toFrequency(); //Tone.Frequency tells the frequency of the note. activeCircle.note is the assigned note to the circle. toFrequency() give the number of frequency in hertz.
  const pitch = startingFrequency * Math.pow(2, distance / 250); // a mathematical method to increase the frequency. Math.pow is supposed to raise a number to a power in my case it raises 2 to the power of distance divded by 250.
  synth.frequency.rampTo(pitch, 0.05); //synthfrequency controls the pitch of the synthesizer. rampTo changes the frequency gradually instead of instantly. pitch is the new frequency calculated. 0.05 is the time taken for this transition to happen.
  activeCircle.shape.setPositionPixels(event.clientX - 12, event.clientY - 12); // this allows the grabbed circle to move and that the subtraction is to ensure the circle's center is under the pointer.
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // starts the update function
  use(); //starts the use function

  const windowCenterX = window.innerWidth / 2; // get the width of the window and divide by two to find the center
  const windowCenterY = window.innerHeight / 2; // get the height of the window and divide by two to find the center

  //create big Circle
  bigCircle = createShape("circle"); //creates the circle shape and stores it in my bigCircle variable
  bigCircle.setSize(200, 200); // makes the circle 200 wide and 200 high
  bigCircle.setPositionPixels(windowCenterX - 100, windowCenterY - 100); //places it in the center of the screen. 100 is subtracted so that setpositionpixels considers the center (same as before). Becasue setpositionpixels takes the top-left corner

  //create seven smaller circles
  const radius = 65; // the radius of the smaller circles
  const circleSize = 24; //the size fo the smaller circles 24 high and 24 wide in pixels

  // a loop that places the seven circles evenly around the bigger circle
  for (let i = 0; i < notes.length; i++) {
    const angle = (i / notes.length) * Math.PI * 2;

    // calculate the position of each small circle on the screen
    const x = windowCenterX + radius * Math.cos(angle) - circleSize / 2;
    const y = windowCenterY + radius * Math.sin(angle) - circleSize / 2;

    // the details for the smaller circles
    const point = createShape("circle");
    point.setSize(circleSize, circleSize);
    point.setColour(60, 100, 50, 1);
    point.setPositionPixels(x, y);

    //stores info about each small circle so that the program can play it's note, recognize it, and move it.
    circles.push({
      shape: point,
      note: notes[i],
      originX: x + circleSize / 2,
      originY: y + circleSize / 2,
    });
  }

  // calling the event handler/ functions
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
}
setup();
