// Tic Tac Toe AI with Minimax Algorithm
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/154-tic-tac-toe-minimax.html
// https://youtu.be/I64-UTORVfU
// https://editor.p5js.org/codingtrain/sketches/0zyUhZdJD

function bestMove() {
  print("COMPUTING MOVES FOR:");
  printPath([{ score: "", depth: "", board: board }]);
  print(" ");

  // AI to make its turn
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == " ") {
        board[i][j] = player2;
        let path = [];
        let score = minimax(board, 0, false, path);
        board[i][j] = " ";
        //print("try",i,j)
        path.push({ score: "try", depth: "", board: moveGrid(i, j) });
        printPath(path);
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
        print(" ");
      }
    }
  }
  print("----------------------------------------");
  board[move.i][move.j] = player2;
  currentPlayer = player1;
}

function moveGrid(ii, jj) {
  let tryBoard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (ii == i && jj == j) tryBoard[i][j] = "X";
      else tryBoard[i][j] = " ";
    }
  }
  return tryBoard;
}

function printPath(path) {
  /*
  for (let k =0; k<path.length; k++) {
    print(path[k].score, path[k].depth)
    let board = path[k].board
    for (let i = 0; i < 3; i++) {
      print(board[i][0],board[i][1],board[i][2])

    }
  }  */

  let s = "";
  for (let k = path.length - 1; k >= 0; k--) {
    s +=
      " " +
      path[k].score +
      " ".repeat(3 - path[k].score.toString().length) +
      "      "; //+ "," + path[k].depth + "|     "
  }
  print(s);

  for (let j = 0; j < 3; j++) {
    s = "";
    for (let k = path.length - 1; k >= 0; k--) {
      let board = path[k].board;
      s += "|" + board[0][j] + board[1][j] + board[2][j] + "|     ";
    }
    print(s);
  }
}

let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

function minimax(board, depth, isMaximizing, path) {
  let result = checkWinner();
  if (result !== null) {
    path.push({ score: scores[result], depth: depth, board: copy2D(board) });
    return scores[result];
  }

  let bestPath = []; //
  let bestScore;
  let bestBoard;
  if (isMaximizing) {
    bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == " ") {
          board[i][j] = player2;
          let newPath = []; //
          let score = minimax(board, depth + 1, false, newPath); //
          board[i][j] = " ";
          //bestScore = max(score, bestScore);
          if (score >= bestScore) {
            //
            bestScore = score;
            bestPath = newPath.slice(); //
            bestBoard = copy2D(board);
            //print("BP",bestPath)
          }
        }
      }
    }
  } else {
    bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == " ") {
          board[i][j] = player1;
          let newPath = []; //
          let score = minimax(board, depth + 1, true, newPath); //
          board[i][j] = " ";
          //bestScore = min(score, bestScore);
          if (score <= bestScore) {
            //
            bestScore = score;
            bestPath = newPath.slice(); //
            bestBoard = copy2D(board);
            //print("BP",bestPath)
          }
        }
      }
    }
  }
  //print(">",path, bestPath, bestScore)
  //path = path.concat(bestPath)
  for (let i = 0; i < bestPath.length; i++) path.push(bestPath[i]);
  path.push({ score: bestScore, depth: depth, board: bestBoard });
  //print(">>",path)
  return bestScore;
}

function copy2D(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) newArr[i] = arr[i].slice();
  return newArr;
}
