var tRow = 50;
var tCell = 100;
var playing = false;
var grid = new Array(tRow);
var nextGrid = new Array(tRow);
var runtime = 400;
var timer;


function setup() {
    createGrid();
    resetGrid();
    drawTable();
    control();
}

function drawTable() {
    var container = document.getElementById('gridContainer');
    var table = document.createElement("table")

    for (var x = 0; x < tRow; x++) {
        var tr = document.createElement("tr");
        for (var y = 0; y < tCell; y++) {
            var td = document.createElement("td");
            td.setAttribute("id", x + "_" + y);
            td.setAttribute("class", "dead");
            td.onclick = changer;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

function createGrid() {
    for (var i = 0; i < tRow; i++) {
        grid[i] = new Array(tCell);
        nextGrid[i] = new Array(tCell);
    }
}

function resetGrid() {
    for (var i = 0; i < tRow; i++) {
        for (var o = 0; o < tCell; o++) {
            grid[i][o] = 0;
            nextGrid[i][o] = 0;
        }
    }
}

function changer() {
    var tds = this.getAttribute("class");
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];

    if (tds.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1
    }
}

function control() {
    var play = document.getElementById("start");
    var rand = document.getElementById('random');
    var clean = document.getElementById("clear");

    play.onclick = start;
    rand.onclick = randomStart;
    clean.onclick = clear;
}

function start() {

    if (playing) {
        this.innerHTML = "continue";
        playing = false;
        clearTimeout(timer);
    } else {
        this.innerHTML = "pause";
        playing = true;

        play();
    }
}

function randomStart(){
    //call updateView
    if (playing) return;
    clear();
    for (var i = 0; i < tRow; i++) {
        for (var j = 0; j < tCell; j++) {
            // var rStart = Math.random();
            grid[i][j] = Math.round(Math.random())
        }
    }
    computeNextGen();
}

function clear() {
    var cellsList = document.getElementsByClassName("live");
    var cells = [];
    var button = document.getElementById("start");

    button.innerHTML = "start";
    playing = false;

    for (var x = 0; x < cellsList.length; x++) {
        cells.push(cellsList[x]);
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }

    resetGrid();
}

function play() {
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, runtime);
    }
}

function computeNextGen() {
    for (var i = 0; i < tRow; i++) {
        for (var j = 0; j < tCell; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function applyRules(row, col) {
    var nNeighbors = countNb(row, col);
    if (grid[row][col] == 1) {
        if (nNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (nNeighbors == 2 || nNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (nNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (nNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

// Any live cell with fewer than two live neighbors dies, as if caused by under-population.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies, as if by overcrowding.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
// Exemple
// 0 0 0 0 0 0
// 0 1 0 0 0 0
// 0 0 0 0 0 0
// 0 0 0 0 0 0

function countNb(row, col) {
    var count = 0;

    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) {
            count++;
        }
    }

    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) {
            count++;
        }
    }

    if (row - 1 >= 0 && col + 1 < tCell) {
        if (grid[row - 1][col + 1] == 1) {
            count++;
        }
    }

    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) {
            count++;
        }
    }

    if (col + 1 < tCell) {
        if (grid[row][col + 1] == 1) {
            count++;
        }
    }

    if (row + 1 < tRow && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) {
            count++;
        }
    }

    if (row + 1 < tRow) {
        if (grid[row + 1][col] == 1) {
            count++;
        }
    }

    if (row + 1 < tRow && col + 1 < tCell) {
        if (grid[row + 1][col + 1] == 1) {
            count++;
        }
    }

    return count;
}

function copyAndResetGrid() {
    for (var i = 0; i < tRow; i++) {
        for (var j = 0; j < tCell; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (var i = 0; i < tRow; i++) {
        for (var j = 0; j < tCell; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}


window.onload = setup();
