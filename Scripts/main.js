const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const { drawMap, setUpGraph, map } = require('./map')
const drawLights = require('./traffic-lights')
const { drawYellowCircle, drawTraffic, reset } = require('./tiles.js')


const collisionZone = () => {
  const arrayOfVerticesx = Object.keys(map.graphObj);
  for (let index = 0; index < arrayOfVerticesx.length; index++) {
    const vertex = map.graphObj[arrayOfVerticesx[index]]
    if (vertex.occupied) {
      drawYellowCircle(vertex.x + 25, vertex.y + 25, 35)
    }
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
      reset();
      drawMap();
      drawLights(counter, map, override);
      counter++;
      if (counter === limit) counter = 0;


      /////////collision zone visualiser
      if(collisionVis){
        collisionZone()
      }



      // /////////traffic visualiser
      const arrayOfVertices = Object.keys(map.graphObj);
      for (let index = 0; index < arrayOfVertices.length; index++) {

        const vertex = map.graphObj[arrayOfVertices[index]]
        vertex.occupiedCheck();
        drawTraffic(vertex.x, vertex.y, vertex.getAverageTime())
      }


      player.run();
      for (let i = 0; i < numberOfComputers; i++) {
        computerArray[i].run()
      }
    }

  }

  //////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



  const player = new Player('Player', map);
  let numberOfComputers = 5;
  let computerArray;
  const usedVertices = []
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
  generateComps(numberOfComputers)
  animate();

  $("canvas").on('click', function (e) {
    player.click = true;
    player.event = e;
  });
  $("#stop").on('click', function () {
    start = false;
  });
  $("#start").on('click', function () {
    start = true;
  });

  $("#lights-off").on('click', function () {
    override = true;
  });
  $("#lights-on").on('click', function () {
    override = false;
  });
  $("#collision-off").on('click', function () {
    collisionVis = false;
  });
  $("#collision-on").on('click', function () {
    collisionVis = true;
  });
  $(function () {
    $("#speed-slider").slider({
      value: 5,
      min: 1,
      max: 5,
      step: 4,
      slide: function (event, ui) {
        player.speed = ui.value;
      }
    });
  });
  $("#num-comps")
    .on('submit', function (e) {
      e.preventDefault();
      numberOfComputers = $('#num-comps-val').val();
      generateComps(numberOfComputers)
    })
})