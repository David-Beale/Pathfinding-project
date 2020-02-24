const { drawRedCircle, drawCar } = require('./tiles.js')

module.exports = class Computer {
  constructor(value, map, vertex) {
    this.value = value;
    this.radius = 25;
    this.speed = 5;
    // this.arrayOfVertices = Object.keys(map.graphObj);
    // let randomVertex = this.arrayOfVertices[Math.floor(Math.random() * this.arrayOfVertices.length)]
    this.currentVertex = map.graphObj[vertex] //map.graphObj[1]; //
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
    // drawRedCircle(this.currentX, this.currentY, this.radius)
    drawCar(this.currentX - this.radius, this.currentY - this.radius / 2, this.direction, this.computerCar)
    if (this.requireNewPath) {
      this.findNewPath();
    }
    this.currentX += this.dx;
    this.currentY += this.dy;
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
    this.possibleDestinations = this.currentVertex.getEdges();

    if (this.possibleDestinations.length < 1) {
      this.dx = 0;
      this.dy = 0;
    }
    else {
      let rand = Math.floor(Math.random() * this.possibleDestinations.length)
      this.nextVertex = this.map.graphObj[this.possibleDestinations[rand]];
      if (this.nextVertex.occupied || (this.currentVertex.light !== 'green')) {
        this.dx = 0;
        this.dy = 0;
      }
      else {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
        this.nextDirection()
        this.currentVertex = this.nextVertex;
      }
    }
    //GET DIRECTIONS TO NEXT DESTINATION
    

    

  }

}