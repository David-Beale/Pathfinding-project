const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight;

class Camera {
  constructor() {
    this.x = 100;
    this.y = 100;
  }
  getWidth() {
    return canvas.width + this.x
  }
  getHeight() {
    return canvas.width + this.x
  }
}
const cam = new Camera;

const c = canvas.getContext('2d');

function drawCircle (x, y, radius) {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  // c.arc(x - cam.x, y - cam.y, radius, 0, Math.PI * 2, false);
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
    drawCircle(1300, 900, 50)
    drawCircle(900, 500, 50)
    // c.translate(10, 0);
    // setTimeout(() => {
    //   // console.log(cam.x,cam.y)
    // }, 1000); 

  }
  animate()


let dragging =false;
  $('canvas').mousedown(function (e) {
    // console.log('start',e.pageX, e.pageY)
    prevX=e.pageX;
    prevY=e.pageY;
    dragging = true;
  })
    .mousemove(function (e) {
      if(dragging===true){
        // console.log(e.pageX, e.pageY)
        let diffX = e.pageX-prevX
        let diffY = e.pageY-prevY;
        prevX=e.pageX
        prevY=e.pageY
        cam.x-=diffX;
        cam.y-=diffY;
        c.translate(diffX, diffY);
      } 
    })
    .mouseup(function (e) {
      // console.log('final',e.pageX, e.pageY)
      dragging=false
    });
  // const currentX = e.pageX
  // console.log(currentX)
})