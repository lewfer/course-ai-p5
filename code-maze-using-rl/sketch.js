/*
 Reinforcement Learning for a simple maze
 Illustrates building of R and Q matrix
 */

// Define the maze for drawing purposes
let maze = {rooms: [["3","3","3"],
                    ["4","5","2"],
                    ["0","0","1"]],
            doorsRows: [[0,0],
                        [1,1],
                        [0,1]],
            doorsCols2: [[1,0,1],
                        [0,0,1]]}

// R matrix - rows are from state, cols are to state, -1 means not allowed, 0 means allowed, 100 means reached goal
// We only have one action (move) for this maze
let rewards = [ 
  //#  ----------- Move ----------
  //#  to   to   to   to   to   to
  //#   0    1    2    3    4    5
      [[-1,   0,  -1,  -1,  -1,  -1]],  //# from 0
      [[ 0,  -1,   0,  -1,  -1,  -1]],  //# from 1
      [[-1,   0,  -1,   0,  -1, 100]],  //# from 2
      [[-1,  -1,   0,  -1,   0,  -1]],  //# from 3
      [[-1,  -1,  -1,   0,  -1, 100]],  //# from 4
      [[-1,  -1,   0,  -1,   0, 100]]   //# from 5
]    

// Which room in the maze to get to
let goalState = 5

// Agent which will do the learning
let agent

// Setup is called when the program starts
function setup() {
  setupMazeUI()

  // Create the R matrix
  let R = new Matrix(num_states=rewards.length, action_names=['M'])
  R.setMatrix(rewards)

  // Create a q-learning agent
  agent = new QAgent(R, goal_state=goalState)
}

// Draw is called repeatedly when setup finishes
function draw() {
  background(220);

  drawMazeUI()
}

// Handle mouse clicks
function mousePressed() {
  doMazeClick()
}

