/* eslint-disable no-undef */
const Player = require('./player-vehicle')
const Computer = require('./computer-vehicle')
const { drawMap, setUpGraph, map } = require('./map')
const drawLights = require('./traffic-lights')
const roadWorks = require('./road-works')
const { drawYellowCircle, drawTraffic, reset, drawBackground, lake } = require('./tiles.js')
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

const speedCheck = () => {
  const arrayOfVertices = Object.keys(map.graphObj);
  for (let i = 0; i < arrayOfVertices.length; i++) {
    let thisVertex = map.graphObj[arrayOfVertices[i]]
    if(thisVertex.value==='1A'){
      console.log(thisVertex.speed, thisVertex.counter)
    }
    if (thisVertex.speed) {
      thisVertex.counter++
      if (thisVertex.counter === 60) thisVertex.speed = null;
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
      if (tiles.cameraLock) {
        let diffX = (tiles.width / (2 * tiles.cameraScale)) - (player.currentX - tiles.cameraX / tiles.cameraScale);
        let diffY = (tiles.height / (2 * tiles.cameraScale)) - (player.currentY - tiles.cameraY / tiles.cameraScale);
        tiles.translate(diffX, diffY);
        tiles.cameraX -= diffX * tiles.cameraScale;
        tiles.cameraY -= diffY * tiles.cameraScale;
      }
      reset(tiles.cameraX, tiles.cameraY, tiles.cameraScale);
      drawBackground();
      drawMap();
      roadWorks()
      speedCheck();
      // lake(1200,800);
      drawLights(counter, map, override);
      counter++;
      if (counter === limit) counter = 0;


      /////////collision zone visualiser
      if (collisionVis) {
        collisionZone()
      }



      // /////////traffic visualiser

      const arrayOfVertices = Object.keys(map.graphObj);
      for (let index = 0; index < arrayOfVertices.length; index++) {

        const vertex = map.graphObj[arrayOfVertices[index]]
        vertex.occupiedCheck();
        if (trafficVis) {
          drawTraffic(vertex.x, vertex.y, vertex.getAverageTime())
        }
      }


      player.run();
      if (player.compare && compareClickCount === 2) {
        $('#distance-info').html(`Distance: ${player.comparePaths.distance.distance}<br> Time: ${Math.round((player.comparePaths.distance.time)/60)} s`)
        $('#time-info').html(`Distance: ${player.comparePaths.time.distance}<br> Time: ${Math.round((player.comparePaths.time.time)/60)} s`)
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
  let roadWorksAdd = false;
  let roadWorksRemove = false
  let compareClickCount = 0;
  generateComps(numberOfComputers)
  animate();
  let roadWorksMouseDown = false;
  $("canvas").mousedown(function (e) {
    if (e.which === 3 && !roadWorksAdd && !roadWorksRemove) {
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
    } else if (e.which === 3 && (roadWorksAdd || roadWorksRemove)) {
      roadWorksMouseDown = true
    }
  }).mousemove(function (e) {
    if (roadWorksMouseDown === true) {
      let xCoord = (e.pageX + tiles.cameraX) / tiles.cameraScale
      let yCoord = (e.pageY + tiles.cameraY) / tiles.cameraScale
      let clickX = Math.floor(xCoord / 50) * 50;
      let clickY = Math.floor(yCoord / 50) * 50;
      for (let i = 0; i < arrayOfVertices.length; i++) {
        let thisVertex = map.graphObj[arrayOfVertices[i]]
        if (thisVertex.x === clickX && thisVertex.y === clickY) {
          if (roadWorksAdd) {
            thisVertex.roadWorks = true;
          } else thisVertex.roadWorks = false
          i = arrayOfVertices.length //end loop when found
        }
      }
    }
  })
    .mouseup(function () {
      roadWorksMouseDown = false;
    })

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
  $("#tips").mouseenter(function () {
    $('#tips-box').removeClass('hidden');
  }).mouseleave(function () {
    $('#tips-box').addClass('hidden');
  })
  //Road Works buttons//
  $("#roadWorksOn").mouseenter(function () {
    $('#tips-box2').removeClass('hidden');
  }).mouseleave(function () {
    $('#tips-box2').addClass('hidden');
  })

  $("#roadWorksOff").mouseenter(function () {
    $('#tips-box2').removeClass('hidden');
  }).mouseleave(function () {
    $('#tips-box2').addClass('hidden');
  })

  $("#roadWorksOn").on('click', function () {
    $("#roadWorksOff").removeClass("selected")
    roadWorksAdd = !roadWorksAdd
    roadWorksRemove = false;
  })
  $("#roadWorksOff").on('click', function () {
    $("#roadWorksOn").removeClass("selected")
    roadWorksRemove = !roadWorksRemove
    roadWorksAdd = false;
  })

  //Options Menu//
  let menuClosed = true;
  $("#menu").on('click', function () {
    $('#menu').toggleClass('change');
    if (menuClosed) {
      $('#options2').slideDown('slow', () => {
        $('#options2buttons').fadeIn(400)
      })
      menuClosed = false;
    } else {
      $('#options2').slideUp('slow', () => {
        $('#options2buttons').hide();
      })
      menuClosed = true;
    }
  });

  $("#compare").on('click', function () {
    $("#distance-info").toggleClass("hidden");
    $("#text").toggleClass("hidden");
    $("#time-info").toggleClass("hidden");

    if (!$("#text").hasClass("hidden")) {
      player.compare = true;
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
      max: 8,
      step: 1,
      slide: function (event, ui) {
        player.speedChange(ui.value);
      }
    });
  });
  $(function () {
    $("#computer-speed-slider").slider({
      value: 5,
      min: 1,
      max: 10,
      step: 1,
      slide: function (event, ui) {
        for (let i = 0; i < numberOfComputers; i++) {
          computerArray[i].masterSpeed = ui.value;
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
