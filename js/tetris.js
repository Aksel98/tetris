const startModal = document.querySelector('.start-modal')
const endModal = document.querySelector('.end-modal')
const pauseIcon = document.querySelector('.pause-icon')
const settings = document.querySelector('.settings')
const main = document.getElementById('main')
const scoreId = document.getElementById('score')
const selectedLevel = document.getElementById('selected-level')
const figuresColor = ['#0055FF', '#FEFE34', '#00FF01', '#FF6801', '#00F1FC', '#B729A9', '#FE0A00']
let eachColor = Math.floor(Math.random() * figuresColor.length)
let columns = new Array(20).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map(el => [...el])
let figures = {
    1: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    2: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    3: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    4: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    5: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    6: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    7: [
        [1, 1],
        [1, 1],
    ],
}
let figure = {
    y: 0,
    x: 0,
    shape: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}
let intervalID;
let gameSpeed = 1000;
let startPlay = false

function startGame() {
    intervalID = setInterval(autoMoveFigure, gameSpeed);
    startModal.style.display = 'none'
    pauseIcon.style.display = 'block'
    figure.x = Math.floor((columns[0].length - figure.shape[0].length) / 2)
    createFigure()
    drawColumns()
    changeLevel()
    startPlay = true
}

function drawColumns() {
    let innerHtml = ''
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].length; j++) {
            if (columns[i][j] === 1) {
                innerHtml += '<div class="column figure"></div>'
            } else if (columns[i][j] === 2) {
                innerHtml += '<div class="column reached-figure"></div>'
            } else {
                innerHtml += '<div class="column"></div>'
            }
        }
    }
    main.innerHTML = innerHtml
    document.querySelectorAll('.figure').forEach(el => el.style.backgroundColor = figuresColor[eachColor])
}

function createFigure() {
    removePreviousColumnDraw()
    for (let i = 0; i < figure.shape.length; i++) {
        for (let j = 0; j < figure.shape[i].length; j++) {
            if (figure.shape[i][j] === 1)
                columns[figure.y + i][figure.x + j] = figure.shape[i][j]
        }
    }
}

function removePreviousColumnDraw() {
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].length; j++) {
            if (columns[i][j] === 1) {
                columns[i][j] = 0
            }
        }
    }
}

function keepFiguresInColumns() {
    for (let i = 0; i < figure.shape.length; i++) {
        for (let j = 0; j < figure.shape[i].length; j++) {
            if (figure.shape[i][j] && (columns[figure.y + i] === undefined ||
                columns[figure.y + i][figure.x + j] === undefined ||
                columns[figure.y + i][figure.x + j] === 2)) {
                return true
            }
        }
    }
    return false
}

function moveDown() {
    const figuresNums = '1234567'
    if (keepFiguresInColumns()) {
        figure.y -= 1
        reachedFigure()
        figure.shape = figures[figuresNums[Math.floor(Math.random() * Object.keys(figures).length)]]
        figure.x = Math.floor((columns[0].length - figure.shape[0].length) / 2)
        figure.y = 0
    }
}

function rotateFigure() {
    rotateFigure.previousShape = figure.shape
    figure.shape = figure.shape[0].map((el, i) => figure.shape.map(row => row[i]).reverse())
    if (keepFiguresInColumns()) {
        figure.shape = rotateFigure.previousShape
    }
}

function reachedFigure() {
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].length; j++) {
            if (columns[i][j] === 1) {
                columns[i][j] = 2;
            }
        }
    }
    eachColor = Math.floor(Math.random() * figuresColor.length);
    removeRaw()
}

function removeRaw() {
    let removeRawCount = 0
    for (let i = columns.length - 1; i >= 0; i--) {
        for (let j = 0; j < columns[i].length; j++) {
            if (columns[i].every(el => el === 2)) {
                removeRawCount++
                columns.splice(i, 1)
                columns.unshift(new Array(10).fill(0))
            }
        }
    }
    scoreId.value = removeRawCount > 0 ? +scoreId.value + (removeRawCount * (1100 - gameSpeed)) : scoreId.value
}

(function moveForwardToDown() {
    window.addEventListener("keydown", function (event) {
        if (!pauseIcon.classList.contains('start-icon')) {
            if (startPlay) {
                if (event.key === 'ArrowDown') {
                    figure.y += 1
                    scoreId.value = +scoreId.value + (11 - +selectedLevel.innerText.match(/\d+/)[0])
                    moveDown()
                } else if (event.key === 'ArrowLeft') {
                    figure.x -= 1
                    if (keepFiguresInColumns()) {
                        figure.x += 1
                    }
                } else if (event.key === 'ArrowRight') {
                    figure.x += 1
                    if (keepFiguresInColumns()) {
                        figure.x -= 1
                    }
                } else if (event.key === 'ArrowUp') {
                    rotateFigure()
                }
                createFigure()
                drawColumns()
            }
        }
    })
})()

function autoMoveFigure() {
    figure.y += 1
    moveDown()
    createFigure()
    drawColumns()
    endGame()
}

function endGame() {
    if (columns[1].includes(2) || columns[2].includes(2)) {
        figure.x = 0
        figure.y = 0
        endModal.style.display = 'block'
        pauseIcon.style.display = 'none'
        clearInterval(intervalID)
        columns = new Array(20).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map(el => [...el])
        drawColumns()
    }
}

function reStartGame() {
    columns = new Array(20).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map(el => [...el])
    figure.x = 0
    figure.y = 0
    drawColumns()
    startGame()
    endModal.style.display = 'none'
    pauseIcon.classList.remove('start-icon')
    scoreId.value = 0
}

function pauseGame() {
    pauseIcon.classList.toggle('start-icon')
    if (pauseIcon.classList.contains('start-icon')) {
        startModal.style.display = 'block'
        document.querySelector('.rePlay-icon').style.display = 'block'
        clearTimeout(intervalID)
    } else {
        intervalID = setInterval(autoMoveFigure, gameSpeed);
        startModal.style.display = 'none'
    }
    document.querySelector('.play-img').style.display = 'none'
}

changeLevel()

function changeLevel() {
    Array.from(settings.children).slice(1, settings.children.length).forEach((el, i) => {
        el.onclick = function () {
            gameSpeed = Number(this.innerText.match(/\d+/)[0] === '10' ? this.innerText.match(/\d/)[0] + '000' : this.innerText.match(/\d/)[0] + '00')
            selectedLevel.innerText = `Level ${this.innerText.match(/\d+/)[0]}`
        }
    })
}
