const dijkstra = require('./Graph/dijkstra');

module.exports = class Player {
  constructor(value, map) {
    this.value = value;
    this.radius = 50;
    this.speed = 5;
    this.currentVertex = null;
    this.nextVertex = null;
    this.targetX = null
    this.targetY = null
    this.currentX = null
    this.currentY = null
    this.dx = 0;
    this.dy = 0;
    this.direction = null;
    this.init = false;
    this.initialRadius = 0;
    this.pulseSpeed = 5;
    this.reachedDestination = true;
    this.requireNewPath = false;
    this.ready = false;
    this.clickX;
    this.clickY;
    this.index = 0;
    this.start = null;
    this.finalX = null;
    this.finalY = null;
    this.pathArray = [];
    this.pulseCircle = false;
    this.map = map;
    this.arrayOfVertices = Object.keys(map.graphObj);
    this.secondClicked = false;
  }
  click (e) {
    this.clickX = Math.floor((e.pageX / 100)) * 100 + this.radius;
    this.clickY = Math.floor((e.pageY / 100)) * 100 + this.radius;
    if (!this.init && !this.ready) {
      this.firstClick()
    } else if (this.ready) {
      this.secondClick();
    }
  }

  run (drawCircle, drawOutlineCircle) {
    if (this.init) {
      this.drawNew(drawCircle);
    }
    if (this.ready) {
      this.draw(drawCircle);
    }
    if (this.pulseCircle) {
      this.doPulseCircle(drawCircle, drawOutlineCircle);
    }
    if (this.ready && this.reachedDestination && this.secondClicked) {
      this.start = this.end;
      this.index = 0;
      this.dx = 0;
      this.dy = 0;
    }
    if (this.requireNewPath) {
      this.findNewPath();
    }
    if (!this.reachedDestination) {
      this.currentX += this.dx;
      this.currentY += this.dy;
      if (this.currentX === this.targetX && this.currentY === this.targetY) {
        this.requireNewPath = true;
        this.index++;
      }
      if (this.currentX === this.finalX && this.currentY === this.finalY) {
        this.requireNewPath = false;
        this.reachedDestination = true;
      }
    }
  }

  drawNew (drawCircle) {
    if (this.initialRadius > this.radius) {
      this.init = false;
      this.ready = true;
      this.initialRadius = 0;
    }
    drawCircle(this.currentX, this.currentY, this.initialRadius);
    this.initialRadius += this.pulseSpeed;
  }
  draw (drawCircle) {
    drawCircle(this.currentX, this.currentY, this.radius)
  }
  doPulseCircle (drawCircle, drawOutlineCircle) {
    if (this.initialRadius >= this.radius / 1.5) {
      this.pulseSpeed = -this.pulseSpeed;
    }
    if (this.initialRadius < 0) {
      this.initialRadius = 0;
      this.pulseSpeed = 5;
      this.pulseCircle = false;
    }
    if (this.pulseSpeed < 0) drawOutlineCircle(this.clickX, this.clickY, (this.radius / 1.5))
    drawCircle(this.clickX, this.clickY, this.initialRadius);
    this.initialRadius += this.pulseSpeed;
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
    this.currentVertex = this.map.graphObj[this.pathArray[this.index]]
    this.nextVertex = this.map.graphObj[this.pathArray[this.index + 1]]
    this.nextDirection();
    if (!this.nextVertex.occupied && (this.currentVertex.light !== 'red' || this.direction !== 'Left')) {
      this.requireNewPath = false;
      this.currentVertex.occupied = false;
      this.nextVertex.occupied = true;
    } else this.dx = this.dy = 0;
  }
  firstClick () {
    for (let i = 0; i < this.arrayOfVertices.length; i++) {
      if (this.map.graphObj[this.arrayOfVertices[i]].x === this.clickX - this.radius && this.map.graphObj[this.arrayOfVertices[i]].y === this.clickY - this.radius) {
        this.init = true;
        this.currentVertex = this.map.graphObj[this.arrayOfVertices[i]]
        this.currentVertex.occupied = true;
        this.start = this.arrayOfVertices[i]
        this.currentX = this.clickX;
        this.currentY = this.clickY;
        i = this.arrayOfVertices.length //end loop when found
      }
    }
  }
  secondClick () {
    if (this.reachedDestination) {
      for (let i = 0; i < this.arrayOfVertices.length; i++) {
        if (this.map.graphObj[this.arrayOfVertices[i]].x === this.clickX - this.radius && this.map.graphObj[this.arrayOfVertices[i]].y === this.clickY - this.radius) {
          this.end = this.arrayOfVertices[i]
          this.finalX = this.clickX;
          this.finalY = this.clickY;
          this.secondClicked = true;
          this.pathArray = dijkstra(this.map.graphObj, this.start, this.end)[1];
          this.requireNewPath = true;
          this.reachedDestination = false;
          this.pulseCircle = true;
          i = this.arrayOfVertices.length //end loop when found
        }
      }
    }

  }
}