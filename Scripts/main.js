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