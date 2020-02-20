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
