const dijkstra = require('./Graph/dijkstra');
const dijkstraTime = require('./Graph/dijkstra-time');
const { drawCar, drawOutlineCircle, drawCircle, drawLine } = require('./tiles.js')
const tiles = require('./tiles.js')

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
    this.setNewDestination = false;
    this.click = false;
    this.event;
    this.pathfinding = 'dijkstra'
    this.dijkstraResult;
    this.pathColor = 'rgb(58, 94, 211)'
    this.comparePaths = {}
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
    if (this.reachedDestination && this.setNewDestination) {
      this.savedDestination();
    }

    if (this.enterCornerCheck) {
      this.enterCorner();
    } else if (this.exitCornerCheck) {
      this.exitCorner();
    }
    if (this.requireNewPath) {
      this.findNewPath();
    }
    if (this.click) {
      this.click = false;
      this.clickX = Math.floor((this.event.pageX + tiles.cameraX) / 50) * 50 + this.radius;
      this.clickY = Math.floor((this.event.pageY + tiles.cameraY) / 50) * 50 + this.radius;
      if (!this.init && !this.ready) {
        this.firstClick()
      } else if (this.ready) {
        this.secondClick();
      }
    }
    //We need to find a new path before and after the click event just in case 
    //the click occurs when the car requires a part. This would break the
    //in transit repathing.
    if (this.requireNewPath) {
      this.findNewPath();
    }
    if (!this.reachedDestination) {
      // if comparison mode is on, we pause the user car, and display only the 2 possible paths
      if (this.compare) {
        if (this.compareReady) { //Need to wait for path to be selected/calculated before drawing
          if (!this.setNewDestination) {
            this.pathColor = 'yellow';
            this.pathArray = this.comparePaths.time.path;
            this.drawPath();
            this.pathColor = 'rgb(58, 94, 211)';
            this.pathArray = this.comparePaths.distance.path;
            this.drawPath();
          } else {
            this.pathColor = 'yellow';
            this.save.pathArray = this.comparePaths.time.path;
            this.drawSavedPath();
            this.pathColor = 'rgb(58, 94, 211)';
            this.save.pathArray = this.comparePaths.distance.path;
            this.drawSavedPath();
          }
        }

        // if comparison mode is off we will continue movement and position checks
      } else {
        if (!this.setNewDestination) {
          this.drawPath();
        } else {
          this.drawSavedPath();
        }
        this.currentX += this.dx;
        this.currentY += this.dy;
        if (this.currentX === this.finalX && this.currentY === this.finalY) {
          this.requireNewPath = false;
          this.reachedDestination = true;
        }
        else if (this.currentX === this.targetX && this.currentY === this.targetY) {
          this.requireNewPath = true;
          this.index++;
        }
      }
    }
    if (this.ready) {
      this.drawPlayerCar()
    }
  }




  ///////////////Functions/////////////////////
  
  getDirection (x1, x2, y1, y2) {
    if (x1 > x2) return 0;
    else if (x2 > x1) return 180;
    else if (y2 > y1) return 270;
    else if (y1 > y2) return 90;
  }

  getMovement (direction1, direction2) {
    if (direction1 === direction2) return 'straight';
    else if (direction2 > direction1 || (direction2 === 0 && direction1 === 270)) return 'right';
    else if (direction2 < direction1 || (direction1 === 0 && direction2 === 270)) return 'left';
  }
  getSubPath (movement1, movement2) {
    if (movement1 === 'straight' && movement2 === 'straight') return [this.straight, this.straight];
    else if (movement1 = 'straight' && movement2 === 'right') return [this.straight, this.enterRight];
    else if (movement1 === 'straight' && movement2 === 'left') return [this.straight, this.enterLeft];
    else if (movement1 === 'right' && movement2 === 'straight') return [this.exitRight, this.straight];
    else if (movement1 === 'left' && movement2 === 'straight') return [this.exitLeft, this.straight];
    else if (movement1 === 'right' && movement2 === 'right') return [this.exitRight, this.enterRight];
    else if (movement1 === 'right' && movement2 === 'left') return [this.exitRight, this.enterLeft];
    else if (movement1 === 'left' && movement2 === 'right') return [this.exitLeft, this.enterRight];
    else if (movement1 === 'left' && movement2 === 'left') return [this.exitLeft, this.enterLeft];
  }
  updateCounter () {
    if (!this.compare) this.counter++
    if (this.counter === stepCount) {
      if (this.subPath1Go) {
        this.subPath1Go = false;
        this.counter = 0;
      } else {
      this.subPath2Go = false;
      this.requireNewPath = true;
      }
    }
  }
  straight () {
    this.updateCounter();
    if(this.counter===1) {
      this.initialDirection(this.direction)
    }
  }
  getStartingCoords(direction, movement) {
    if((direction === 90 && movement === 'right') || (direction === 0 && movement === 'left')) 
      return [(vertex.x + 50), (this.nextVertex.y + 50)]
    else if ((direction === 180 && movement === 'right') || (direction === 90 && movement === 'left')) 
      return [this.nextVertex.x, (this.nextVertex.y + 50)]
    else if ((direction === 270 && movement === 'right') || (direction === 180 && movement === 'left')) 
      return [this.nextVertex.x, (this.nextVertex.y)]
    else if ((direction === 0 && movement === 'right') || (direction === 270 && movement === 'left')) 
      return [this.nextVertex.x+50, (this.nextVertex.y)]
    
  }
  enterRight () {
    this.updateCounter();
    let initialAngle = this.direction1 - 90;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    this.direction += (this.angle - initialAngle);
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
  }
  enterLeft () {
    this.updateCounter();
    let initialAngle = this.direction1;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    this.direction -= this.angle;
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
  }
  exitRight () {
    this.updateCounter();
    let initialAngle = this.direction1 - 45;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    this.direction += (this.angle - initialAngle);
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
  }
  exitLeft () {
    this.updateCounter();
    let initialAngle = this.direction1 +45;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    this.direction -= this.angle;
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
  }

  initialDirection (direction) {
    if (direction === 0) {
      this.dx = -this.speed;
      this.dy = 0;
    }
    else if (direction === 180) {
      this.dx = this.speed;
      this.dy = 0;
    }
    else if (direction === 90) {
      this.dx = 0;
      this.dy = -this.speed;
    }
    else if (direction = 270) {
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

      if (this.direction1) this.direction0 = this.direction1;
      if (this.direction2) this.direction1 = this.direction2;
      else this.direction1 = this.getDirection(this.currentVertex.x, this.nextVertex.x, this.currentVertex.y, this.nextVertex.y)

      if (this.pathArray[this.index + 2]) {
        this.nextNextVertex = this.map.graphObj[this.pathArray[this.index + 2]]
        this.direction2 = this.getDirection(this.nextVertex.x, this.nextNextVertex.x, this.nextVertex.y, this.nextNextVertex.y)
      } else {
        //if there is only 1 vertex left, we will always take a straight line to the end.
        this.direction2 = this.direction1;
      }
      if (this.direction0) this.movement1 = this.getMovement(this.direction0, this.direction1)
      else {
        this.initialDirection(this.direction1) // When we start, we need to set the initial dx, dy values
        this.direction = this.direction1;
        this.movement1 = 'straight';
      }
      this.movement2 = this.getMovement(this.direction1, this.direction2)
      [this.subPath1, this.subPath2] = this.getSubPath(movement1, movement2);
      this.counter = 0;
      this.subPath1Go = true;
      this.subPath2Go = true;
      this.stepCount = Math.round(25 / this.speed);
      this.subPath1();

     
      if (!this.nextVertex.occupied && (this.currentVertex.light === 'green' && !this.compare)) {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
      } else this.dx = this.dy = 0;
    }
  }
}