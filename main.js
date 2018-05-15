/**
 * Created by oleksiy.konkin on 5/15/2018.
 */
// get canvas related references
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var score = 0;
var intervalTimerGame = 0;
var intervalTimerRectangles = [];
var intervalTimerRectangle = 0;


function generateRectangle(aX, aY, aColor, aSpeed){
    return {
        x: aX,
        y: aY,
        width: 30,
        height: 30,
        fill: aColor,
        isDeleted: false,
        speed: aSpeed
    }
}

function updateCounter(aScore){
    document.getElementById("score").innerHTML=aScore;
}

function generateRandomPosition(){
    return Math.floor(Math.random() * (canvas.clientWidth - 30));
}

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor(){
    while(true) {
        if ((Math.random() * 0xFFFFFF << 0).toString(16) != 0xffff00){
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        }
    }
}

function scheduleRectangleForGeneration(){
       var n=0;
       n = setTimeout(function(){ rects.push( generateRectangle(generateRandomPosition(),
                                                    0,
                                                    generateRandomColor(),
                                                    generateRandomInt(1,10)));
                            draw();},
                            generateRandomInt(1,7)*1000);
       intervalTimerRectangles.push(n);
}

function moveRectanglesDown(){
    for (var i = 0; i < rects.length; i++) {
        rects[i].y += rects[i].speed;
    }
}

function stopScheduledRectangles(){
    for(var i = 0; i <= intervalTimerRectangles.length; i++){
        window.clearTimeout(intervalTimerRectangles[i]);
    }
    intervalTimerRectangles = [];
}

function clearAllRectangles(){
    rects = [];
}

// an array of objects that define different rectangles
var rects = [];

//var timersRect
var pos   = [];

function putInitialRectangles(){
    for (var n = 0; n <= generateRandomInt(1, 3); n++){
        rects.push(generateRectangle(generateRandomPosition(),
            generateRandomInt(0,100),
            generateRandomColor(),
            generateRandomInt(1,10)));
    }
    console.log(rects.length);
}

function initializeButtons(state){
    switch(state) {
        case "start":
            document.getElementById("start").disabled = true;
            document.getElementById("stop").disabled = false;
            break;
        case "stop":
            document.getElementById("start").disabled = false;
            document.getElementById("stop").disabled = true;
            break;
    }
}

// listen for mouse events
canvas.onmousedown = myDown;

// call to draw the scene
draw();

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();

    ctx.fillStyle = "yellow";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        ctx.fillStyle = r.fill;
        rect(r.x, r.y, r.width, r.height);
        pos[i]= ctx.save();
    }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
            ctx.clearRect(rects[i].x,rects[i].y,30,30);
            r.isDeleted = true;
         }
    }

    for (var i = 0; i < rects.length; i++) {
       if(rects[i].isDeleted == true) {
           rects.splice(i, 1);
           score+=1;
           updateCounter(score);
       }
    }

    startX = mx;
    startY = my;
}

function startGame(){
    putInitialRectangles();
    intervalTimerRectangle = setInterval(function(){scheduleRectangleForGeneration();},1000);
    intervalTimerGame = setInterval(function(){
            moveRectanglesDown();
            draw();}
        ,200);
    initializeButtons("start");
}

function stopGame(){
    updateCounter(0);
    window.clearInterval(intervalTimerRectangle);
    stopScheduledRectangles();
    clearAllRectangles();
    window.clearInterval(intervalTimerGame);
    draw();
    initializeButtons("stop");
}

window.onload = initializeButtons("stop");
