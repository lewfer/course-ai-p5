/*
 Code to handle the drawing of the UI
 */

// Represent the current state of the program
let mode // will be "Training", "Solving" or null
let stepping = false
let currentState
let previousState
let actionPath = []

// Dimensions for drawing
let gridWidth = 400
let gridHeight = gridWidth
let headerHeight = 40
let footerHeight = 40

// Episode number for training
let episode
let numEpisodes = 1
let totalTrainedEpisodes = 0

let message = ""

// Setup 
function setupMazeUI() {
    // Create the canvas to accommodate the maze and matrices
    createCanvas(gridWidth * 3, gridHeight + headerHeight + footerHeight);

    textAlign(CENTER, CENTER)

    // Create buttons
    createButtons()
    step()          // set default
}

// Draw loop
function drawMazeUI() {
    // Draw header messages
    textSize(20)
    text("Reinforcement Learning", gridWidth / 2, 40 / 2)
    text("R matrix", gridWidth + gridWidth / 2, 40 / 2)
    text("Q matrix", gridWidth * 2 + gridWidth / 2, 40 / 2)

    // Draw the maze
    drawMaze(maze, 0, headerHeight)

    // Handle mode-specific code to be exectuted on each draw step
    if (mode == "Training") {
        // We are training
        if (episode < numEpisodes) {
            if (currentState == null) {
                // Start the next training episode
                print("Starting train episode ", totalTrainedEpisodes)
                currentState = agent.trainStart()
                actionPath = []
                actionPath.push(currentState)
                previousState = null
                episode++
                totalTrainedEpisodes++
            }
            else if (!stepping)
                // Continue training episode
                doTrainStep()
        }
        else {
            // We've completed all the required episodes
            mode = null // stop training
            episode = null
        }
    }
    else if (mode == "Solving") {
        // We are solving
        if (currentState != null && !stepping) {
            // Continue solving
            doRunStep()
        }
    }

    // Draw the matrices
    drawMatrix(agent.R, gridWidth, headerHeight, episode != null)
    drawMatrix(agent.Q, gridWidth * 2, headerHeight, true)

    // Draw footer messages
    let t
    if (mode == "Training") {
        t = "Training episode " + totalTrainedEpisodes.toString()
    }
    else if (mode == "Solving") {
        t = "Solving"
    }
    else {
        t = "Trained " + totalTrainedEpisodes + " episodes. Click on a room to solve the maze."
    }
    if (mode != null && currentState != null) {
        if (currentState.action == null)
            t += ": start at " + currentState.state
        else
            t += ": move from  " + previousState.state + " to " + currentState.state
    }
    push()
    textAlign(LEFT, CENTER)
    if (mode==null)
        text(message, 20, height - footerHeight/2)
    else
        text(mode, 20, height - footerHeight/2)
    text(t, gridWidth+20, height - footerHeight/2)
    pop()

    showHideButtons()
}


// Run the next step of the training
function doTrainStep() {
    previousState = currentState
    currentState = agent.trainStep()
    if (currentState != null) {
        actionPath.push(currentState)
        //print(actionPath)   
    } 
    else {
        message = "Trained in " + (actionPath.length-1) + " steps"
    }
}

// Run the next step of the solving
function doRunStep() {
    print("Stepping")
    previousState = currentState
    currentState = agent.runStep()
    if (currentState != null) {
        actionPath.push(currentState)
        //print(actionPath)
    }
    else {
        mode = null
        message = "Solved in " + (actionPath.length-1) + " steps"
    }
}

// Draw the maze
function drawMaze(maze, x, y) {
    // Compute the parameters of the maze
    let cols = maze.rooms.length
    let rows = maze.rooms[0].length
    let cellWidth = gridWidth / cols
    let cellHeight = gridHeight / rows

    // Save the drawing state and relocate the origin
    push()
    translate(x, y)

    // Background colour for maze
    fill("LightSeaGreen")
    rect(0, 0, gridWidth, gridHeight)

    // Draw the cells of the maze
    fill(0)
    for (let r = 0; r < rows; r++) {
        let row = maze.rooms[r]
        //print(row)
        for (let c = 0; c < cols; c++) {
            room = row[c]

            // Draw the room number, highighting the current room if playing a path
            noStroke()
            if (mode != null && currentState != null && currentState.state == room)
                textSize(32)
            else
                textSize(12)
            text(room, cellWidth * c + cellWidth / 2, cellHeight * r + cellHeight / 2)

            // Draw the room boundaries
            stroke(0)
            strokeWeight(5)

            // Vertical lines.  Move from left to right.  Only draw a line if we change rooms
            if (c == 0 || room != row[c - 1])
                line(c * cellWidth, r * cellHeight, c * cellWidth, (r + 1) * cellHeight)  // first col or we have changed rooms
            if (c == cols - 1)
                line((c + 1) * cellWidth, r * cellHeight, (c + 1) * cellWidth, (r + 1) * cellHeight) // end of last col - always drawn

            // Horizontal lines.  Move from top to bottom.  Only draw a line if we change rooms
            if (r == 0 || room != maze.rooms[r - 1][c])
                line(c * cellWidth, r * cellHeight, (c + 1) * cellWidth, r * cellHeight) // first row or we have changed rooms
            if (r == rows - 1)
                line(c * cellWidth, (r + 1) * cellHeight, (c + 1) * cellWidth, (r + 1) * cellHeight) // end of last row - always drawn
        }
    }

    stroke("LightSeaGreen")
    strokeWeight(7)

    // Draw doors on the rows (vertical lines)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze.doorsRows[r][c] == 1)
                line(cellHeight * c + cellHeight, cellWidth * r + cellWidth / 4, cellHeight * c + cellHeight, cellWidth * r + cellWidth * 3 / 4)
        }
    }

    // Draw doors on the columns (horizontal lines)
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
            if (maze.doorsCols2[r][c] == 1)
                line(cellWidth * c + cellWidth / 4, cellHeight * r + cellHeight, cellWidth * c + cellWidth * 3 / 4, cellHeight * r + cellHeight)
        }
    }

    // Restore drawing state
    pop()
}

