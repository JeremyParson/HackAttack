let systemState = "play";

// keeps track of previous mouse position when drag distance is being calculated
let prevMouseX;
let prevMouseY;

// keeps track of mouse clicking and dragging state
let justClicked = false;
let isDragged = false;

let justPressed = false;

// sets canvas width and height
let canvasWidth = window.innerWidth * .96;
let canvasHeight = window.innerHeight * .94;

// sets canvas center
let canvasCenterX = Math.floor(canvasWidth / 2);
let canvasCenterY = Math.floor(canvasHeight / 2);

// Setup canvas
function setup() {
    createCanvas(canvasWidth,canvasHeight);
    background(0);
    rectMode(CENTER);
}

// Render images on the canvas
function draw() {
    
    // Clear canvas every frame so images can be redrawn
    background(0);
    
    if (systemState == "play") {
        // Runs kinematic system for game
        kinematicSystem();

        playerCameraSystem();

        if (keyIsPressed && (keyCode == 69 && !justPressed)) {
            justPressed = true;
            systemState = "edit";

        } else if (!keyIsPressed) {
            justPressed = false;

        }

    } else if (systemState == "edit") {
        // enables camera movement through camera dragging
        cameraMouseDrag();

        // draws grid on canvas
        drawGrid();

        if (keyIsPressed && (keyCode == 69 && !justPressed)) {
            justPressed = true;
            systemState = "play";

        } else if (!keyIsPressed) {
            justPressed = false;

        }
    }

    // Runs collision system for game
    collisionSystem();

    
   
}

// draws a grid on the canvas
function drawGrid () {
    let left = Math.floor((camera.position.x - ((canvasWidth / camera.zoom) / 2)));
    let right = Math.floor((camera.position.x + ((canvasWidth / camera.zoom) / 2)));

    let top = Math.floor((camera.position.y - ((canvasHeight / camera.zoom) / 2)));
    let bottom = Math.floor((camera.position.y + ((canvasHeight / camera.zoom) / 2)));
    
    push();
    stroke(255);
    for (let x = left; x < right; x++) {
        if (!(x % 50)) {
            line(x, top, x, bottom);
        }
    }

    for (let y = top; y < bottom; y++) {
        if (!(y % 50)) {
            line(left, y, right, y);
        }
    }

    pop();
}

// changes camera position when dragged
function cameraMouseDrag () {
    if(mouseIsPressed){
        let realX = mouseX + (camera.position.x - canvasWidth);
        let realY = mouseY + (camera.position.y - canvasHeight);

        if (!justClicked) {
            prevMouseX = realX;
            prevMouseY = realY;
        }
        
        justClicked = true;
        camera.position.x += (prevMouseX - realX);
        camera.position.y += (prevMouseY - realY);

    }else{
        justClicked = false;
    }

    isDragged = false;
}

// changes camera zoom when mouse wheel is scrolled
function mouseWheel (event) {
    if (systemState == "edit") {
        camera.zoom += camera.zoom >= .2 ? event.delta * .001 : 1;
    }
}

// changes state of mouseDrag variable when mouse is dragged
function mouseDragged () {
    isDragged = true;
}

// Linear interpolation function for smooth decay
function lerp (v0, v1, t) {
    return v0 * ( 1 - t ) + v1 * t;
}