module.exports = class Computer {
  constructor(value, map) {
    this.value = value;
    this.radius = 50;
    this.speed = 5;
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.currentVertex = map.graphObj[Math.floor((Math.random() * this.arrayOfVertices.length))] //map.graphObj[1]; //
    this.nextVertex = null;
    this.prevVertex = false;
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
  }


  run (drawRedCircle) {
    drawRedCircle(this.currentX, this.currentY, this.radius)
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
      this.direction = 'Left'
      this.dx = -this.speed;
      this.dy = 0;
    }
    if (this.currentX - this.targetX < 0) {
      this.direction = 'Right'
      this.dx = this.speed;
      this.dy = 0;
    }
    if (this.currentY - this.targetY > 0) {
      this.direction = 'Up'
      this.dx = 0;
      this.dy = -this.speed;
    }
    if (this.currentY - this.targetY < 0) {
      this.direction = 'Down'
      this.dx = 0;
      this.dy = this.speed;
    }
  }

  findNewPath () {
    this.possibleDestinations = this.currentVertex.getEdges();
    while (this.requireNewPath) {
      //IF IT IS A DEAD END, CAR IS ALLOWED TO GO BACKWARDS//
      if (this.possibleDestinations.length <= 1) {
        this.nextVertex = this.prevVertex;
        this.requireNewPath = false;
        this.currentVertex.occupied = false;
        this.nextVertex.occupied = true;
      }
      //OTHERWISE BACKWARDS DIRECTION IS NOT ALLOWED. RANDOM DIRECTION FROM REMAINING OPTIONS SLECTED//
      else {
        this.possibleDestinations = this.possibleDestinations.filter(destination => destination !== this.prevVertex.value)
        let rand = Math.floor(Math.random() * this.possibleDestinations.length)
        this.nextVertex = this.map.graphObj[this.possibleDestinations[rand]];
        if (this.nextVertex.occupied) {
          this.possibleDestinations.splice(rand, 1);
        }
        else {
          this.requireNewPath = false;
          this.currentVertex.occupied = false;
          this.nextVertex.occupied = true;
        }
      }
    }
    //GET DIRECTIONS TO NEXT DESTINATION
    this.nextDirection()

    this.prevVertex = this.currentVertex;
    this.currentVertex = this.nextVertex;

  }

}