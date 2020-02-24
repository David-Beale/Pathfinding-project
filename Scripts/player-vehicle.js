const dijkstra = require('./Graph/dijkstra');
const dijkstraTime = require('./Graph/dijkstra-time');
const { drawCar, drawOutlineCircle, drawCircle, drawLine } = require('./tiles.js')

module.exports = class Player {
  constructor(value, map) {
    this.value = value;
    this.radius = 25;
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
    this.playerCar = new Image();
    this.playerCar.src = "./Assets/player.png";
    this.step = this.radius / this.speed
    this.enterCornerCheck = false;
    this.exitCornerCheck = false;
  }
  click (e) {
    this.clickX = Math.floor((e.pageX / 50)) * 50 + this.radius;
    this.clickY = Math.floor((e.pageY / 50)) * 50 + this.radius;
    if (!this.init && !this.ready) {
      this.firstClick()
    } else if (this.ready) {
      this.secondClick();
    }
  }

  run () {
    if (this.init) {
      this.drawNew();
    }

    if (this.pulseCircle) {
      this.doPulseCircle();
    }
    if (this.ready && this.reachedDestination && this.secondClicked) {
      this.start = this.end;
      this.index = 0;
      this.dx = 0;
      this.dy = 0;
    }
    if (this.enterCornerCheck) {
      this.enterCorner();
    } else if (this.exitCornerCheck) {
      this.exitCorner();
    }
    if (this.requireNewPath) {
      this.findNewPath();
    }
    if (!this.reachedDestination) {
      this.drawPath();
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
    if (this.ready) {
      this.drawPlayerCar()
    }
  }

  drawNew () {
    if (this.initialRadius > this.radius) {
      this.init = false;
      this.ready = true;
      this.initialRadius = 0;
    }
    drawCircle(this.currentX, this.currentY, this.initialRadius);
    this.initialRadius += this.pulseSpeed;
  }
  draw () {
    drawCircle(this.currentX, this.currentY, this.radius)
  }
  drawPlayerCar () {
    drawCar(this.currentX - this.radius, this.currentY - this.radius / 2, this.direction, this.playerCar)
  }
  doPulseCircle () {
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
    if (this.index === this.pathArray.length - 1) {
      this.reachedDestination = true;
      this.requireNewPath = false;
      this.dx = 0
      this.dy = 0
    } else {
      this.currentVertex = this.map.graphObj[this.pathArray[this.index]]
      this.nextVertex = this.map.graphObj[this.pathArray[this.index + 1]]
      if (this.nextVertex.corner) {
        this.nextCornerRouter()
      }
      else if (this.currentVertex.corner) {
        this.currentCornerRouter()
      }
      else {
        this.targetX = this.nextVertex.x + this.radius;
        this.targetY = this.nextVertex.y + this.radius;
        this.nextDirection();
      }

      if (!this.nextVertex.occupied && (this.currentVertex.light === 'green')) {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
      } else this.dx = this.dy = 0;

    }
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
          const dijkstraResult = dijkstra(this.map.graphObj, this.start, this.end)
          this.pathArray = dijkstraResult[1];
          const distance = dijkstraResult[0]
          const time = (this.getTimeandDistance()/60)
          const dijkstraTiming = dijkstraTime(this.map.graphObj, this.start, this.end)[0]
          console.log('Normal pathfinding time:',time, 'Time based:', dijkstraTiming/60)
          console.log('Estimated time:',Math.round(time * 100) / 100,'Distance:',Math.round(distance * 100) / 100, 'Speed', distance/time);
          this.requireNewPath = true;
          this.reachedDestination = false;
          this.pulseCircle = true;
          i = this.arrayOfVertices.length //end loop when found
        }
      }
    }

  }
  nextCornerRouter () {
    if (this.nextVertex.corner === 'TLCOuter') {
      this.dx = 0
      this.dy = -this.speed;
      this.direction = 90;
      this.angleOffset = 0;
      this.xOffset = 0;
      this.yOffset = 0;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.nextVertex.corner === 'TRCOuter') {
      this.dx = this.speed
      this.dy = 0;
      this.direction = 180;
      this.angleOffset = 90;
      this.xOffset = -50;
      this.yOffset = 0;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.nextVertex.corner === 'BRCOuter') {
      this.dx = 0;
      this.dy = this.speed;
      this.direction = 270;
      this.angleOffset = 180;
      this.xOffset = -50;
      this.yOffset = -50;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.nextVertex.corner === 'BLCOuter') {
      this.dx = -this.speed
      this.dy = 0;
      this.direction = 0;
      this.angleOffset = 270;
      this.xOffset = 0;
      this.yOffset = -50;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.nextVertex.corner === 'TLCInner') {
      this.dx = -this.speed
      this.dy = 0;
      this.direction = 0;
      this.angleOffset = 0;
      this.xOffset = 0;
      this.yOffset = 0;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;

    }
    else if (this.nextVertex.corner === 'TRCInner') {
      this.dx = 0
      this.dy = -this.speed;
      this.direction = 90;
      this.angleOffset = 270;
      this.xOffset = -50;
      this.yOffset = 0;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    else if (this.nextVertex.corner === 'BRCInner') {
      this.dx = this.speed;
      this.dy = 0;
      this.direction = 180;
      this.angleOffset = 180;
      this.xOffset = -50;
      this.yOffset = -50;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    else if (this.nextVertex.corner === 'BLCInner') {
      this.dx = 0;
      this.dy = this.speed;
      this.direction = 270;
      this.angleOffset = 90;
      this.xOffset = 0;
      this.yOffset = -50;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    this.angle = this.angleOffset + 45
    this.targetX = Math.floor(this.xOffset + (this.nextVertex.x + 2 * this.radius) - (this.radius * Math.cos(Math.PI / 180 * (this.angle + this.xrotationOffset))))

    this.targetY = Math.floor(this.yOffset + (this.nextVertex.y + 2 * this.radius) - (this.radius * Math.sin(Math.PI / 180 * (this.angle + this.yrotationOffset))))
    this.enterCornerCheck = true;
    this.counter = 1;
    this.enterCorner();
  }
  currentCornerRouter () {
    if (this.currentVertex.corner === 'TLCOuter') {
      this.nextdx = this.speed
      this.nextdy = 0;
      this.nextdirection = 180;
      this.angleOffset = 0;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.currentVertex.corner === 'TRCOuter') {
      this.nextdx = 0;
      this.nextdy = this.speed;
      this.nextdirection = 270;
      this.angleOffset = 90;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.currentVertex.corner === 'BRCOuter') {
      this.nextdx = -this.speed
      this.nextdy = 0;
      this.nextdirection = 0;
      this.angleOffset = 180;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.currentVertex.corner === 'BLCOuter') {
      this.nextdx = 0
      this.nextdy = -this.speed;
      this.nextdirection = 90;
      this.angleOffset = 270;
      this.xrotationOffset = 0;
      this.yrotationOffset = 0;
      this.rotationSign = 1;
    }
    else if (this.currentVertex.corner === 'TLCInner') {
      this.nextdx = 0;
      this.nextdy = this.speed;
      this.nextdirection = 270;
      this.angleOffset = 0;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    else if (this.currentVertex.corner === 'TRCInner') {
      this.nextdx = -this.speed;
      this.nextdy = 0;
      this.nextdirection = 0;
      this.angleOffset = 270;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    else if (this.currentVertex.corner === 'BRCInner') {
      this.nextdx = 0;
      this.nextdy = -this.speed;
      this.nextdirection = 90;
      this.angleOffset = 180;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    else if (this.currentVertex.corner === 'BLCInner') {
      this.nextdx = this.speed;
      this.nextdy = 0;
      this.nextdirection = 180;
      this.angleOffset = 90;
      this.xrotationOffset = 270;
      this.yrotationOffset = 90;
      this.rotationSign = -1;
    }
    this.targetX = this.nextVertex.x + this.radius;
    this.targetY = this.nextVertex.y + this.radius;
    this.counter = 1;
    this.enterCornerCheck = false;
    this.exitCornerCheck = true;
    this.exitCorner();
  }
  enterCorner () {
    const status = this.counter - (this.step);
    if (status > 0) {
      this.angle = this.angleOffset + (status * (45 / this.step))
      this.direction = this.rotationSign * (this.angle + 90 - this.yrotationOffset);
      this.targetCornerX = Math.floor(this.xOffset + (this.nextVertex.x + 2 * this.radius) - (this.radius * Math.cos(Math.PI / 180 * (this.angle + this.xrotationOffset))))
      this.targetCornerY = Math.floor(this.yOffset + (this.nextVertex.y + 2 * this.radius) - (this.radius * Math.sin(Math.PI / 180 * (this.angle + this.yrotationOffset))))
      this.dx = this.targetCornerX - this.currentX
      this.dy = this.targetCornerY - this.currentY
    }
    if (status > this.step) this.enterCornerCheck = false;
    else this.counter++;
  }
  exitCorner () {
    const status = this.counter;
    if (status > this.step) {
      this.dx = this.nextdx;
      this.dy = this.nextdy;
    } else {
      this.currentCornerX = this.currentX
      this.currentCornerY = this.currentY
      this.angle = this.angleOffset + (90 - (this.step - status) * (45 / this.step))
      this.direction = this.rotationSign * (this.angle + 90 - this.yrotationOffset);
      this.targetCornerX = Math.floor(this.xOffset + (this.currentVertex.x + 2 * this.radius) - (this.radius * Math.cos(Math.PI / 180 * (this.angle + this.xrotationOffset))))
      this.targetCornerY = Math.floor(this.yOffset + (this.currentVertex.y + 2 * this.radius) - (this.radius * Math.sin(Math.PI / 180 * (this.angle + this.yrotationOffset))))
      this.dx = this.targetCornerX - this.currentCornerX
      this.dy = this.targetCornerY - this.currentCornerY
    }
    if (status > 2 * this.step) this.exitCornerCheck = false;
    else this.counter++;
  }
  drawPath () {
    for (let i = this.index; i < this.pathArray.length - 1; i++) {
      let thisX
      let thisY
      if (i === this.index) {
        thisX = this.currentX
        thisY = this.currentY
      } else {
        const thisVertex = this.map.graphObj[this.pathArray[i]]
        thisX = thisVertex.x + this.radius
        thisY = thisVertex.y + this.radius
      }
      const nextVertex = this.map.graphObj[this.pathArray[i + 1]]
      const nextX = nextVertex.x + this.radius
      const nextY = nextVertex.y + this.radius
      drawLine(thisX, thisY, nextX, nextY)
    }
  }
  getTimeandDistance () {
    let time = 0;
    for (let i = 1; i < this.pathArray.length; i++) {
      const thisVertex = this.map.graphObj[this.pathArray[i]]
      time += thisVertex.average;
    }
    return time;
  }
}