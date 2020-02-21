const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const {drawMap, setUpGraph, map} = require('./map')
const drawLights = require('./traffic-lights')

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

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
drawLights();
let counter = 0;
const limit = 400;

//////////////////////////////////////////////////////////////////*END*  SET UP GRAPH////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////*START*  ANIMATION////////////////////////////////////////////////////////////////


function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  drawMap();
  drawLights(counter,map);
  counter ++;
  if(counter === limit ) counter = 0;


  // /////////collision zone visualiser
  // const arrayOfVertices = Object.keys(map.graphObj);
  // for (let index = 1; index < arrayOfVertices.length; index++) {
  //   if (map.graphObj[index].occupied) {
  //     drawYellowCircle(map.graphObj[index].x + radius, map.graphObj[index].y + radius, radius + 10)
  //   }
  // }
  player.run(drawCircle, drawOutlineCircle);
  for (let i = 0; i < computerArray.length; i++) {
    computerArray[i].run(drawRedCircle)    
  }
}

//////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



const player = new Player('Player', map);
const numberOfComputers = 30;
const computerArray = []
for (let i = 0; i < numberOfComputers; i++) {
  let computer = new Computer('Computer'+i, map)
  computerArray.push(computer)
}
animate();
window.addEventListener('mousedown', e => {
  player.click(e)
})
