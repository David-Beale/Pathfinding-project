/* eslint-disable no-undef */

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.width = 1800;
// canvas.height = 1150;

const background = new Image();
background.src = "./Assets/FoilageGrass_1.jpg";
const c = canvas.getContext('2d');
const roadWorks = new Image();
roadWorks.src = "./Assets/roadworks.jpg";

const tiles = {
  drawCar: function (x, y, degrees, car) {
    c.save();
    c.translate(x + 25, y + 12.5);
    c.rotate(degrees * Math.PI / 180);
    c.drawImage(car, -25, -12.5, 50, 25);
    c.restore();
  },
  drawRoadWorks: function (x, y) {
    c.drawImage(roadWorks, x, y, 50, 50)
  },
  drawBackground: function () {
    for (let i = -1200; i <= 4200; i += 600) {
      for (let j = -1200; j <= 4200; j += 600) {
        c.drawImage(background, i, j, 600, 600)

      }
    }
  },
  reset: function (offsetX, offsetY, scale) {
    let x = (0 + offsetX) - 0.5 * canvas.width / scale;
    let y = (0 + offsetY) - 0.5 * canvas.height / scale;
    c.clearRect(x, y, 3 * canvas.width / scale, 3 * canvas.height / scale);
  },
  drawTraffic: function (x, y, average) {
    let color;
    if (average === 0) color = 'rgba(70, 240, 36, 0)'
    else if (average <= 15) color = 'rgba(70, 240, 36, 0.1)'
    else if (average <= 25) color = 'rgba(226, 240, 36, 0.3)'
    else color = 'rgba(240, 36, 36, 0.3)'
    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, 50, 50);
  },
  drawOutlineCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.strokeStyle = 'white';
    c.stroke();
  },
  drawCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'white'
    c.strokeStyle = 'white';
    c.stroke();
    c.fill()
  },
  drawRedCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'red'
    c.strokeStyle = 'red';
    c.stroke();
    c.fill()
  },
  drawYellowCircle: function (x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = 'rgba(191, 191, 63, 0.35)'
    c.strokeStyle = 'red';
    c.stroke();
    c.fill()
  },
  drawLine: function (x, y, targetx, targety, color) {
    c.beginPath();
    c.fillStyle = color;
    let margin = 0;
    if (color === 'yellow') {
      margin = 1.5;
    }
    let dx = targetx - x;
    let dy = targety - y
    if (dx === 0) {
      c.fillRect(x - 2.5 - margin / 2, y, 5 + margin, dy * 1.05);
    } else c.fillRect(x, y - 2.5 - margin / 2, dx * 1.05, 5 + margin);

  },
  XR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
  },
  lake: function (x, y) {
    c.beginPath();
    c.fillStyle = "rgb(246,215,176)";
    c.ellipse(x + 250, y + 50, 130, 320, Math.PI / 2, 0, 2 * Math.PI);
    c.fill()
    var thumbImg = document.createElement('img');
    thumbImg.src = './Assets/water.jpg';
    c.save();
    c.beginPath();
    c.ellipse(x + 250, y + 50, 120, 300, Math.PI / 2, 0, 2 * Math.PI);
    c.closePath();
    c.clip();

    c.drawImage(thumbImg, x - 100, y - 100, 700, 700);

    c.beginPath();
    c.ellipse(x, y, 120, 300, Math.PI / 2, 0, 2 * Math.PI);
    c.clip();
    c.closePath();
    c.restore();

  },
  HR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    for (let i = 1; i < 100; i += 98) {
      c.beginPath()
      c.moveTo(x, y + i);
      c.lineTo(x + 100, y + i);
      c.stroke();
    }
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
  },
  TB: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 50, y + 99);
    c.stroke();
  },
  TT: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + i, y + 50);
      c.lineTo(x + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
  },
  VR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    for (let i = 1; i < 100; i += 98) {
      c.beginPath()
      c.moveTo(x + i, y);
      c.lineTo(x + i, y + 100);
      c.stroke();
    }
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
  },
  TR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 99, y + 50);
    c.lineTo(x + 99, y + 100);
    c.stroke();
  },
  TL: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 5; i <= 100; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + i);
      c.lineTo(x + 50, y + i + 10);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 50);
    c.stroke();
  },
  TLC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  TRC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 1);
    c.lineTo(x + 100, y + 1);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 + i);
      c.lineTo(x + 50, y + 50 + i + 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 55);
    c.stroke();
  },
  BRC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 99, y);
    c.lineTo(x + 99, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 - i, y + 50);
      c.lineTo(x + 50 - i - 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 45, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  },
  BLC: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
    c.strokeStyle = 'yellow';
    c.beginPath()
    c.moveTo(x, y + 99);
    c.lineTo(x + 100, y + 99);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 1, y);
    c.lineTo(x + 1, y + 100);
    c.stroke();
    c.strokeStyle = 'white';
    for (let i = 15; i <= 40; i += 20) {
      c.beginPath()
      c.moveTo(x + 50, y + 50 - i);
      c.lineTo(x + 50, y + 50 - i - 10);
      c.stroke();
      c.beginPath()
      c.moveTo(x + 50 + i, y + 50);
      c.lineTo(x + 50 + i + 10, y + 50);
      c.stroke();
    }
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 55, y + 50);
    c.stroke();
    c.beginPath()
    c.moveTo(x + 50, y + 50);
    c.lineTo(x + 50, y + 45);
    c.stroke();
  },
  drawOneLight: function (x, y, counter, offset) {
    let color;
    let value = counter + offset;
    if (value <= 180) color = 'red';
    else if (value <= 200) color = 'yellow';
    else if (value <= 380) color = 'green';
    else if (value <= 400) color = 'yellow';
    else if (value <= 580) color = 'red';
    else if (value <= 600) color = 'yellow';

    c.beginPath();
    c.arc(x, y, 5, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.strokeStyle = 'black';
    c.stroke();
    c.fill()
    return color;
  },
  TrLiU1: function (x, y, counter) {
    return tiles.drawOneLight(x + 8.5, y - 8.5, counter, 0)
  },
  TrLiL1: function (x, y, counter) {
    return tiles.drawOneLight(x - 8.5, y + 91.5, counter, 0)
  },
  TrLiR1: function (x, y, counter) {
    return tiles.drawOneLight(x + 108.5, y + 8.5, counter, 0)
  },
  TrLiD1: function (x, y, counter) {
    return tiles.drawOneLight(x + 91.5, y + 108.5, counter, 0)
  },
  TrLiU2: function (x, y, counter) {
    return tiles.drawOneLight(x + 8.5, y - 8.5, counter, 200)
  },
  TrLiL2: function (x, y, counter) {
    return tiles.drawOneLight(x - 8.5, y + 91.5, counter, 200)
  },
  TrLiR2: function (x, y, counter) {
    return tiles.drawOneLight(x + 108.5, y + 8.5, counter, 200)
  },
  TrLiD2: function (x, y, counter) {
    return tiles.drawOneLight(x + 91.5, y + 108.5, counter, 200)
  },
  width: canvas.width,
  height: canvas.height,
  c: c,
  cameraX: 0,
  cameraY: 0,
  cameraLock: false,
  translate: function (x, y) {
    c.translate(x, y);
  },
  cameraScale: 1,

}
$(() => {
  //camera centers on vehicle
  $("#lock").on('click', function () {
    const player = require('./main')

    tiles.cameraLock = !tiles.cameraLock;
    if (tiles.cameraLock) {
      let diffX = (((canvas.width) / (2 * tiles.cameraScale)) - (player.currentX - tiles.cameraX / tiles.cameraScale))
      let diffY = (((canvas.height) / (2 * tiles.cameraScale)) - (player.currentY - tiles.cameraY / tiles.cameraScale))

      c.translate(diffX, diffY);
      tiles.cameraX -= diffX * tiles.cameraScale;
      tiles.cameraY -= diffY * tiles.cameraScale;
      tiles.reset(tiles.cameraX, tiles.cameraY)
    }
  });


  let dragging = false;
  let prevX;
  let prevY;
  //move map around
  $('canvas').mousedown(function (e) {
    if (e.which === 1) {
      prevX = e.pageX;
      prevY = e.pageY;
      dragging = true;
    }

  })
  $('html').mousemove(function (e) {
    if (dragging === true) {
      let diffX = (e.pageX - prevX) / tiles.cameraScale;
      let diffY = (e.pageY - prevY) / tiles.cameraScale;
      prevX = e.pageX
      prevY = e.pageY
      tiles.cameraX -= diffX * tiles.cameraScale;
      tiles.cameraY -= diffY * tiles.cameraScale;
      c.translate(diffX, diffY);
      tiles.reset(tiles.cameraX, tiles.cameraY)
    }
  })
    .mouseup(function () {
      dragging = false
    })

    //zoom in and out
  $('canvas').bind('mousewheel', function (e) {
    if (e.originalEvent.wheelDelta / 120 > 0) {
      c.scale(1.25, 1.25)

      tiles.cameraScale *= 1.25
      let cameraDiff = 0.25;

      let diffX = -(((tiles.cameraX + e.pageX) * (cameraDiff)) / tiles.cameraScale)
      let diffY = -(((tiles.cameraY + e.pageY) * (cameraDiff)) / tiles.cameraScale)
      c.translate(diffX, diffY);
      tiles.cameraX -= diffX * tiles.cameraScale;
      tiles.cameraY -= diffY * tiles.cameraScale;
      tiles.reset(tiles.cameraX, tiles.cameraY)
    }
    else {
      c.scale(0.8, 0.8)
      tiles.cameraScale *= 0.8;
      let cameraDiff = 0.2
      let diffX = (((tiles.cameraX + e.pageX) * (cameraDiff)) / tiles.cameraScale)
      let diffY = (((tiles.cameraY + e.pageY) * (cameraDiff)) / tiles.cameraScale)
      c.translate(diffX, diffY);
      tiles.cameraX -= diffX * tiles.cameraScale;
      tiles.cameraY -= diffY * tiles.cameraScale;
      tiles.reset(tiles.cameraX, tiles.cameraY)
    }
  });
})


module.exports = tiles;