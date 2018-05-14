//http://jsfiddle.net/m1erickson/myHDW/

var currentPos = 0;

function animate() {  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');  
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);  
  ctx.fillRect(320, currentPos, 20, 20);
  currentPos += 1;
  if(currentPos >= canvas.clientHeight) {
    currentPos = 0;
  }
  requestAnimationFrame(animate);
}

document.body.onload = animate;


