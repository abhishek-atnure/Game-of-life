
let rows = 38;
let cols = 70;

let playing = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
let reproductionTime = 100;

//create arrays
function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

// Initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}



// create the board table
function createTable() {
    let gridContainer = document.getElementById('gridContainer');
    let table = document.createElement("table");
    
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

// on click functionality to toggle cell
function cellClickHandler() {
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    console.log(rowcol)
    let classes = this.getAttribute("class");
    let allLives= document.getElementsByClassName('live');
    // user can enter max 100 cells
    if(allLives.length >cols-1){ 
    alert("user can not enter more than 100 live cells");
    return
    }
    // console.log("live",allLives)
    console.log(classes)
    if(classes === 'live') {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
    
}


// set classes live and dead according to 1 and 0 value
    function updateView() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }

    //button functionalities
function setupControlButtons() {
    // button to start
    let startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to clear
    let clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // button to set random initial state
    let randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

//generate random pattern
function randomButtonHandler() {
    
    if (playing) return;
    clearButtonHandler();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isLive = Math.round(Math.random());
            if (isLive === 1) {
                let cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

function findState(){
    let row=document.getElementById('row-input').value;
    let col=document.getElementById('col-input').value
    if(!row ) return;
    if(!col) return;

    let element= document.getElementById(row + "_" + col);
    let state=element.getAttribute('class');
    alert(state)
    
}

// document.getElementById('find-state').addEventListener('click',findState)

// clear the grid
function clearButtonHandler() {
    
    playing = false;
    let startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    let cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    let cells = [...cellsList];
    
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
}

// start/pause/continue the game
function startButtonHandler() {
    if (playing) {
        //Pause the game
        playing = false;
        document.getElementById('start').innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        //Continue the game
        playing = true;
        document.getElementById('start').innerHTML = "Pause";
        play();
    }
}

// run the life game
function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {//iterate through rows
        for (let j = 0; j < cols; j++) {//iterate through columns
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy current grid to next grid which will render next
    copyAndResetGrid();
    // sets class live where cell is 1
    updateView();
}

// RULES
//If a dead cell has exactly three live neighbours, it comes to life
//If a live cell has less than two live neighbours, it dies
//If a live cell has more than three live neighbours, it dies
//If a live cell has two or three live neighbours, it continues living

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }
    
function countNeighbors(row, col) {
    let count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] === 1) count++; //top center
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] === 1) count++; // top left
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] === 1) count++; //top right
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] === 1) count++; //middle left
    }
    if (col+1 < cols) {
        if (grid[row][col+1] === 1) count++; //middle right
    }
    if (row+1 < rows) {
        if (grid[row+1][col] === 1) count++; //bottom center
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] === 1) count++; //bottom left
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] === 1) count++; //bottom right
    }
    return count;
}

// Start everything on load
window.onload = initialize;
