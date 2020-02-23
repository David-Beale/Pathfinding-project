const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const { drawMap, setUpGraph, map } = require('./map')
const drawLights = require('./traffic-lights')
const { drawYellowCircle } = require('./tiles.js')

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');





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
  c.clearRect(0, 0, innerWidth, innerHeight);
  drawMap();
  drawLights(counter, map);
  counter++;
  if (counter === limit) counter = 0;
  


  // /////////collision zone visualiser
  // const arrayOfVertices = Object.keys(map.graphObj);
  // for (let index = 0; index < arrayOfVertices.length; index++) {
  //   const vertex = map.graphObj[arrayOfVertices[index]]
  //   if (vertex.occupied) {
  //     drawYellowCircle(vertex.x + 25, vertex.y + 25, 35)
  //   }
  // }

  player.run();
  for (let i = 0; i < computerArray.length; i++) {
    computerArray[i].run()
  }
}

//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



const player = new Player('Player', map);
const numberOfComputers = 30;
const computerArray = []
const usedVertices = []
const arrayOfVertices = Object.keys(map.graphObj);

for (let i = 0; i < numberOfComputers; i++) {
  let firstRun = true;
  let randomVertex;
  while(firstRun || usedVertices.includes(randomVertex)){
    firstRun = false;
    randomVertex = arrayOfVertices[Math.floor(Math.random() * arrayOfVertices.length)]
  }
  usedVertices.push(randomVertex)
  let computer = new Computer('Computer' + i, map, randomVertex)
  computerArray.push(computer)
}
animate();
window.addEventListener('mousedown', e => {
  player.click(e)
})
