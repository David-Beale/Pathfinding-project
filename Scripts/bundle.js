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
      if (this.nextVertex.occupied) {
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
},{}],6:[function(require,module,exports){
const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const {drawMap, setUpGraph, map} = require('./map')

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
// const drawMap = () => {
//   c.fillStyle = 'rgb(0,0,0)';
//   c.fillRect(200, 100, 500, 100);
//   c.fillRect(100, 600, 500, 100);
//   c.fillRect(100, 100, 100, 500);
//   c.fillRect(600, 200, 100, 500);
//   c.fillRect(600, 200, 600, 100);
//   c.fillRect(1200, 200, 100, 400);
//   c.fillRect(900, 200, 100, 400);
//   c.fillRect(900, 500, 500, 100);
//   c.fillRect(1000, 500, 100, 400);
//   c.fillRect(1100, 900, -600, 100);
//   c.fillRect(500, 900, 100, -300);
//   drawTrafficLightBottom(700, 200, 'red');
//   if (counter >= 0 && counter <= 100) drawTrafficLightBottom(700, 200, 'red');
//   if (counter > 100 && counter <= 120) drawTrafficLightBottom(700, 200, 'yellow');
//   if (counter > 120 && counter <= 220) drawTrafficLightBottom(700, 200, 'green');
//   if (counter > 220 && counter <= 240) drawTrafficLightBottom(700, 200, 'yellow');
//   if (counter === 240) counter = 0;
// }

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
setUpGraph();
// const getIndex = (index) => (index === 0) ? 0 : index / 100; //INDEX HELPER FUNCTION
// let fullMap = [] // 2D ARRAY WILL BE POPUALTED WITH A VERTEX WHERE A VERTEX EXISTS
// let map = new Graph();
// let idCounter = 1;

// for (let i = 0; i < window.innerWidth; i += 100) {
//   fullMap[getIndex(i)] = [];
//   for (let j = 0; j < window.innerHeight; j += 100) {
//     if (c.getImageData(i, j, 1, 1).data[0] === 0 && c.getImageData(i, j, 1, 1).data[1] === 0 && c.getImageData(i, j, 1, 1).data[2] === 0 && c.getImageData(i, j, 1, 1).data[3] === 255) {
//       let vertex = new Vertex(idCounter, i, j);
//       map.addVertex(vertex);
//       fullMap[getIndex(i)][getIndex(j)] = vertex;

//       //CHECK PREVIOUS HORIZONTAL VERTEX FOR A CONNECTION
//       if (fullMap[getIndex(i)][getIndex(j) - 1]) {
//         let prevVertex = fullMap[getIndex(i)][getIndex(j) - 1];
//         map.addEdge(vertex, prevVertex);
//       }
//       //CHECK PREVIOUS VERTICAL NODE FOR A CONNECTION
//       if (fullMap[getIndex(i) - 1][getIndex(j)]) {
//         let prevVertex = fullMap[getIndex(i) - 1][getIndex(j)];
//         map.addEdge(vertex, prevVertex);
//       }
//       idCounter++;
//     } else {
//       fullMap[getIndex(i)][getIndex(j)] = false;
//     }

//   }
// }

//////////////////////////////////////////////////////////////////*END*  SET UP GRAPH////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  ANIMATION////////////////////////////////////////////////////////////////


function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  drawMap();

  // if (counter >= 0 && counter <= 100) map.graphObj[25].light = 'red'
  // if (counter > 100 && counter <= 120) map.graphObj[25].light = 'yellow'
  // if (counter > 120 && counter <= 220) map.graphObj[25].light = 'green'
  // if (counter > 220 && counter <= 240) map.graphObj[25].light = 'yellow'
  // counter++;

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

},{"./Graph/graph":3,"./Graph/vertex":4,"./computer-vehicle":5,"./map":7,"./player-vehicle":8}],7:[function(require,module,exports){
const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const {XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC} = require('./tiles')

const arrayOfTiles = 
[ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
  [     0,    TLC,     HR,     HR,     HR,     HR,    TRC,      0,      0,      0,      0,      0,      0,      0],
  [     0,     VR,      0,      0,      0,      0,     TR,     HR,     HR,     TB,     HR,     HR,    TRC,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
  [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,    BLC,     TB,     HR,     BRC,     0],
  [     0,    BLC,     HR,     HR,     HR,     TB,    BRC,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
  [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0],
]

let idCounter = 1;
let map = new Graph(true);


const drawMap = () => {
  for (let i = 0; i < arrayOfTiles.length; i++) {
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      let func = arrayOfTiles[i][j]
      if(func) {
        func(j*100,i*100);
      }
    }
  }
}
const setUpGraph = () => {
  let mapOfVertices = []
  //load vertices
  for (let i = 0; i < arrayOfTiles.length; i++) {
    mapOfVertices.push([])
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      let func = arrayOfTiles[i][j]
      if(func) {
        mapOfVertices[i].push(setUpVertices(idCounter,j,i));
        idCounter++
      } else mapOfVertices[i].push(0);
    }
  }
  //load edges
  for (let i = 0; i < arrayOfTiles.length; i++) {
    for (let j = 0; j < arrayOfTiles[0].length; j++) {
      if(mapOfVertices[i][j]) {
        setUpEdges(mapOfVertices[i][j],j,i,arrayOfTiles[i][j], mapOfVertices)
      }
    }
  }
}


const setUpVertices = (idCounter,x,y) => {
  let vertexA = new Vertex(idCounter+'A',x*100,y*100)
  let vertexB = new Vertex(idCounter+'B',(x*100)+50,y*100)
  let vertexC = new Vertex(idCounter+'C',x*100,(y*100)+50)
  let vertexD = new Vertex(idCounter+'D',(x*100)+50,(y*100)+50)
  map.addVertex(vertexA);
  map.addVertex(vertexB);
  map.addVertex(vertexC);
  map.addVertex(vertexD);
  return [vertexA, vertexB, vertexC, vertexD]
}
const setUpEdges = (vertices,x,y,type, mapOfVertices) => {
  if(type === HR) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === VR) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === TLC) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[0],vertices[1]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TRC) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === BLC) {
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[2],vertices[0]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === BRC) {
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[3],vertices[2]);
  }
  if(type === TT) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[2],vertices[0]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TB) {
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === TL) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === TR || type === XR) {
    map.addEdge(vertices[2],vertices[0]);
    map.addEdge(vertices[1],vertices[3]);
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[3],vertices[2]);
    const tileDownVertices = mapOfVertices[y+1][x];
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }

}
module.exports = {drawMap, setUpGraph, map}
},{"./Graph/graph":3,"./Graph/vertex":4,"./tiles":9}],8:[function(require,module,exports){
const dijkstra = require('./Graph/dijkstra');

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
},{"./Graph/dijkstra":2}],9:[function(require,module,exports){
const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');


module.exports = {
  XR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
  },
  HR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    for (let i = 1; i < 100; i += 98) {
      c.beginPath()
      c.moveTo(x, y + i);
      c.lineTo(x + 100, y + i);
      c.stroke();
    }
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
  },
  TB: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x , y+99);
    c.lineTo(x + 50, y + 99);
    c.stroke();
  },
  TT: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x +50, y+1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
  },
  VR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    for (let i = 1; i < 100; i += 98) {
      c.beginPath()
      c.moveTo(x + i, y);
      c.lineTo(x + i, y + 100);
      c.stroke();
    }
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
  },
  TR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 99, y+50);
    c.lineTo(x + 99, y + 100);
    c.stroke();
  },
  TL: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x +1, y);
    c.lineTo(x + 1, y + 50);
    c.stroke();
  },
  TLC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  TRC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  BRC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  },
  BLC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  }
}


},{}]},{},[6]);
