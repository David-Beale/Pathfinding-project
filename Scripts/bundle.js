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

const dijkstraTime = (graph, start, end) => {
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
      let edgeDist = graph[currentVertex].average;
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
module.exports = dijkstraTime;

},{"./Heap":1}],3:[function(require,module,exports){
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

},{"./Heap":1}],4:[function(require,module,exports){

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
},{}],5:[function(require,module,exports){
class Vertex {
  constructor(value, x, y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.edges = [];
    this.occupied = false;
    this.light = 'green'
    this.internalCounter = 0;
    this.averageArray = [];
    this.average = 10;
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
  occupiedCheck () {
    if (this.occupied === true) this.internalCounter++

  }
  occupiedFalse (speed) {
    this.occupied = false;
    if(this.internalCounter>0) {
      this.averageArray.push(this.internalCounter)
      this.internalCounter = 0;
      if (this.averageArray.length > 10) this.averageArray.shift();
      if (this.averageArray.length) {
        this.average = 0;
        for (let i = 0; i < this.averageArray.length; i++) {
          this.average += this.averageArray[i]
        }
        this.average /= this.averageArray.length
      }
    }
  }


  getAverageTime () {
    return this.average;
  }
}

module.exports = Vertex;
},{}],6:[function(require,module,exports){
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
      // if(this.nextVertex.occupied && this.nextVertex.speed < this.speed){
      //   this.speed = this.nextVertex.speed
      // } 
      else {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
        // this.nextVertex.speed = this.speed;
        this.nextDirection()
        this.currentVertex = this.nextVertex;
      }
    }
    //GET DIRECTIONS TO NEXT DESTINATION
    

    

  }

}
},{"./tiles.js":10}],7:[function(require,module,exports){
const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const { drawMap, setUpGraph, map } = require('./map')
const drawLights = require('./traffic-lights')
const { drawYellowCircle, drawTraffic, reset, drawBackground } = require('./tiles.js')
const tiles = require('./tiles.js')


const collisionZone = () => {
  const arrayOfVerticesx = Object.keys(map.graphObj);
  for (let index = 0; index < arrayOfVerticesx.length; index++) {
    const vertex = map.graphObj[arrayOfVerticesx[index]]
    if (vertex.occupied) {
      drawYellowCircle(vertex.x + 25, vertex.y + 25, 35)
    }
  }
}
const trafficVisFunc = () => {
  const arrayOfVertices = Object.keys(map.graphObj);
  for (let index = 0; index < arrayOfVertices.length; index++) {

    const vertex = map.graphObj[arrayOfVertices[index]]
    vertex.occupiedCheck();
    drawTraffic(vertex.x, vertex.y, vertex.getAverageTime())
  }
}

$(() => {


  //////////////////////////////////////////////////////////////////*START*  SET UP GRAPH////////////////////////////////////////////////////////////////
  drawMap();
  setUpGraph();
  drawLights();
  let counter = 0;
  const limit = 400;


  //////////////////////////////////////////////////////////////////*END*  SET UP GRAPH////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////*START*  ANIMATION////////////////////////////////////////////////////////////////


  function animate () {
    requestAnimationFrame(animate);
    if (start) {
      if (tiles.cameraLock) {
        let diffX = (tiles.width / 2) - (player.currentX - tiles.cameraX);
        let diffY = (tiles.height / 2) - (player.currentY - tiles.cameraY);
        tiles.translate(diffX, diffY);
        tiles.cameraX -= diffX;
        tiles.cameraY -= diffY;
      }
      reset(tiles.cameraX, tiles.cameraY);
      drawBackground();
      drawMap();
      drawLights(counter, map, override);
      counter++;
      if (counter === limit) counter = 0;


      /////////collision zone visualiser
      if (collisionVis) {
        collisionZone()
      }



      // /////////traffic visualiser
      if (trafficVis) {
        trafficVisFunc()
      }

      player.run();
      if (player.compare && compareClickCount === 2) {
        $('#distance-info').html(`Distance: ${player.comparePaths.distance.distance}<br> Time: ${Math.round(player.comparePaths.distance.time)}`)
        $('#time-info').html(`Distance: ${player.comparePaths.time.distance}<br> Time: ${Math.round(player.comparePaths.time.time)}`)
      }

      for (let i = 0; i < numberOfComputers; i++) {
        computerArray[i].run()
      }
    }

  }

  //////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



  let player = new Player('Player', map);
  let numberOfComputers = 5;
  let computerArray;
  const arrayOfVertices = Object.keys(map.graphObj);
  function generateComps (num) {
    if (computerArray) {
      for (let i = 0; i < computerArray.length; i++) {
        computerArray[i].currentVertex.occupied = false;
      }
    }
    computerArray = [];
    let usedVertices = [];
    for (let i = 0; i < num; i++) {
      let firstRun = true;
      let randomVertex;
      while (firstRun || usedVertices.includes(randomVertex)) {
        firstRun = false;
        randomVertex = arrayOfVertices[Math.floor(Math.random() * arrayOfVertices.length)]
      }
      usedVertices.push(randomVertex)
      let computer = new Computer('Computer' + i, map, randomVertex)
      computerArray.push(computer)
    }
  }
  let start = true;
  let override = true;
  let collisionVis = false;
  let trafficVis = false
  let compareClickCount = 0;
  generateComps(numberOfComputers)
  animate();
  $("canvas").mousedown(function (e) {
    if (e.which===3) {
      e.preventDefault
      player.click = true;
      player.event = e;
      //// If there is no player car already on the map:
      if (player.compare && !compareClickCount) {
        $('#text').html('Select a destination')
        compareClickCount = 1;
      }
      else if (player.compare && compareClickCount === 1) {
        $('#distance').removeClass("selected")
        $('#time').removeClass("selected")
        $('#text').html('Select a method')
        compareClickCount = 2;
      }
    }
  });

  $("#distance").on('click', function () {
    player.pathfinding = 'dijkstra';
    if (player.compare && compareClickCount === 2) {
      $('#text').html('Select a destination')
      $('#distance-info').html(``)
      $('#time-info').html(``)
      compareClickCount = 1;
      player.compare = false;
      player.compareReady = false;
      $('#compare').removeClass("selected")
      $("#distance-info").toggleClass("hidden");  
      $("#text").toggleClass("hidden");
      $("#time-info").toggleClass("hidden");
    }
  });
  $("#time").on('click', function () {
    player.pathfinding = 'dijkstra-time';
    if (player.compare && compareClickCount === 2) {
      $('#text').html('Select a destination')
      $('#distance-info').html(``)
      $('#time-info').html(``)
      compareClickCount = 1;
      //the default path is distance. Therefore we have to switch it to the time path
      player.pathColor = 'yellow'
      if (!player.setNewDestination) {
        player.pathArray = player.comparePaths.time.path;
      } else {
        player.save.pathArray = player.comparePaths.time.path;
      }
      player.compare = false;
      player.compareReady = false;

      $('#compare').removeClass("selected")
      $("#distance-info").toggleClass("hidden");
      $("#text").toggleClass("hidden");
      $("#time-info").toggleClass("hidden");
    }
  });

  $("button").on('click', function () {
    $(this).toggleClass("selected")
    if ($(this).attr('id') === 'distance' && $(this).hasClass("selected") &&
      $('#time').hasClass("selected")) {
      $('#time').toggleClass("selected")
    }
    else if ($(this).attr('id') === 'time' && $(this).hasClass("selected") &&
      $('#distance').hasClass("selected")) {
      $('#distance').toggleClass("selected")
    }
    else if ($(this).attr('id') === 'compare' && $(this).hasClass("selected")) {
      $('#distance').removeClass("selected")
      $('#time').removeClass("selected")
    }
  });

  $("#start").on('click', function () {
    start = !start;
  });

  $("#lights").on('click', function () {
    override = !override;
  });
  $("#collision").on('click', function () {
    collisionVis = !collisionVis;
  });
  $("#traffic").on('click', function () {
    trafficVis = !trafficVis;
  });

  $("#compare").on('click', function () {
    $("#distance-info").toggleClass("hidden");
    $("#text").toggleClass("hidden");
    $("#time-info").toggleClass("hidden");

    if (!$("#text").hasClass("hidden")) {
      // if (!player.nextVertex && player.currentVertex) {
      //   player.currentVertex.occupiedFalse();
      // } else if (player.nextVertex) {
      //   player.nextVertex.occupiedFalse();
      // }
      player.compare = true;
      // player = new Player('Player', map);
      if (player.ready) {
        $('#text').html('Select a destination')
        compareClickCount = 1;
      } else {
        $('#text').html('Select a start point')
        compareClickCount = 0;
      }

    } else {
      player.compare = false;
    }
  });

  $(function () {
    $("#user-speed-slider").slider({
      value: 5,
      min: 1,
      max: 5,
      step: 4,
      slide: function (event, ui) {
        player.speed = ui.value;
      }
    });
  });
  $(function () {
    $("#computer-speed-slider").slider({
      value: 5,
      min: 1,
      max: 5,
      step: 4,
      slide: function (event, ui) {
        for (let i = 0; i < numberOfComputers; i++) {
          computerArray[i].speed = ui.value;
        }
      }
    });
  });
  $("#num-comps")
    .on('submit', function (e) {
      e.preventDefault();
      numberOfComputers = $('#num-comps-val').val();
      generateComps(numberOfComputers)
    })


  module.exports = player

})

},{"./computer-vehicle":6,"./map":8,"./player-vehicle":9,"./tiles.js":10,"./traffic-lights":11}],8:[function(require,module,exports){
const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const {XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC} = require('./tiles')

// const arrayOfTiles = 
// [ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,    TLC,     HR,     HR,     HR,     HR,    TRC,      0,      0,      0,      0,      0,      0,      0],
//   [     0,     VR,      0,      0,      0,      0,     TR,     HR,     HR,     TB,     HR,     HR,    TRC,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,    BLC,     TB,     HR,     BRC,     0],
//   [     0,    BLC,     HR,     HR,     HR,     TB,    BRC,      0,      0,      0,     VR,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
//   [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0],
// ]
// const arrayOfTiles = 
// [ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,    TLC,     HR,     HR,     HR,     HR,    TRC,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,     VR,      0,      0,      0,      0,     TR,     HR,     HR,     TB,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,    TRC],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,     VR],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,     VR],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,     VR],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,    BLC,     TB,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,     HR,    BRC],
//   [     0,    BLC,     HR,     HR,     HR,     TB,    BRC,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
// ]
const arrayOfTiles = 
[[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	TLC,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	TB,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	TRC,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	TLC,	HR,	HR,	HR,	TB,	HR,	HR,	HR,	HR,	TT,	HR,	HR,	TB,	HR,	HR,	HR,	TRC,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	TR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	TB,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	TL,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	TR,	HR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	XR,	HR,	HR,	HR,	HR,	HR,	TL,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	TR,	HR,	HR,	HR,	TT,	HR,	TB,	HR,	TT,	HR,	HR,	TB,	TT,	HR,	HR,	HR,	TL,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	BLC,	HR,	HR,	HR,	HR,	HR,	TT,	HR,	HR,	TB,	HR,	TT,	HR,	HR,	HR,	HR,	BRC,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	VR,	0],
[0,	BLC,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	TT,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	HR,	BRC,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],]

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
let mapOfVertices = []
const setUpGraph = () => {
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
    vertices[0].corner = 'TLCOuter'
    vertices[3].corner = 'TLCInner'
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
    vertices[1].corner = 'TRCOuter'
    vertices[2].corner = 'TRCInner'
    map.addEdge(vertices[0],vertices[1]);
    map.addEdge(vertices[1],vertices[3]);
    const tileDownVertices = mapOfVertices[y+1][x];
    map.addEdge(vertices[3], tileDownVertices[1]);
    map.addEdge(tileDownVertices[0], vertices[2]);
  }
  if(type === BLC) {
    vertices[2].corner = 'BLCOuter'
    vertices[1].corner = 'BLCInner'
    map.addEdge(vertices[3],vertices[2]);
    map.addEdge(vertices[2],vertices[0]);
    const tileRightVertices = mapOfVertices[y][x+1];
    map.addEdge(vertices[1], tileRightVertices[0]);
    map.addEdge(tileRightVertices[2], vertices[3]);
  }
  if(type === BRC) {
    vertices[3].corner = 'BRCOuter'
    vertices[0].corner = 'BRCInner'
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
module.exports = {drawMap, setUpGraph, map, mapOfVertices}
},{"./Graph/graph":4,"./Graph/vertex":5,"./tiles":10}],9:[function(require,module,exports){
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

    if (this.subPath1Go) {
      this.subPath1();
    } else if (this.subPath2Go) {
      this.subPath2();
      if(this.reset) {
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
    if (this.ready) {
      this.drawPlayerCar()
    }
  }




  ///////////////Functions/////////////////////
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
    this.currentX = this.nextVertex.x+this.radius;
    this.currentY = this.nextVertex.y+this.radius;
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
    else if (direction2 < direction1 ) return 'left';
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
    if (!this.compare) this.counter++
    if (this.subPath1Go) {
      this.initialDirection(this.direction1)
    } else this.initialDirection(this.direction2)

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
    if (!this.compare) this.counter++
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
    if (!this.compare) this.counter++
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
    if (!this.compare) this.counter++
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
    if (!this.compare) this.counter++
    let initialAngle = (360 -this.direction0) + 45;
    let angleDelta = (this.counter * (45 / this.stepCount))
    this.angle = initialAngle + angleDelta;
    this.direction = 360 - initialAngle - angleDelta ;
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


      if (!this.nextVertex.occupied && (this.currentVertex.light === 'green' && !this.compare)) {
        this.requireNewPath = false;
        this.currentVertex.occupiedFalse();
        this.nextVertex.occupied = true;
      } else this.dx = this.dy = 0;
    }
  }

}
},{"./Graph/dijkstra":3,"./Graph/dijkstra-time":2,"./tiles.js":10}],10:[function(require,module,exports){

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight;
// canvas.width = 1800;
// canvas.height = 1150;

const background = new Image();
background.src = "./Assets/FoilageGrass_1.jpg";
const c = canvas.getContext('2d');


const tiles = {
  drawCar: function (x, y, degrees, car) {
    c.save();
    c.translate(x + 25, y + 12.5);
    c.rotate(degrees * Math.PI / 180);
    c.drawImage(car, -25, -12.5, 50, 25);
    c.restore();
  },
  drawBackground: function () {
    c.drawImage(background,-canvas.width/2,-canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,-canvas.width/2,canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,-canvas.width/2,canvas.width*1.5,canvas.width, canvas.width)
    c.drawImage(background,canvas.width/2,-canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,canvas.width/2,canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,canvas.width/2,canvas.width*1.5,canvas.width, canvas.width)
    c.drawImage(background,canvas.width*1.5,-canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,canvas.width*1.5,canvas.width/2,canvas.width, canvas.width)
    c.drawImage(background,canvas.width*1.5,canvas.width*1.5,canvas.width, canvas.width)
  },
  reset: function (offsetX, offsetY) {
    c.clearRect(0+offsetX, 0+offsetY, canvas.width, canvas.height);
  },
  drawTraffic: function (x, y, average) {
    if (average === 0) color = 'rgba(70, 240, 36, 0)'
    else if (average <= 15) color = 'rgba(70, 240, 36, 0.1)'
    else if (average <= 25) color = 'rgba(226, 240, 36, 0.3)'
    else color = 'rgba(240, 36, 36, 0.3)'
    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, 50, 50);
  },
  drawOutlineCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.strokeStyle = 'white';
    c.stroke();
  },
  drawCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'white'
    c.strokeStyle = 'white';
    c.stroke();
    c.fill()
  },
  drawRedCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'red'
    c.strokeStyle = 'red';
    c.stroke();
    c.fill()
  },
  drawYellowCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'rgba(191, 191, 63, 0.35)'
    c.strokeStyle = 'red';
    c.stroke();
    c.fill()
  },
  drawLine: function (x, y, targetx, targety, color) {
    c.beginPath();
    c.fillStyle = color;
    let margin = 0;
    if (color === 'yellow') {
      margin = 1.5;
    }
    let dx = targetx - x;
    let dy = targety - y
    if (dx === 0) {
      c.fillRect(x - 2.5 - margin / 2, y, 5 + margin, dy * 1.05);
    } else c.fillRect(x, y - 2.5 - margin / 2, dx * 1.05, 5 + margin);

  },
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
    c.moveTo(x, y + 99);
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
    c.moveTo(x + 50, y + 1);
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
    c.moveTo(x + 99, y + 50);
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
    c.moveTo(x + 1, y);
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
  },
  drawOneLight: function (x, y, counter, offset) {
    let color;
    let value = counter + offset;
    if (value <= 180) color = 'red';
    else if (value <= 200) color = 'yellow';
    else if (value <= 380) color = 'green';
    else if (value <= 400) color = 'yellow';
    else if (value <= 580) color = 'red';
    else if (value <= 600) color = 'yellow';

    c.beginPath();
    c.arc(x, y, 5, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.strokeStyle = 'black';
    c.stroke();
    c.fill()
    return color;
  },
  TrLiU1: function (x, y, counter) {
    return tiles.drawOneLight(x + 8.5, y - 8.5, counter, 0)
  },
  TrLiL1: function (x, y, counter) {
    return tiles.drawOneLight(x - 8.5, y + 91.5, counter, 0)
  },
  TrLiR1: function (x, y, counter) {
    return tiles.drawOneLight(x + 108.5, y + 8.5, counter, 0)
  },
  TrLiD1: function (x, y, counter) {
    return tiles.drawOneLight(x + 91.5, y + 108.5, counter, 0)
  },
  TrLiU2: function (x, y, counter) {
    return tiles.drawOneLight(x + 8.5, y - 8.5, counter, 200)
  },
  TrLiL2: function (x, y, counter) {
    return tiles.drawOneLight(x - 8.5, y + 91.5, counter, 200)
  },
  TrLiR2: function (x, y, counter) {
    return tiles.drawOneLight(x + 108.5, y + 8.5, counter, 200)
  },
  TrLiD2: function (x, y, counter) {
    return tiles.drawOneLight(x + 91.5, y + 108.5, counter, 200)
  },
  width: canvas.width,
  height: canvas.height,
  c:c,
  cameraX: 0,
  cameraY: 0,
  cameraLock: false,
  translate: function(x,y) {
    c.translate(x, y);
  },

}
$(() => {

  $("#lock").on('click', function () {
    const player = require('./main')

    tiles.cameraLock = !tiles.cameraLock;
    if(tiles.cameraLock){
      let diffX = (canvas.width/2)-(player.currentX-tiles.cameraX);
      let diffY = (canvas.height/2)-(player.currentY-tiles.cameraY);
      
      c.translate(diffX, diffY);
      tiles.cameraX -= diffX;
      tiles.cameraY -= diffY;
      tiles.reset(tiles.cameraX, tiles.cameraY)
    }
  });


  let dragging = false;

  $('canvas').mousedown(function (e) {
      prevX = e.pageX;
      prevY = e.pageY;
      dragging = true;
  })
    .mousemove(function (e) {
      if (dragging === true) {
        let diffX = e.pageX - prevX
        let diffY = e.pageY - prevY;
        prevX = e.pageX
        prevY = e.pageY
        tiles.cameraX -= diffX;
        tiles.cameraY -= diffY;
        c.translate(diffX, diffY);
      }
    })
    .mouseup(function (e) {
      dragging = false
    })
    .mouseleave(function (e) {
      dragging = false
    });

})


