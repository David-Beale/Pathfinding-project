const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight;

class Camera {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.xOffset = 0 - this.x;
    this.yOffset = 0 - this.y;
  }
}
const cam = new Camera;

const c = canvas.getContext('2d');

function drawCircle (x, y, radius) {
  c.beginPath();
  c.arc(x - cam.x, y - cam.y, radius, 0, Math.PI * 2, false);
  c.fillStyle = 'white'
  c.strokeStyle = 'white';
  c.stroke();
  c.fill()
}
$(() => {
  function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(1000, 1000, 50)

    // setTimeout(() => {
    //   // console.log(cam.x,cam.y)
    // }, 1000); 

  }
  animate()


let dragging =false;
  $('canvas').mousedown(function (e) {
    // console.log('start',e.pageX, e.pageY)
    currentX=e.pageX;
    currentY=e.pageY;
    dragging = true;
  })
    .mousemove(function (e) {
      if(dragging===true){
        // console.log(e.pageX, e.pageY)
        let diffX = e.pageX-currentX
        let diffY = e.pageY-currentY;
        cam.x+=diffX;
        console.log(cam.x)
        cam.y+=diffY;
      } 
    })
    .mouseup(function (e) {
      // console.log('final',e.pageX, e.pageY)
      dragging=false
    });
  // const currentX = e.pageX
  // console.log(currentX)
})