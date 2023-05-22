// Noughts and Crosses with Minimax Algorithm
// Based on the original code by The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/154-tic-tac-toe-minimax.html
// https://youtu.be/I64-UTORVfU
// https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD

// Create a representation of the game state
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

let w; // = width / 3;
let h; // = height / 3;

let player1 = 'O';
let player2 = 'X';
let currentPlayer = player1;  // change for first player

// Start the game
function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
}

// Check if a, b and c are the same
function equals3(a, b, c) {
  return a == b && b == c && a != ' ';
}

// Check if there is a winning line or a tie situation
function checkWinner() {
  
  let winner = null;

  
  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
      print(i)
    }
  }

  // Horiztontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }
  
  // Check if we have any open spots on the grid
  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == ' ') {
        openSpots++;
      }
    }
  }

  // Determine if the game is over
  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }

}

// Handle mouse clicks
function mousePressed() {
  // Human make turn
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  
  // Only allow clicks when it's the human's turn
  if (currentPlayer == player1) {

    // If valid turn
    if (board[i][j] == ' ') {
      board[i][j] = player1;
      
      currentPlayer = player2
    }
  }  else if (currentPlayer == player2) {

    // If valid turn
    if (board[i][j] == ' ') {
      board[i][j] = player2;
      
      currentPlayer = player1
    }
  }
}

// Draw the game board
function draw() {
  background(255);
  strokeWeight(4);

  // Draw the grid
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  // Draw the Os and Xs currently played
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == player1) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == player2) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  // Keep checking if we have a winner
  let result = checkWinner();
  if (result != null) {
    // We have a winner, so stop looping and display the result
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
  }
}
