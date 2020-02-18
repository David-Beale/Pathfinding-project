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
}

const drawCircle = (x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'green'
  c.strokeStyle = 'green';
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

//////////////////////////////////////////////////////////////////*START*  EVENT LISTENER////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*END*  EVENT LISTENER////////////////////////////////////////////////////////////////
const radius = 50;

let initialClick = false;
let secondClick = false;
window.addEventListener('mousedown', function (e) {
  if(initialClick === false) {
    clickX = Math.floor((e.pageX/100))*100 + radius;
    clickY = Math.floor((e.pageY/100))*100 + radius;
    drawCircle(clickX, clickY, radius);
    initialClick = true;
  }

  console.log(clickX, clickY)
})

//////////////////////////////////////////////////////////////////*START*  PATHFINDER////////////////////////////////////////////////////////////////

const start = 1;
const end = 10;

const pathArray = dijkstra(map.graphObj, start, end)[1];
//////////////////////////////////////////////////////////////////*END*  PATHFINDER////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  ANIMATION////////////////////////////////////////////////////////////////

////////*START*initial conditions/////////////

let speed = 10;

let dx;
let dy;
let i = 0;
let x = map.graphObj[start].x + radius;
let y = map.graphObj[start].y + radius;
let finalX = map.graphObj[end].x + radius;
let finalY = map.graphObj[end].y + radius;
let requireNewPath = true;
let reachedDestination = false;
let direction;
let targetX;
let targetY;
////////*END*initial conditions/////////////

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


//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////
animate();