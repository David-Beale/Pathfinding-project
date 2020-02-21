module.exports = class Computer {
  constructor(value, map) {
    this.value = value;
    this.radius = 25;
    this.speed = 5;
    this.arrayOfVertices = Object.keys(map.graphObj);
    let randomVertex = this.arrayOfVertices[Math.floor(Math.random() * this.arrayOfVertices.length)]
    this.currentVertex = map.graphObj[randomVertex] //map.graphObj[1]; //
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
        this.currentVertex.occupied = false;
        this.nextVertex.occupied = true;
        this.nextDirection()
        this.currentVertex = this.nextVertex;
      }
    }
    //GET DIRECTIONS TO NEXT DESTINATION
    

    

  }

}