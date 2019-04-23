/******************************************************************************/
//                             Constants and Globals
/******************************************************************************/
const WIDTH           = 500;
const HEIGHT          = 500;
const PIXELSIZE       = 100000; // number of meters for each pixel
const MAXSPEED        = -1; // set to -1 for no limit

let planet, rocket;


/******************************************************************************/
//                                  Planet Class
/******************************************************************************/
function Planet(newX, newY, newR, newMass) {
  this.position = createVector(newX, newY);
  this.r = newR;
  this.mass = newMass;
}

// might be added in 2.0 for movable planets
// Planet.prototype.update = function() {
//
// }

Planet.prototype.draw = function() {
  noStroke();
  fill(255);
  circle(this.position.x, this.position.y, this.r * 2);
}

Planet.prototype.gravity = function(otherObject) {
  var differenceVector = p5.Vector.sub(this.position, otherObject.position);
  var gravity = 0.000000000066674 * this.mass / differenceVector.magSq() / PIXELSIZE / PIXELSIZE / PIXELSIZE;
  otherObject.addForce(differenceVector.setMag(gravity));
}


/******************************************************************************/
//                                  Rocket Class
/******************************************************************************/
function Rocket(newX, newY) {
  this.position = createVector(newX, newY);
  this.velocity = createVector();
  this.acceleration = createVector();
}

Rocket.prototype.update = function() {
  this.position.add(this.velocity);
  this.velocity.add(this.acceleration);
  if(MAXSPEED >= 0) {
    this.velocity.limit(MAXSPEED);
  }
  this.acceleration.setMag(0);
}

Rocket.prototype.draw = function() {
  noStroke();
  fill(255);
  square(this.position.x, this.position.y, 1);
}

Rocket.prototype.addForce = function(force) {
  this.acceleration.add(force);
}


/******************************************************************************/
//                                   Main Loop
/******************************************************************************/
function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvas');
  planet = new Planet(50, 50, 45, 6000000000000000000000000);
  rocket = new Rocket(495, 50);
}

function draw() {
  background(0);
  planet.draw();
  rocket.draw();
  planet.gravity(rocket);
  rocket.update();
}
