/* eslint-disable no-undef */
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
    this.direction0 = null;
    this.direction1 = null;
    this.direction2 = null;
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
    if(!this.stopped && !this.compare)
    if (this.subPath1Go) {
      this.subPath1();
    } else if (this.subPath2Go) {
      this.subPath2();
      if (this.reset) {
        this.reset = false;
        this.finalX = this.targetX;
        this.finalY = this.targetY;
      }
    }
    if (this.requireNewPath) {
      this.findNewPath();
    }
    if (this.click) {
      this.click = false;
      let xCoord = (this.event.pageX + tiles.cameraX)/tiles.cameraScale
      let yCoord = (this.event.pageY + tiles.cameraY)/tiles.cameraScale
      this.clickX = Math.floor(xCoord / 50) * 50 + this.radius;
      this.clickY = Math.floor(yCoord / 50) * 50 + this.radius;
      if (!this.init && !this.ready) {
        this.firstClick()
      } else if (this.ready) {
        this.secondClick();
      }
    }
    //We need to find a new path before and after the click event just in case 
    //the click occurs when the car requires a path. This would break the
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
        if(this.stopped) {
          this.collissionCheck();
        } else {
          this.currentX += this.dx;
          this.currentY += this.dy;
          console.log('current',this.currentX, this.currentY, 'target', this.targetX, this.targetY, 'delta', this.dx, this.dy)
          if (this.currentX === this.finalX && this.currentY === this.finalY) {
            this.requireNewPath = false;
            this.reachedDestination = true;
            this.direction0 = null;
            this.direction1 = null;
            this.direction2 = null;
          }
          else if (this.currentX === this.targetX && this.currentY === this.targetY) {
            this.requireNewPath = true;
            this.index++;
          }
        }
      }
    }
    if (this.ready) {
      this.drawPlayerCar()
    }
  }




  ///////////////Functions/////////////////////
  collissionCheck () {
    console.log('check', this.nextVertex.occupied,this.currentVertex.light, this.compare )
    if (!this.nextVertex.occupied && this.currentVertex.light === 'green' && !this.compare) {
      this.currentVertex.occupiedFalse();
      this.nextVertex.occupied = true;
      this.dx = this.saveDx;
      this.dy = this.saveDy;
      this.stopped = false;
      // this.currentX = this.currentVertex.x;
      // this.currentY = this.currentVertex.y;
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
  //saved destination will be run if we have selected an in transit destination change. 
  savedDestination () {
    this.setNewDestination = false;
    this.currentX = this.nextVertex.x + this.radius;
    this.currentY = this.nextVertex.y + this.radius;
    this.index = 0;
    this.end = this.save.end
    this.finalX = this.save.finalX
    this.finalY = this.save.finalY;
    this.pathArray = this.save.pathArray;
    this.requireNewPath = true;
    this.reachedDestination = false;
  }
  secondClick () {
    //If we have an in transit destination change, we will save the new path in memory. The vehicle will continue to the next vertex, then the new path will be applied using savedDestination().
    if (!this.reachedDestination) {
      for (let i = 0; i < this.arrayOfVertices.length; i++) {
        if (this.map.graphObj[this.arrayOfVertices[i]].x === this.clickX - this.radius && this.map.graphObj[this.arrayOfVertices[i]].y === this.clickY - this.radius) {
          this.reset = true;
          this.end = this.nextVertex.value;
          this.setNewDestination = true;
          this.pulseCircle = true;
          if (this.compare) {
            let distancePath
            let distanceDist
            let timePath
            let timeTime
            [distanceDist, distancePath] = dijkstra(this.map.graphObj, this.end, this.arrayOfVertices[i]);
            [timeTime, timePath] = dijkstraTime(this.map.graphObj, this.end, this.arrayOfVertices[i]);
            this.comparePaths.distance = {
              distance: distanceDist,
              path: distancePath,
              time: this.getTimeandDistance(distancePath)
            }
            this.comparePaths.time = {
              distance: timePath.length - 1,
              path: timePath,
              time: timeTime
            }
            //inital path will be time. When we draw the second line, the path will be set to distance. If the user selects time, path will be set back to time
            this.pathColor = 'yellow';
            this.dijkstraResult = [timeTime, timePath];
            this.compareReady = true
          }
          else if (this.pathfinding === 'dijkstra') {
            this.dijkstraResult = dijkstra(this.map.graphObj, this.end, this.arrayOfVertices[i]);
            this.pathColor = 'rgb(58, 94, 211)';
          } else if (this.pathfinding === 'dijkstra-time') {
            this.dijkstraResult = dijkstraTime(this.map.graphObj, this.end, this.arrayOfVertices[i]);
            this.pathColor = 'yellow';
          }

          this.save = {
            end: this.arrayOfVertices[i],
            finalX: this.clickX,
            finalY: this.clickY,
            pathArray: this.dijkstraResult[1],
          }

        }
      }
    }
    // this will run only if the player is stationary.
    if (this.reachedDestination) {
      for (let i = 0; i < this.arrayOfVertices.length; i++) {
        if (this.map.graphObj[this.arrayOfVertices[i]].x === this.clickX - this.radius && this.map.graphObj[this.arrayOfVertices[i]].y === this.clickY - this.radius) {
          this.end = this.arrayOfVertices[i]
          this.finalX = this.clickX;
          this.finalY = this.clickY;
          this.secondClicked = true;
          if (this.compare) {
            let distancePath;
            let distanceDist;
            let timePath;
            let timeTime;
            [distanceDist, distancePath] = dijkstra(this.map.graphObj, this.start, this.end);
            [timeTime, timePath] = dijkstraTime(this.map.graphObj, this.start, this.end);
            this.comparePaths.distance = {
              distance: distanceDist,
              path: distancePath,
              time: this.getTimeandDistance(distancePath)
            }
            this.comparePaths.time = {
              distance: timePath.length - 1,
              path: timePath,
              time: timeTime
            }
            //inital path will be time. When we draw the second line, the path will be set to distance. If the user selects time, path will be set back to time
            this.pathColor = 'yellow';
            this.dijkstraResult = [timeTime, timePath];
            this.compareReady = true
          }
          else if (this.pathfinding === 'dijkstra') {
            this.dijkstraResult = dijkstra(this.map.graphObj, this.start, this.end);
            this.pathColor = 'rgb(58, 94, 211)';
          } else if (this.pathfinding === 'dijkstra-time') {
            this.dijkstraResult = dijkstraTime(this.map.graphObj, this.start, this.end);
            this.pathColor = 'yellow';
          }
          this.pathArray = this.dijkstraResult[1];
          this.requireNewPath = true;
          this.reachedDestination = false;
          this.pulseCircle = true;
          i = this.arrayOfVertices.length; //end loop when found
        }
      }
    }
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
      drawLine(thisX, thisY, nextX, nextY, this.pathColor)
    }
  }
  drawSavedPath () {
    for (let i = 0; i < this.save.pathArray.length - 1; i++) {
      let thisX
      let thisY

      const thisVertex = this.map.graphObj[this.save.pathArray[i]]
      thisX = thisVertex.x + this.radius
      thisY = thisVertex.y + this.radius

      const nextVertex = this.map.graphObj[this.save.pathArray[i + 1]]
      const nextX = nextVertex.x + this.radius
      const nextY = nextVertex.y + this.radius
      drawLine(thisX, thisY, nextX, nextY, this.pathColor)
    }
  }
  getTimeandDistance (array = this.pathArray) {
    let time = 0;
    for (let i = 1; i < array.length; i++) {
      const thisVertex = this.map.graphObj[array[i]]
      time += thisVertex.average;
    }
    return time;
  }
  getDirection (x1, x2, y1, y2) {
    if (x1 > x2) return 0;
    else if (x2 > x1) return 180;
    else if (y2 > y1) return 270;
    else if (y1 > y2) return 90;
  }

  getMovement (direction1, direction2) {
    if (direction1 === direction2) return 'straight';
    else if (direction2 === 0 && direction1 === 270) return 'right'
    else if (direction1 === 0 && direction2 === 270) return 'left'
    else if (direction2 > direction1) return 'right';
    else if (direction2 < direction1) return 'left';
  }
  getSubPath (movement1, movement2) {
    if (movement1 === 'straight' && movement2 === 'straight') return [this.straight, this.straight];
    else if (movement1 === 'straight' && movement2 === 'right') return [this.straight, this.enterRight];
    else if (movement1 === 'straight' && movement2 === 'left') return [this.straight, this.enterLeft];
    else if (movement1 === 'right' && movement2 === 'straight') return [this.exitRight, this.straight];
    else if (movement1 === 'left' && movement2 === 'straight') return [this.exitLeft, this.straight];
    else if (movement1 === 'right' && movement2 === 'right') return [this.exitRight, this.enterRight];
    else if (movement1 === 'right' && movement2 === 'left') return [this.exitRight, this.enterLeft];
    else if (movement1 === 'left' && movement2 === 'right') return [this.exitLeft, this.enterRight];
    else if (movement1 === 'left' && movement2 === 'left') return [this.exitLeft, this.enterLeft];
  }
  updateCounter () {

    if (this.counter === this.stepCount) {
      if (this.subPath1Go) {
        this.subPath1Go = false;
        this.counter = 0;
      } else {
        this.subPath2Go = false;
      }
    }
  }
  straight () {
    if (!this.compare&&!this.stopped) this.counter++
    if (this.subPath1Go) {
      this.initialDirection(this.direction1)
      this.direction = this.direction1
    } else {
      this.initialDirection(this.direction2)
      this.direction = this.direction2;
    }


    this.targetX = this.nextVertex.x + this.radius;
    this.targetY = this.nextVertex.y + this.radius;
    this.updateCounter();
  }
  getStartingCoords (direction, movement) {
    let vertex;
    if (this.subPath1Go) {
      vertex = this.currentVertex
    } else {
      vertex = this.nextVertex
    }
    if ((direction === 90 && movement === 'right') || (direction === 0 && movement === 'left'))
      return [(vertex.x + 50), (vertex.y + 50)]
    else if ((direction === 180 && movement === 'right') || (direction === 90 && movement === 'left'))
      return [vertex.x, (vertex.y + 50)]
    else if ((direction === 270 && movement === 'right') || (direction === 180 && movement === 'left'))
      return [vertex.x, (vertex.y)]
    else if ((direction === 0 && movement === 'right') || (direction === 270 && movement === 'left'))
      return [vertex.x + 50, (vertex.y)]

  }
  enterRight () {
    if (!this.compare&&!this.stopped) this.counter++
    let initialAngle = this.direction1 - 90;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    let targetAngle = initialAngle + 45;
    this.direction = this.angle + 90;
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
    this.targetX = Math.round(startX - (this.radius * Math.cos(Math.PI / 180 * targetAngle)))
    this.targetY = Math.round(startY - (this.radius * Math.sin(Math.PI / 180 * targetAngle)))
    this.updateCounter();
  }
  exitRight () {
    if (!this.compare&&!this.stopped) this.counter++
    let initialAngle = this.direction0 - 45;
    this.angle = initialAngle + (this.counter * (45 / this.stepCount))
    this.direction = this.angle + 90;
    let [startX, startY] = this.getStartingCoords(this.direction0, this.movement1);
    this.targetCornerX = Math.round(startX - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
    this.updateCounter();
  }
  enterLeft () {
    if (!this.compare&&!this.stopped) this.counter++
    let initialAngle = 360 - this.direction1;
    let angleDelta = (this.counter * (45 / this.stepCount));
    this.angle = initialAngle + angleDelta
    let targetAngle = initialAngle + 45;
    this.direction = 360 - initialAngle - angleDelta;
    let [startX, startY] = this.getStartingCoords(this.direction1, this.movement2);
    this.targetCornerX = Math.round(startX - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
    this.targetX = Math.round(startX - (this.radius * Math.sin(Math.PI / 180 * targetAngle)))
    this.targetY = Math.round(startY - (this.radius * Math.cos(Math.PI / 180 * targetAngle)))
    this.updateCounter();
  }
  exitLeft () {
    if (!this.compare&&!this.stopped) this.counter++
    let initialAngle = (360 - this.direction0) + 45;
    let angleDelta = (this.counter * (45 / this.stepCount))
    this.angle = initialAngle + angleDelta;
    this.direction = 360 - initialAngle - angleDelta;
    let [startX, startY] = this.getStartingCoords(this.direction0, this.movement1);
    this.targetCornerX = Math.round(startX - (this.radius * Math.sin(Math.PI / 180 * (this.angle))))
    this.targetCornerY = Math.round(startY - (this.radius * Math.cos(Math.PI / 180 * (this.angle))))
    this.dx = this.targetCornerX - this.currentX
    this.dy = this.targetCornerY - this.currentY
    this.updateCounter();
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
    else if (direction === 270) {
      this.dx = 0;
      this.dy = this.speed;
    }
  }

  findNewPath () {
    console.log('new path')
    if (this.index === this.pathArray.length - 1) {
      this.reachedDestination = true;
      this.requireNewPath = false;
      this.dx = 0
      this.dy = 0
    } else {
      this.currentVertex = this.map.graphObj[this.pathArray[this.index]]
      this.nextVertex = this.map.graphObj[this.pathArray[this.index + 1]]


      if (this.direction1 !== null) this.direction0 = this.direction1;
      if (this.direction2 !== null) this.direction1 = this.direction2;
      else this.direction1 = this.getDirection(this.currentVertex.x, this.nextVertex.x, this.currentVertex.y, this.nextVertex.y)

      if (this.pathArray[this.index + 2]) {
        this.nextNextVertex = this.map.graphObj[this.pathArray[this.index + 2]]
        this.direction2 = this.getDirection(this.nextVertex.x, this.nextNextVertex.x, this.nextVertex.y, this.nextNextVertex.y)
      } else {
        //if there is only 1 vertex left, we will always take a straight line to the end.
        this.direction2 = this.direction1;
      }
      if (this.direction0 !== null) this.movement1 = this.getMovement(this.direction0, this.direction1)
      else {
        this.initialDirection(this.direction1) // When we start, we need to set the initial dx, dy values
        this.direction = this.direction1;
        this.movement1 = 'straight';
      }
      this.movement2 = this.getMovement(this.direction1, this.direction2)
      let subPath = this.getSubPath(this.movement1, this.movement2);
      this.subPath1 = subPath[0]
      this.subPath2 = subPath[1]
      this.counter = 0;
      this.subPath1Go = true;
      this.subPath2Go = true;
      this.stepCount = Math.round(25 / this.speed);
      this.subPath1();


      this.requireNewPath = false;
      if (!this.nextVertex.occupied && this.currentVertex.light === 'green' && !this.compare) {
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
      } else {
        console.log('stop')
        this.stopped = true;
        this.saveDx = this.dx;
        this.saveDy = this.dy;
        this.dx = this.dy = 0;
      }
    }
  }

}