const Graph = require('./Graph/graph');
const Vertex = require('./Graph/vertex');
const dijkstra = require('./Graph/dijkstra');

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




const c = canvas.getContext('2d');


c.fillStyle = 'rgb(0,0,0)'
c.fillRect(200, 100, 500, 100)
c.fillRect(100, 600, 500, 100)
c.fillRect(100, 100, 100, 500)
c.fillRect(600, 200, 100, 500)
c.fillRect(600, 200, 600, 100)
c.fillRect(1200, 200, 100, 400)
c.fillRect(900, 200, 100, 400)
c.fillRect(900, 500, 500, 100)

imgData = c.getImageData(100, 100, 50, 50);
red = imgData.data[0];
green = imgData.data[1];
blue = imgData.data[2];
alpha = imgData.data[3];
// console.log(red, green, blue, alpha)

imgData = c.getImageData(1, 1, 50, 50);
red = imgData.data[0];
green = imgData.data[1];
blue = imgData.data[2];
alpha = imgData.data[3];
// console.log(red, green, blue, alpha)



// console.log(c.getImageData(100, 100, 50, 50).data[2])
//index helper function//
const getIndex = (index) => (index === 0) ? 0 : index/100;

//Set up array of nodes
let nodeArray = [];
let fullMap = [] // 2d array will be populated with true where a node exists

let idCounter = 1;
for (let i = 0; i < window.innerWidth; i += 100) {
  fullMap[getIndex(i)] = [];
  for (let j = 0; j < window.innerHeight; j += 100) {
    if (c.getImageData(i, j, 1, 1).data[0] === 0 && c.getImageData(i, j, 1, 1).data[1] === 0 && c.getImageData(i, j, 1, 1).data[2] === 0 && c.getImageData(i, j, 1, 1).data[3] === 255) {
      fullMap[getIndex(i)][getIndex(j)] = idCounter;
      const node = {
        id: idCounter,
        x: i,
        y: j,
        edges: [],
      }
      //check previous horizontal node for a connection
      if (fullMap[getIndex(i)][getIndex(j)-1]) {
        let prevNode = nodeArray[idCounter-2];
        node.edges.push(prevNode);
        prevNode.edges.push(node);
      }
      //check previous vertical node for a connection
      if (fullMap[getIndex(i)-1][getIndex(j)]) {
        let prevNodeIndex = fullMap[getIndex(i)-1][getIndex(j)];
        let prevNode = nodeArray[prevNodeIndex-1];
        node.edges.push(prevNode);
        prevNode.edges.push(node);
      }
      nodeArray.push(node);
      idCounter++;
    } else {
      fullMap[getIndex(i)][getIndex(j)] = false;
    }

  }
}
console.log(nodeArray)

// animation
let x = 150;
let y = 150;
let step = 10;
let dx = 10;
let dy = 0;
const radius = 50;

function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  c.fillStyle = 'rgba(0,0,0,0.5)'
  c.fillRect(200, 100, 500, 100)
  c.fillRect(100, 600, 500, 100)
  c.fillRect(100, 100, 100, 500)
  c.fillRect(600, 200, 100, 500)

  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'green'
  // c.fillStyle = 'rgba(255,0,0,0.5)'
  c.strokeStyle = 'green';
  c.stroke();
  c.fill()

  if (x - radius >= 600 && y - radius < 600) {
    dy = step;
    dx = 0;
  }
  else if (x - radius <= 100 && y - radius > 100) {
    dy = -step;
    dx = 0;
  }
  else if (y - radius >= 600 && x - radius > 100) {
    dx = -step;
    dy = 0;
  };
  if (y - radius <= 100 && x - radius < 600) {
    dx = step;
    dy = 0;
  };
  x += dx;
  y += dy;

}
// animate();