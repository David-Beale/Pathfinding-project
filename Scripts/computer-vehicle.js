const { drawCar } = require('./tiles.js')

module.exports = class Computer {
  constructor(value, map, vertex) {
    this.value = value;
    this.radius = 25;
    this.masterSpeed = 5;
    this.speed = 5;
    this.currentVertex = map.graphObj[vertex]
    this.nextVertex = null;
    this.targetX = null
    this.targetY = null
    this.currentX = this.currentVertex.x + this.radius;
    this.currentY = this.currentVertex.y + this.radius;
    this.dx = 0;
    this.dy = 0;
    this.direction = null;
    this.requireNewPath = true;
    this.start = null;
    this.finalX = null;
    this.finalY = null;
    this.map = map;
    this.possibleDestinations = [];
    this.computerCar = new Image();
    this.possibleCars = ["./Assets/green.png","./Assets/orange.png", "./Assets/red.png", "./Assets/yellow.png", "./Assets/blue.png"]
    const rand = Math.floor(Math.random()*this.possibleCars.length)
    this.computerCar.src = this.possibleCars[rand];
  }


  run () {
    drawCar(this.currentX - this.radius, this.currentY - this.radius / 2, this.direction, this.computerCar)
    if (this.requireNewPath) {
      this.findNewPath();
    }
    this.currentX += this.dx;
    this.currentY += this.dy;
    //A counter is used to overcome an issue where floating point numbers prevent the car from reaching the target coords. The next movement will be the difference between the target and the current coords.
    this.counter ++
    if (this.counter === this.maxCounter) {
      this.dx = this.targetX - this.currentX
      this.dy = this.targetY - this.currentY
    }
    //if the vehicle has reached its target, find a new target
    if (this.currentX === this.targetX && this.currentY === this.targetY) {
      this.requireNewPath = true;
    }
  }

  nextDirection () {
    this.currentX = this.currentVertex.x + this.radius;
    this.currentY = this.currentVertex.y + this.radius;
    this.targetX = this.nextVertex.x + this.radius;
    this.targetY = this.nextVertex.y + this.radius;

    if (this.currentX - this.targetX > 0) {
      this.direction = 0;
      this.dx = -this.speed;
      this.dy = 0;
    }
    if (this.currentX - this.targetX < 0) {
      this.direction = 180;
      this.dx = this.speed;
      this.dy = 0;
    }
    if (this.currentY - this.targetY > 0) {
      this.direction = 90;
      this.dx = 0;
      this.dy = -this.speed;
    }
    if (this.currentY - this.targetY < 0) {
      this.direction = 270;
      this.dx = 0;
      this.dy = this.speed;
    }
  }

  findNewPath () {
    //A random destination is chosen from possible options
    this.possibleDestinations = this.currentVertex.getEdges();
    //If there are no options, the car will stop.
    if (this.possibleDestinations.length < 1) {
      this.dx = 0;
      this.dy = 0;
    }
    else {
      let rand = Math.floor(Math.random() * this.possibleDestinations.length)
      this.nextVertex = this.map.graphObj[this.possibleDestinations[rand]];

      this.speedCheck()
      this.maxCounter = Math.floor(50/this.speed)
      this.counter = 0
      //traffic light & collision check
      if (this.nextVertex.occupied || (this.currentVertex.light !== 'green')) {
        this.dx = 0;
        this.dy = 0;
      }
      else {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
        this.nextVertex.speed = this.speed;
        this.nextVertex.counter = 0;
        this.nextDirection()
        this.currentVertex = this.nextVertex;
      }
    }
  }
  //Speed check limits the vehicle speed if there are roadworks, or if a car in front is moving slowly.
  speedCheck () {
    if (this.nextVertex.roadWorks) {
      this.speed = 1
    } else (this.speed = this.masterSpeed)
    if(this.nextVertex.speed && this.nextVertex.speed < this.speed) {
      this.speed = this.nextVertex.speed
    } 
    
  }
}