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

/**
 * The function generates a single rectangle
 * @param aX
 * @param aY
 * @param aColor
 * @param aSpeed
 * @returns {{x: *, y: *, width: number, height: number, fill: *, isDeleted: boolean, speed: *}}
 */
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

/**
 * Function updates the counter with a desired value
 * @param aScore
 */
function updateCounter(aScore){
    document.getElementById("score").innerHTML=aScore;
}

/**
 * Helper fuction that generates a random position
 * @returns {number}
 */
function generateRandomPosition(){
    return Math.floor(Math.random() * (canvas.clientWidth - 30));
}

/**
 * The function gelerates a random integer in a given range
 * @param min
 * @param max
 * @returns {*}
 */
function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * The function generates a random color except a yellow one
 * to avoid a situation when a square has the same color as
 * a game background field
 * @returns {string}
 */
function generateRandomColor(){
    while(true) {
        if ((Math.random() * 0xFFFFFF << 0).toString(16) != 0xffff00){
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        }
    }
}

/**
 * The function schedules a generation of rectangle at a random moment
 */
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

/**
 * The function moves all rectangles in array down the game field
 */
function moveRectanglesDown(){
    for (var i = 0; i < rects.length; i++) {
        rects[i].y += rects[i].speed;
    }
}

/**
 * The fuction stops scheduling of the rectangles generation
 */
function stopScheduledRectangles(){
    for(var i = 0; i <= intervalTimerRectangles.length; i++){
        window.clearTimeout(intervalTimerRectangles[i]);
    }
    intervalTimerRectangles = [];
}

/**
 * The function removes all rectangles from the array that stores them
 */
function clearAllRectangles(){
    rects = [];
}

// an array of objects that define different rectangles
var rects = [];

//var timersRect
var pos   = [];

/**
 * The function populates the game filed with an arbitrary
 * number of rectangles
 */
function putInitialRectangles(){
    for (var n = 0; n <= generateRandomInt(1, 3); n++){
        rects.push(generateRectangle(generateRandomPosition(),
            generateRandomInt(0,100),
            generateRandomColor(),
            generateRandomInt(1,10)));
    }
}

/**
 * The function initializes start and stop buttons
 * to avoid a single button clicked twice
 * @param state
 */
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


/**
 * The fucntion draws a single rectangle
 * @param x
 * @param y
 * @param w
 * @param h
 */
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

/**
 * The function clears canvas
 */
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

/**
 * The fucntion redraws the game field
 */
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



/**
 * The function handles mousedown events
 * so that the clicked rectangle could be detected and removed
 * it also updates a counter and shows its value in browser
 * @param e
 */
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

/**
 * The fuction starts game
 */
function startGame(){
    putInitialRectangles();
    intervalTimerRectangle = setInterval(function(){scheduleRectangleForGeneration();},1000);
    intervalTimerGame = setInterval(function(){
            moveRectanglesDown();
            draw();}
        ,200);
    initializeButtons("start");
}

/**
 * The function stops game
 */
function stopGame(){
    updateCounter(0);
    window.clearInterval(intervalTimerRectangle);
    stopScheduledRectangles();
    clearAllRectangles();
    window.clearInterval(intervalTimerGame);
    draw();
    initializeButtons("stop");
}

/**
 * initialization of the buttons state on document load
 */
window.onload = initializeButtons("stop");
