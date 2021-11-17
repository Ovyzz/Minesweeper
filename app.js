const columns = 8;
const lines = 8;
const bombs = 10;
const grid = document.getElementById("grid");
let flag = bombs;
generateBoard();

function generateBoard() {
    grid.innerHTML = "";
    document.getElementById("minesleft").innerText = bombs;
    for (let i = 0; i < lines; ++i) {
       let line = grid.insertRow(i);
        for (let j = 0; j < columns; ++j) {
            let  element = line.insertCell(j);
            grid.rows[i].cells[j].setAttribute("mine", "false");
            grid.rows[i].cells[j].setAttribute("flag", "false");
            grid.rows[i].cells[j].onclick = function(){ visibleElement(this);}
            grid.rows[i].cells[j].addEventListener('contextmenu', function(ev) {
                if (grid.rows[i].cells[j].getAttribute("flag") === "false" && flag > 0) {
                    element.className = "flag";
                    grid.rows[i].cells[j].setAttribute("flag", "true");
                    --flag;
                    document.getElementById("minesleft").innerText = flag;
                } else if (grid.rows[i].cells[j].getAttribute("flag") === "true" && flag > 0) {
                    grid.rows[i].cells[j].setAttribute("flag", "false");
                    grid.rows[i].cells[j].classList.remove("flag");
                    ++flag;
                    document.getElementById("minesleft").innerText = flag;
                }
                ev.preventDefault();
                return false;
            }, false);
        }
    }
    generateBombs();
}

function generateBombs() {
    for (let i = 0; i < bombs; ++i) {
        let randomLine = Math.floor(Math.random() * lines);
        let randomColumn = Math.floor(Math.random() * columns);
        grid.rows[randomLine].cells[randomColumn].setAttribute("mine", "true");
    }
}

function checkWinner() {
    let check = 1;
    for (let i = 0; i < lines; ++i) {
        for (let j = 0; j < columns; ++j) {
            if (grid.rows[i].cells[j].getAttribute("mine") === "false" && grid.rows[i].cells[j].innerText === "") {
                check = 0;
            }
        }
    }
    if (check === 1) {
        displayMessage("winner");
    }
}

function visibleElement(element) {
    if (element.getAttribute("mine") === "true") {
        for (let i = 0; i < lines; ++i) {
            for (let j = 0; j < columns; ++j) {
                if (grid.rows[i].cells[j].getAttribute("mine") === "true") {
                    grid.rows[i].cells[j].className = "mine";
                }
            }
        }
        document.getElementById("grid").style.pointerEvents = 'none';
        displayMessage("lostgame");
    } else {
        if (element.getAttribute("flag") === "true") {
            ++flag;
            document.getElementById("minesleft").innerText = flag;
        }
        element.className = "clicked";
        let isBomb = 0;
        let indexL = element.parentNode.rowIndex;
        let indexC = element.cellIndex;
        for (let i = Math.max(indexL - 1, 0); i <= Math.min(indexL + 1, lines - 1); i++) {
            for (let j = Math.max(indexC - 1, 0); j <= Math.min(indexC + 1, columns - 1); j++) {
                if (grid.rows[i].cells[j].getAttribute("mine") === "true") {
                    isBomb++;
                }
            }
        }
        element.innerHTML = isBomb;
        if (isBomb === 0) {
            for (let i = Math.max(indexL - 1, 0); i <= Math.min(indexL + 1, lines - 1); i++) {
                for (let j = Math.max(indexC - 1, 0); j <= Math.min(indexC + 1, columns - 1); j++) {
                    if (grid.rows[i].cells[j].innerHTML === "") {
                        visibleElement(grid.rows[i].cells[j]);
                    }
                }
            }
        }
    }
    checkWinner();
}

function displayMessage(messageType) {
    if (messageType === "winner") {
        document.getElementById("alert").innerHTML = '<li class="list-group-item list-group-item-success">You won!</li>';
        return false;
    } else if (messageType === "lostgame") {
        document.getElementById("alert").innerHTML = '<li class="list-group-item list-group-item-danger">You lose!!</li>';
        return false;
    }
}
