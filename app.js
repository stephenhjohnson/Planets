/******************************************************************************/
//                             Constants and Globals
/******************************************************************************/
const WIDTH           = 500;
const HEIGHT          = 500;
const PIXELSIZE       = 1000000; // number of meters for each pixel (100km/Pixel)
const MAXSPEED        = -1; // set to -1 for no limit
const ROTATIONSPEED   = 0.05;
const ROCKETFORCE     = 0.1;

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

Planet.prototype.draw = function(cameraPosition) {
  noStroke();
  fill(255);
  circle(this.position.x - cameraPosition.x + WIDTH/2, this.position.y - cameraPosition.y + HEIGHT/2, this.r);
}

Planet.prototype.gravity = function(otherObject) {
  var differenceVector = p5.Vector.sub(this.position, otherObject.position);
  if(differenceVector.magSq() <= this.r * this.r) {
    otherObject.velocity.setMag(0);
    //cheats the system a little by reseting the rocket each time to not be touching or goig inside
    differenceVector.setMag(this.r+0.001);
    differenceVector.mult(-1);
    otherObject.position.set(differenceVector.x + this.position.x, differenceVector.y + this.position.y);
  } else {
    var gravity = 0.0000000000667408 * this.mass / differenceVector.magSq() / PIXELSIZE / PIXELSIZE;
    otherObject.addForce(differenceVector.setMag(gravity));
  }
}


/******************************************************************************/
//                                  Rocket Class
/******************************************************************************/
function Rocket(newX, newY) {
  this.position = createVector(newX, newY);
  this.rotation = createVector(0, -10);
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
  stroke(255);
  // line(this.position.x + this.rotation.x, this.position.y + this.rotation.y, this.position.x, this.position.y);
  line(this.rotation.x + WIDTH/2, this.rotation.y + HEIGHT/2, WIDTH/2, HEIGHT/2);
}

Rocket.prototype.addForce = function(force) {
  this.acceleration.add(force);
}

Rocket.prototype.rotate = function(direction) {
  if(direction > 0) {
    this.rotation.rotate(ROTATIONSPEED);
  } else if(direction < 0) {
    this.rotation.rotate(-ROTATIONSPEED);
  }
}


/******************************************************************************/
//                                   Main Loop
/******************************************************************************/
function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvas');
  planet1 = new Planet( 250,  190, 45, 600000000000000000000000);
  planet2 = new Planet(-190, -190, 25, 120000000000000000000000);
  rocket = new Rocket(0, 0);
}

function draw() {
  background(0);
  planet1.draw(rocket.position);
  planet2.draw(rocket.position);
  rocket.draw();
  planet1.gravity(rocket);
  planet2.gravity(rocket);
  rocket.update();
}


/******************************************************************************/
//                             Event Listeners
/******************************************************************************/
document.addEventListener('keydown', function(event) {
  // console.log(event.keyCode);
  //right arrow
  if(event.keyCode === 39) {
    rocket.rotate(1);
    // console.log("Up was pressed");
  }//left arrow
  else if(event.keyCode === 37) {
    rocket.rotate(-1);
    // console.log("Down was pressed");
  }//spacebar
  else if(event.keyCode === 32) {
    rocket.addForce(p5.Vector.mult(rocket.rotation, ROCKETFORCE).div(10));
  }
});
