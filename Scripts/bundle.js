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
const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const dijkstra = require('./Graph/dijkstra');

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

const drawMap = () => {
  c.fillStyle = 'rgb(0,0,0)'
  c.fillRect(200, 100, 500, 100)
  c.fillRect(100, 600, 500, 100)
  c.fillRect(100, 100, 100, 500)
  c.fillRect(600, 200, 100, 500)
  c.fillRect(600, 200, 600, 100)
  c.fillRect(1200, 200, 100, 400)
  c.fillRect(900, 200, 100, 400)
  c.fillRect(900, 500, 500, 100)
  c.fillRect(1000, 500, 100, 400)
  c.fillRect(1100, 900, -600, 100)
  c.fillRect(500, 900, 100, -300)
}

const drawCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'blue'
  c.strokeStyle = 'blue';
  c.stroke();
  c.fill()
}
const drawBlackCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'rgb(0,0,0)'
  c.strokeStyle = 'rgb(0,0,0)';
  c.stroke();
  c.fill()
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



const nextDirection = (currentVertex, nextVertex) => {
  currentX = currentVertex.x + radius;
  currentY = currentVertex.y + radius;
  targetX = nextVertex.x + radius;
  targetY = nextVertex.y + radius;

  if (currentX - targetX > 0) {
    direction = 'Left'
    dx = -speed;
    dy = 0;
  }
  if (currentX - targetX < 0) {
    direction = 'Right'
    dx = speed;
    dy = 0;
  }
  if (currentY - targetY > 0) {
    direction = 'Up'
    dx = 0;
    dy = -speed;
  }
  if (currentY - targetY < 0) {
    direction = 'Down'
    dx = 0;
    dy = speed;
  }
  return dx, dy, targetX, targetY;
}

function animate () {
  const animation = requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);
  drawMap();
  drawCircle(x, y, radius);

  if (reachedDestination === true) {
    dx = 0;
    dy = 0;
    cancelAnimationFrame(animation)
  }
  if (requireNewPath) {
    let currentVertexName = pathArray[i]
    let currentVertex = map.graphObj[currentVertexName]
    let nextVertexName = pathArray[i + 1];
    let nextVertex = map.graphObj[nextVertexName]
    dx, dy, targetX, targetY = nextDirection(currentVertex, nextVertex)
    requireNewPath = false;
  }

  x += dx;
  y += dy;
  if (x === targetX && y === targetY) {
    requireNewPath = true;
    i++;
  }
  if (x === finalX && y === finalY) {
    requireNewPath = false;
    reachedDestination = true;
  }
}
function growCircle () {
  const circleAnimation = requestAnimationFrame(growCircle);
  if (initialRadius >= radius) {
    initialRadius = 0;
    cancelAnimationFrame(circleAnimation)
  }
  drawCircle(clickX, clickY, initialRadius);
  initialRadius += pulseSpeed;
}
function pulseCircle () {
  const pulseAnimation = requestAnimationFrame(pulseCircle);
  if (initialRadius >= radius/1.5) {
    pulseSpeed = -pulseSpeed;
  }
  if (initialRadius < 0) {
    initialRadius = 0;
    pulseSpeed = 5;
    cancelAnimationFrame(pulseAnimation)
    animate();
  }
  if(pulseSpeed<0) drawBlackCircle(clickX, clickY, radius/1.5)
  drawCircle(clickX, clickY, initialRadius);
  initialRadius += pulseSpeed;
}
//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  EVENT LISTENER////////////////////////////////////////////////////////////////
////////*START*initial conditions/////////////

let pulseSpeed = 5;
let speed = 10;
const radius = 50;
let initialRadius = 0;
let dx;
let dy;
let i = 0;

let requireNewPath = true;
let reachedDestination = false;
let direction;
let targetX;
let targetY;
let start;
let end;
let pathArray;
let x;
let y;
let finalX;
let finalY;
////////*END*initial conditions/////////////


const arrayOfVertices = Object.keys(map.graphObj)
let initialClick = false;
let secondClick = false;
let clickX;
let clickY;
window.addEventListener('mousedown', function (e) {
  if (initialClick === false) {
    clickX = Math.floor((e.pageX / 100)) * 100 + radius;
    clickY = Math.floor((e.pageY / 100)) * 100 + radius;
    for (let i = 0; i < arrayOfVertices.length; i++) {
      if (map.graphObj[arrayOfVertices[i]].x === clickX - radius && map.graphObj[arrayOfVertices[i]].y === clickY - radius) {
        growCircle();
        start = arrayOfVertices[i]
        x = clickX;
        y = clickY;
        i = arrayOfVertices.length
        initialClick = true;
      }
    }
  }
  else if (initialClick === true && secondClick === false) {
    clickX = Math.floor((e.pageX / 100)) * 100 + radius;
    clickY = Math.floor((e.pageY / 100)) * 100 + radius;
    for (let i = 0; i < arrayOfVertices.length; i++) {
      if (map.graphObj[arrayOfVertices[i]].x === clickX - radius && map.graphObj[arrayOfVertices[i]].y === clickY - radius) {
        end = arrayOfVertices[i]
        finalX = clickX;
        finalY = clickY;
        i = arrayOfVertices.length
      }
    }
    secondClick = true;
    pathArray = dijkstra(map.graphObj, start, end)[1];
    pulseCircle();
    
  }
  else if (initialClick === true && secondClick === true) {
    start = end;
    x = clickX;
    y = clickY;
    i = 0;
    requireNewPath = true;
    reachedDestination = false;
    clickX = Math.floor((e.pageX / 100)) * 100 + radius;
    clickY = Math.floor((e.pageY / 100)) * 100 + radius;
    for (let i = 0; i < arrayOfVertices.length; i++) {
      if (map.graphObj[arrayOfVertices[i]].x === clickX - radius && map.graphObj[arrayOfVertices[i]].y === clickY - radius) {
        end = arrayOfVertices[i]
        finalX = clickX;
        finalY = clickY;
        i = arrayOfVertices.length
      }
    }
    pathArray = dijkstra(map.graphObj, start, end)[1];
    pulseCircle();
  }
})

//////////////////////////////////////////////////////////////////*END*  EVENT LISTENER////////////////////////////////////////////////////////////////



// animate();
},{"./Graph/dijkstra":2,"./Graph/graph":3,"./Graph/vertex":4}]},{},[5]);
