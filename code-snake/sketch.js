// Llewelyn Fernandes
// Slightly modifed code and commented code from here:
//
// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA

// Set up some variables
let snake;           // the snake
let food;            // the food
let unitSize = 20;   // size of a block ('snake' units)
let w;               // the width of the screen in snake units
let h;               // the height of the screen in snake units
let foodColour = "chocolate"


let label = "waiting..."

// This function is called before the game starts
function preload() {
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/rha8jGD8e/model.json')  
}

// This function is called when the game starts
function setup() {
  // Create our game area
  createCanvas(640, 480);
  
  // Capture the video feed from the camera
  setupVideo()
  
  // Classify it
  classifyVideo()  
  
  // Compute the width and height of the game area in 'snake' units
  w = floor(width / unitSize);
  h = floor(height / unitSize);
  
  // Slow the game down
  frameRate(5);
  
  // Create the initial snake and food
  snake = new Snake();
  makeFood();
}

// This function is called when we have a classification
function videoClassified(result) {
  // Store the label
  label = result
  
  // Move the snake according to the classification
  controlSnake()
  
  // Classify the next video frame
  classifyVideo();  
}

// This function checks the classification of the image an moves the snake accordingly
function controlSnake() {
  if (label == 'left') {
    snake.setDir(-1, 0);
  } else if (label == 'right') {
    snake.setDir(1, 0);
  } else if (label == 'down') {
    snake.setDir(0, 1);
  } else if (label == 'up') {
    snake.setDir(0, -1);
  }
}


// This function is called when a key on the keyboard is pressed
// It moves the snake when the arrow keys are pressed
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  }
}


// This function is the draw loop.  It gets called over-and-over
function draw() {
  // Clear the background
  background("whitesmoke");
  
  // Show the video image
  image(video,0,0, 160, 120)
  filter(GRAY)
  tint(255, 128)
  
  // Show the classification label
  textSize(24)
  text(label, 10, 100)
  
  // Scale everything up so we can work in snake units
  scale(unitSize);
  
  // If we've eaten some food, create some new food
  if (snake.eat(food)) {
    makeFood();
  }
  
  // Update the position of the snake and draw it
  snake.update();
  snake.show();

  // If the game has ended, show a red screen
  /*
  if (snake.endGame()) {
    background("darkred");
    scale(1/unitSize)
    textSize(48)
    textAlign(CENTER, TOP)
    fill("white")
    text("Game Over", width/2, height/2)
    noLoop();
  }*/
  if (snake.endGame()) {
    snake.body[0] = createVector(floor(w/2), floor(h/2))
  }

  // Draw the food
  noStroke();
  fill(foodColour);
  rect(food.x, food.y, 1, 1);
}