// Draw a matrix (r or q)
// Note this code assumes there is only one action
function drawMatrix(m, x, y, doPlayPath) {
    // Compute parameters for drawing
    let header = 30
    let matrix = m.matrix
    let cols = matrix.length
    let rows = matrix[0][0].length
    let cellWidth = (gridWidth - header) / cols
    let cellHeight = (gridHeight - header) / rows

    // Save the drawing state and relocate the origin
    push()
    translate(x + header, y + header)

    // Draw states for the header columns and rows
    for (let r = 0; r < rows; r++) {
        text(r, -header / 2, cellHeight * r + cellHeight / 2)
    }
    for (let c = 0; c < cols; c++) {
        text(c, cellWidth * c + cellWidth / 2, -header / 2)
    }

    // Draw values in the matrix
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < rows; c++) {
            // Get value
            let value = Math.round(matrix[r][0][c]*10)/10

            // Draw cell with colour intensity proportional to value
            fill(map(value, 0, 100, 0, 255), 0, 0)
            rect(c * cellWidth, r * cellHeight, cellWidth, cellHeight)

            // Draw the value
            fill(255)
            text(value, cellWidth * c + cellWidth / 2, cellHeight * r + cellHeight / 2)
        }
    }

    // Highight the cell in the matrix if playing a path
    if (currentState != null) {
        noFill()
        strokeWeight(5)
        stroke(255)
        if (previousState != null) {
            let c = currentState.state
            let r = previousState.state
            rect(c * cellWidth, r * cellHeight, cellWidth, cellHeight)
        }
    }

    // Restore drawing state
    pop()
}

// Create the buttons
function createButtons() {
    let x = 0
    buttonTrain = createButton("Train")
    buttonTrain.position(x, height);
    buttonTrain.mousePressed(train);
    x += buttonTrain.width

    x += 20
    buttonStep = createButton('Step');
    buttonStep.position(x, height);
    buttonStep.mousePressed(step);
    buttonStep.style('background-color', color(255, 200, 200));
    x += buttonStep.width

    buttonL = createButton('Slow');
    buttonL.position(x, height);
    buttonL.mousePressed(speedL);
    x += buttonL.width

    buttonM = createButton('Medium');
    buttonM.position(x, height);
    buttonM.mousePressed(speedM);
    x += buttonM.width

    buttonH = createButton('Fast');
    buttonH.position(x, height);
    buttonH.mousePressed(speedH);
    x += buttonH.width

    x += 20
    buttonPlay = createButton('   >   ');
    buttonPlay.position(x, height);
    buttonPlay.mousePressed(play);
    x += buttonPlay.width
    buttonPlay.hide()
}

// Reset buttons to gray
function clearButtons() {
    buttonStep.style('background-color', color(220, 220, 220));
    buttonL.style('background-color', color(220, 220, 220));
    buttonM.style('background-color', color(220, 220, 220));
    buttonH.style('background-color', color(220, 220, 220));
}

// Show or hide buttons based on program status
function showHideButtons() {
    if (stepping && mode != null && currentState != null) {
        buttonPlay.show()
    }
    else {
        buttonPlay.hide()
    }
    if (mode==null)
        buttonTrain.show()
    else
        buttonTrain.hide()
}

// Train button handler
function train() {
    episode = 0
    mode = "Training"
}

// Play button handler
function play() {
    if (mode == "Training")
        doTrainStep()
    else if (mode == "Solving")
        doRunStep()
}

// Step button handler
function step() {
    frameRate(20)
    clearButtons()
    buttonStep.style('background-color', color(255, 200, 200));

    stepping = true
}

// Slow button handler
function speedL() {
    frameRate(1)
    clearButtons()
    buttonL.style('background-color', color(255, 200, 200));
    stepping = false
}

// Medium button handler
function speedM() {
    frameRate(10)
    clearButtons()
    buttonM.style('background-color', color(255, 200, 200));
    stepping = false
}

// Fast button handler
function speedH() {
    frameRate(40)
    clearButtons()
    buttonH.style('background-color', color(255, 200, 200));
    stepping = false
}

// Handle click event in the maze
function doMazeClick() {
    if (mouseX < gridWidth && mouseY > headerHeight && mouseY < gridHeight + headerHeight) {
        if (mode == null) {
            print("Clicked")
            mode = "Solving"
            // Find which cell was clicked on and solve the maze
            let cell = findClickedCell(mouseX-0, mouseY-headerHeight)
            print("Solving maze from cell ", cell)
            actionPath = []
            currentState = agent.runStart(start_state = cell)
            actionPath.push(currentState)
        }
    }
}

// Find and return the cell number (state) at x,y
function findClickedCell(x, y) {
    // Compute cell that was clicked
    let cols = maze.rooms.length
    let rows = maze.rooms[0].length
    let cellWidth = gridWidth / cols
    let cellHeight = gridHeight / rows

    let c = Math.floor(x / cellWidth)
    let r = Math.floor(y / cellHeight)

    let cell = maze.rooms[r][c]
    return cell
}
