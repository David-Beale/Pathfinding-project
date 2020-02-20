const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');


module.exports = {
  XR: function (x, y) {
    c.fillStyle = 'rgb(55, 55, 55)';
    c.fillRect(x, y, 100, 100);
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
    c.moveTo(x , y+99);
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
    c.moveTo(x +50, y+1);
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
    c.moveTo(x + 99, y+50);
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
    c.moveTo(x +1, y);
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
  }
}

