const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const dijkstra = require('./Graph/dijkstra');

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
  drawMap(counter);

  if (counter >= 0 && counter <= 100) map.graphObj[25].light = 'red'
  if (counter > 100 && counter <= 120) map.graphObj[25].light = 'yellow'
  if (counter > 120 && counter <= 220) map.graphObj[25].light = 'green'
  if (counter > 220 && counter <= 240) map.graphObj[25].light = 'yellow'

  counter++;
  if (initializing) {
    if (initialRadius > radius) {
      initialRadius = 0;
      initializing = false;
    }
    drawCircle(clickX, clickY, initialRadius);
    initialRadius += pulseSpeed;
  }

  if (initialClick && !initializing) {
    drawCircle(x, y, radius);
  }
  if (pulseCircle) {
    if (initialRadius >= radius / 1.5) {
      pulseSpeed = -pulseSpeed;
    }
    if (initialRadius < 0) {
      initialRadius = 0;
      pulseSpeed = 5;
      pulseCircle = false;
    }
    if (pulseSpeed < 0) drawOutlineCircle(clickX, clickY, (radius / 1.5))
    drawCircle(clickX, clickY, initialRadius);
    initialRadius += pulseSpeed;
  }

  if (reachedDestination) {
    dx = 0;
    dy = 0;
  }
  if (requireNewPath) {
    let currentVertexName = pathArray[i]
    let currentVertex = map.graphObj[currentVertexName]
    let nextVertexName = pathArray[i + 1];
    let nextVertex = map.graphObj[nextVertexName]
    dx, dy, targetX, targetY = nextDirection(currentVertex, nextVertex)
    if (currentVertex.light) {
      if (currentVertex.light === 'green' || direction !== 'Left') {
        requireNewPath = false;
      } else {
        dx = dy = 0;
      }
    }
  }
  if (!reachedDestination) {
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

}

//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  EVENT LISTENER////////////////////////////////////////////////////////////////
////////*START*initial conditions/////////////

let pulseSpeed = 5;
let speed = 5;
const radius = 50;
let initialRadius = 0;
let dx;
let dy;
let i = 0;

let requireNewPath = false;
let reachedDestination = true;
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
let initializing = false;
let initialClick = false;
let secondClick = false;
let pulseCircle = false;
let clickX;
let clickY;
function eventListener (e) {
  if (initialClick === false) {
    clickX = Math.floor((e.pageX / 100)) * 100 + radius;
    clickY = Math.floor((e.pageY / 100)) * 100 + radius;
    for (let i = 0; i < arrayOfVertices.length; i++) {
      if (map.graphObj[arrayOfVertices[i]].x === clickX - radius && map.graphObj[arrayOfVertices[i]].y === clickY - radius) {
        console.log(arrayOfVertices[i])
        initializing = true;
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
        pathArray = dijkstra(map.graphObj, start, end)[1];
        requireNewPath = true;
        reachedDestination = false;
        secondClick = true;
        pulseCircle = true;
        i = arrayOfVertices.length
      }
    }


  }
  else if (initialClick === true && secondClick === true) {
    if (reachedDestination) {
      start = end;
      x = clickX;
      y = clickY;
      i = 0;
      clickX = Math.floor((e.pageX / 100)) * 100 + radius;
      clickY = Math.floor((e.pageY / 100)) * 100 + radius;
      for (let i = 0; i < arrayOfVertices.length; i++) {
        if (map.graphObj[arrayOfVertices[i]].x === clickX - radius && map.graphObj[arrayOfVertices[i]].y === clickY - radius) {
          end = arrayOfVertices[i]
          finalX = clickX;
          finalY = clickY;
          requireNewPath = true;
          reachedDestination = false;
          pathArray = dijkstra(map.graphObj, start, end)[1];
          pulseCircle = true;
          i = arrayOfVertices.length
        }
      }
    }
  }
}
window.addEventListener('mousedown', e => {
  eventListener(e)
})

//////////////////////////////////////////////////////////////////*END*  EVENT LISTENER////////////////////////////////////////////////////////////////



animate();