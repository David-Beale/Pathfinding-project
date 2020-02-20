(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class MinHeap {
  constructor() {
    this.heapList = [null];
    this.count = 0;
  }
  add (value) {
    this.count++;
    this.heapList.push(value);
    this.heapifyUp();
  }
  heapifyUp () {
    let index = this.count;
    while (this.parentIndex(index) > 0) {
      let child = this.heapList[index];
      let parent = this.heapList[this.parentIndex(index)];
      if (parent[0] > child[0]) {
        this.heapList[index] = parent;
        this.heapList[this.parentIndex(index)] = child;
      }
      index = this.parentIndex(index);
    }
  }
  heapifyDown () {
    let index = 1;
    while (this.childExists(index)) {
      let smallerChildIndex = this.getSmallerChildIndex(index);
      let parent = this.heapList[index];
      let child = this.heapList[smallerChildIndex];
      if (parent[0] > child[0]) {
        this.heapList[smallerChildIndex] = parent;
        this.heapList[index] = child;
      }
      index = smallerChildIndex;
    }
  }
  retrieveMin () {
    if (this.count === 0) {
      return null;
    }
    let min = this.heapList[1];
    this.heapList[1] = this.heapList[this.count];
    this.count--;
    this.heapList.pop();
    this.heapifyDown();
    return min;
  }
  parentIndex (index) {
    return Math.floor(index / 2);
  }
  leftChildIndex (index) {
    return index * 2;
  }
  rightChildIndex (index) {
    return index * 2 + 1;
  }
  getSmallerChildIndex (index) {
    if (this.rightChildIndex(index) > this.count) {
      return this.leftChildIndex(index);
    }
    let leftChild = this.heapList[this.leftChildIndex(index)];
    let rightChild = this.heapList[this.rightChildIndex(index)];
    if (leftChild[0] < rightChild[0]) {
      return this.leftChildIndex(index);
    } else {
      return this.rightChildIndex(index);
    }
  }
  childExists (index) {
    return this.leftChildIndex(index) <= this.count;
  }
}
module.exports = MinHeap;
// let asd = new MinHeap();
// asd.add([42,'A']);
// console.log(asd.retrieveMin());
// console.log(asd.heapList);

// let heap = new MinHeap();
// heap.add([42,'A']);
// console.log(heap.retrieveMin());
// console.log(heap.heapList);
// // console.log( ['A',44] > ['Z',41]);
// heap.add([42,'A']);
// heap.add([10,'B']);
// heap.add([5,'B']);
// heap.add([2,'B']);
// heap.add([41,'B']);
// heap.add([55,'B']);

// heap.add(25);
// heap.add(99);
// heap.add(16);
// heap.add(2);
// heap.add(67);

// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.retrieveMin());
// console.log(heap.heapList);
},{}],2:[function(require,module,exports){
const MinHeap = require('./Heap');

const dijkstra = (graph, start, end) => {
  let distances = {};
  for (property in graph) {
    //////////////////////////////////start here refers to the current path 
    distances[property] = [Infinity, [start]];
  }
  distances[start] = [0, [start]];
  let toExplore = new MinHeap();

  // arg 1 = edge distance, arg 2 = vertex, arg 3 = current path
  toExplore.add([0, start, [start]]);
  while (toExplore.count) {
    let temp = toExplore.retrieveMin();
    let currentDistance = temp[0];
    let currentVertex = temp[1];
    let currentPath = temp[2];
    graph[currentVertex].edges.forEach(arrayItem => {
      let edgeDist = arrayItem[1];
      let neighbour = arrayItem[0];
      let newDistance = currentDistance + edgeDist;
      let newPath = [...currentPath,neighbour]
      //if newdistance is less than stored distance for that vertex
      if (newDistance < distances[neighbour][0]) {
        distances[neighbour][0] = newDistance;
        distances[neighbour][1] = newPath;
        toExplore.add([newDistance, neighbour, newPath]);
      }
    });
  }
  return distances[end];
};
module.exports = dijkstra;

},{"./Heap":1}],3:[function(require,module,exports){

class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.graphObj = {};
  }
  addVertex (vertex) {
    this.graphObj[vertex.value] = vertex;
  }
  addEdge (fromVertex, toVertex, weight = 1) {
    this.graphObj[fromVertex.value].addEdge(toVertex.value, weight);
    if (this.directed === false) {
      this.graphObj[toVertex.value].addEdge(fromVertex.value, weight);
    }
  }
}