module.exports = tiles;
},{"./main":7}],11:[function(require,module,exports){
const { XR, HR, TB, TT, VR, TR, TL, TLC, TRC, BRC, BLC, TrLiU1, TrLiL1, TrLiR1, TrLiD1, TrLiU2, TrLiL2, TrLiR2, TrLiD2 } = require('./tiles')
const { mapOfVertices } = require('./map')

const left = [TrLiL1, TrLiL2];
const right = [TrLiR1, TrLiR2];
const up = [TrLiU1, TrLiU2];
const down = [TrLiD1, TrLiD2];
const lights = [...up, ...down, ...left, ...right];

const arrayOfTrafficLights = 
// [ [     0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0],
//   [     0,    TLC,     HR,     HR,     HR,     HR, TrLiD2,      0,      0,      0,      0,      0,      0,      0],
//   [     0,     VR,      0,      0,      0,      0,     TR,  TrLiL1, TrLiR2,     TB,  TrLiL2,     HR,    TRC,      0],
//   [     0,     VR,      0,      0,      0,      0, TrLiU2,      0,      0, TrLiU1,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0,     VR,      0,      0,     VR,      0],
//   [     0,     VR,      0,      0,      0,      0,     VR,      0,      0, TrLiR2,     TB, TrLiL2,     BRC,     0],
//   [     0,    BLC,     HR,     HR, TrLiR2,      1, TrLiL2,      0,      0,      0, TrLiU1,      0,      0,      0],
//   [     0,      0,      0,      0,      0, TrLiU1,      0,      0,      0,      0,     VR,      0,      0,      0],
//   [     0,      0,      0,      0,      0,     VR,      0,      0,      0,      0,     VR,      0,      0,      0],
//   [     0,      0,      0,      0,      0,    BLC,     HR,     HR,     HR,     HR,    BRC,      0,      0,      0],
// ]
[[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	TrLiR2,	0,	TrLiL2,	0,	TrLiR2,	0,	TrLiL2,	0,	TrLiR2,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	TrLiU1,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	TrLiD1,	0,	0,	0,	TrLiD1,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	0,	0,	TrLiL2,	0,	TrLiR2,	0,	TrLiL2,	0,	TrLiR2,	0,	TrLiL2,	0,	TrLiR2,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	TrLiU1,	0,	0,	0,	TrLiU1,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	TrLiL2,	0,	TrLiR2,	0,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	0,	0,	TrLiL2,	0,	TrLiR2,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	TrLiD1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	0,	TrLiR2,	0,	TrLiL2,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	TrLiU1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
[0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],]





const drawLights = (counter, map, override) => {
  for (let i = 0; i < arrayOfTrafficLights.length; i++) {
    for (let j = 0; j < arrayOfTrafficLights[0].length; j++) {
      let func = arrayOfTrafficLights[i][j];
      if (lights.includes(func)) {
        let color
        if(override) {
          color = 'green'
        }
        else {color = func(j * 100, i * 100, counter)}
        ;
        updateVertex(i, j, func, color);
      }
    }
  }
}

const updateVertex = (i, j, func, color) => {
  const vertices = mapOfVertices[i][j];
  let vertex;
  if (left.includes(func)) vertex = vertices[2];
  else if (right.includes(func)) vertex = vertices[1];
  else if (down.includes(func)) vertex = vertices[3];
  else if (up.includes(func)) vertex = vertices[0];
  vertex.light = color;
}
module.exports = drawLights;
},{"./map":8,"./tiles":10}]},{},[7]);
