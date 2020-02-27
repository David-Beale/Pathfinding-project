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
      reset();
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
      for (let i = 0; i < numberOfComputers; i++) {
        computerArray[i].run()
      }
    }

  }

  //////////////////////////////////////////////////////////////////*END*  ANIMATION////////////////////////////////////////////////////////////////



  let player = new Player('Player', map);
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
  let trafficVis = false
  let compareClick = false;
  let compareClickCount = 0;
  generateComps(numberOfComputers)
  animate();

  $("canvas").on('click', function (e) {
    if (!compareClick) {
      player.click = true;
      player.event = e;
    }
    else if (compareClick && !compareClickCount) {
      // player.clickX = Math.floor((e.pageX / 50)) * 50 + player.radius
      // player.clickY = Math.floor((e.pageY / 50)) * 50 + player.radius
      // player.doPulseCircle();
      $('#text').html('Select a destination')
      compareClickCount = 1;
    }
    else if (compareClickCount === 1) {
      player.clickX = Math.floor((e.pageX / 50)) * 50 + player.radius
      player.clickY = Math.floor((e.pageY / 50)) * 50 + player.radius
      player.doPulseCircle();
      $('#text').html('Select a method')
      // compareClick = false;
      compareClickCount = 0;
    }
  });
  $("button").on('click', function () {
    $(this).toggleClass("selected")
    if ($(this).attr('id') === 'distance' && $(this).hasClass("selected") &&
      $('#time').hasClass("selected")) {
      $('#time').toggleClass("selected")
    }
    else if ($(this).attr('id') === 'time' && $(this).hasClass("selected")  &&
    $('#distance').hasClass("selected"))  {
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
  $("#distance").on('click', function () {
    player.pathfinding = 'dijkstra';
  });
  $("#time").on('click', function () {
    player.pathfinding = 'dijkstra-time';
  });
  $("#compare").on('click', function () {
    $("#distance-info").toggleClass("hidden");
    $("#text").toggleClass("hidden");
    $("#time-info").toggleClass("hidden");

    if (!$("#text").hasClass("hidden")) {
      if (!player.nextVertex && player.currentVertex) {
        player.currentVertex.occupiedFalse();
      } else if(player.nextVertex){
        player.nextVertex.occupiedFalse();
      }
      player = new Player('Player', map);
      $('#text').html('Select a start point')
      compareClick = true;
    } else {
      compareClick = false;
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
})