module.exports = Graph;
},{}],4:[function(require,module,exports){
class Vertex {
  constructor (value,x,y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.edges = [];
    this.occupied = false;
    this.light = 'green'
  }
  getEdges () {
    let newArr = [];
    for (let i = 0; i < this.edges.length; i++) {
      newArr.push(this.edges[i][0]);
    }
    return newArr;
  }
  addEdge (vertex, weight = 1) {
    this.edges.push([vertex, weight]);
  }
}

module.exports = Vertex;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

const drawTrafficLightBottom = (x, y, color) => {
  c.fillStyle = 'rgb(55, 54, 58)'
  c.fillRect(x + 10, y + 78, 20, 20)
  c.beginPath();
  c.arc(x + 20, y + 88, 5, 0, Math.PI * 2, false);
  c.fillStyle = color
  c.strokeStyle = color;
  c.stroke();
  c.fill()
}
let counter = 0;
const drawMap = () => {
  c.fillStyle = 'rgb(0,0,0)';
  c.fillRect(200, 100, 500, 100);
  c.fillRect(100, 600, 500, 100);
  c.fillRect(100, 100, 100, 500);
  c.fillRect(600, 200, 100, 500);
  c.fillRect(600, 200, 600, 100);
  c.fillRect(1200, 200, 100, 400);
  c.fillRect(900, 200, 100, 400);
  c.fillRect(900, 500, 500, 100);
  c.fillRect(1000, 500, 100, 400);
  c.fillRect(1100, 900, -600, 100);
  c.fillRect(500, 900, 100, -300);
  drawTrafficLightBottom(700, 200, 'red');
  if (counter >= 0 && counter <= 100) drawTrafficLightBottom(700, 200, 'red');
  if (counter > 100 && counter <= 120) drawTrafficLightBottom(700, 200, 'yellow');
  if (counter > 120 && counter <= 220) drawTrafficLightBottom(700, 200, 'green');
  if (counter > 220 && counter <= 240) drawTrafficLightBottom(700, 200, 'yellow');
  if (counter === 240) counter = 0;
}

const drawCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'blue'
  c.strokeStyle = 'blue';
  c.stroke();
  c.fill()
}
const drawRedCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'red'
  c.strokeStyle = 'red';
  c.stroke();
  c.fill()
}
const drawYellowCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'rgba(191, 191, 63, 0.35)'
  c.strokeStyle = 'red';
  c.stroke();
  c.fill()
}

const drawOutlineCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.strokeStyle = 'blue';
  c.stroke();
}

//////////////////////////////////////////////////////////////////*START*  SET UP GRAPH////////////////////////////////////////////////////////////////
drawMap();

const getIndex = (index) => (index === 0) ? 0 : index / 100; //INDEX HELPER FUNCTION
let fullMap = [] // 2D ARRAY WILL BE POPUALTED WITH A VERTEX WHERE A VERTEX EXISTS
let map = new Graph();
let idCounter = 1;

for (let i = 0; i < window.innerWidth; i += 100) {
  fullMap[getIndex(i)] = [];
  for (let j = 0; j < window.innerHeight; j += 100) {
    if (c.getImageData(i, j, 1, 1).data[0] === 0 && c.getImageData(i, j, 1, 1).data[1] === 0 && c.getImageData(i, j, 1, 1).data[2] === 0 && c.getImageData(i, j, 1, 1).data[3] === 255) {
      let vertex = new Vertex(idCounter, i, j);
      map.addVertex(vertex);
      fullMap[getIndex(i)][getIndex(j)] = vertex;

      //CHECK PREVIOUS HORIZONTAL VERTEX FOR A CONNECTION
      if (fullMap[getIndex(i)][getIndex(j) - 1]) {
        let prevVertex = fullMap[getIndex(i)][getIndex(j) - 1];
        map.addEdge(vertex, prevVertex);
      }
      //CHECK PREVIOUS VERTICAL NODE FOR A CONNECTION
      if (fullMap[getIndex(i) - 1][getIndex(j)]) {
        let prevVertex = fullMap[getIndex(i) - 1][getIndex(j)];
        map.addEdge(vertex, prevVertex);
      }
      idCounter++;
    } else {
      fullMap[getIndex(i)][getIndex(j)] = false;
    }

  }
}

//////////////////////////////////////////////////////////////////*END*  SET UP GRAPH////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  ANIMATION////////////////////////////////////////////////////////////////


function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  drawMap(counter);

  if (counter >= 0 && counter <= 100) map.graphObj[25].light = 'red'
  if (counter > 100 && counter <= 120) map.graphObj[25].light = 'yellow'
  if (counter > 120 && counter <= 220) map.graphObj[25].light = 'green'
  if (counter > 220 && counter <= 240) map.graphObj[25].light = 'yellow'

  counter++;
  // /////////collision zone visualiser
  // const arrayOfVertices = Object.keys(map.graphObj);
  // for (let index = 1; index < arrayOfVertices.length; index++) {
  //   if (map.graphObj[index].occupied) {
  //     drawYellowCircle(map.graphObj[index].x + radius, map.graphObj[index].y + radius, radius + 10)
  //   }
  // }
  player.run(drawCircle, drawOutlineCircle);
  computer.run(drawRedCircle);
 
}

//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



const player = new Player('Player', map);
const computer = new Computer('Computer', map)
animate();
window.addEventListener('mousedown', e => {
  player.click(e)
})

},{"./Graph/graph":3,"./Graph/vertex":4,"./computer-vehicle":5,"./player-vehicle":7}],7:[function(require,module,exports){
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
},{"./Graph/dijkstra":2}]},{},[6]);
