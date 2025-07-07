const GRID_WIDTH = 12
const GRID_HEIGHT = 18
const playArea = document.querySelector('.game-box')
const gameOverOverlay = document.querySelector('.game-over')
const scoreDisplay = document.querySelector('.score-box')
const nextPieceDisplay = document.querySelector('.next-box')
const pauseOverlay = document.querySelector('.paused-box')
const INITIAL_SPEED = 25

let board = []
let pieces = []
let colors = [
  'rgb(255, 0, 0)',
  'rgb(0, 100, 250)',
  'rgb(7, 82, 37)',
  'rgb(255, 100, 0)',
  'rgb(255, 0, 255)',
  'rgb(124, 8, 128)',
  'rgb(220, 220, 0)',
  'rgba(225, 225, 225, .7)',
  'rgb(150, 150, 150)',
  'rgb(0, 0, 0)'
]

let currentPieceIndex = Math.floor(Math.random() * 7)
let nextPieceIndex = Math.floor(Math.random() * 7)
let piecePosX = Math.floor(GRID_WIDTH / 2)
let piecePosY = 0
let pieceRotation = 0
let keyIsHeld = false
let canTick = false
let currentSpeed = INITIAL_SPEED
let tickCounter = 0
let completedLines = []
let totalLinesCleared = 0
let isGameOver = false
let playerScore = 0
let isGamePaused = false

pieces[0] = '..X...X...X...X.'
pieces[1] = '..X..XX...X.....'
pieces[2] = '.....XX..XX.....'
pieces[3] = '..X..XX..X......'
pieces[4] = '.X...XX...X.....'
pieces[5] = '.X...X...XX.....'
pieces[6] = '..X...X..XX.....'

initializeBoard()
createBoardCells()
startGameLoop()

async function startGameLoop() {
  if (!isGameOver && !isGamePaused) {
    renderBoard()
    renderCurrentPiece()
    await delay(50)
    canTick = false
    tickCounter++

    if (tickCounter === currentSpeed) {
      tickCounter = 0

      if (
        canPlacePiece(
          currentPieceIndex,
          piecePosX,
          piecePosY + 1,
          pieceRotation
        )
      ) {
        piecePosY++
      } else {
        // Fix piece on board
        for (let px = 0; px < 4; px++) {
          for (let py = 0; py < 4; py++) {
            if (
              pieces[currentPieceIndex][rotate(px, py, pieceRotation)] === 'X'
            ) {
              board[(piecePosY + py) * GRID_WIDTH + (piecePosX + px)] =
                currentPieceIndex
            }
          }
        }

        playerScore += 5
        scoreDisplay.textContent = `SCORE: ${playerScore}`

        // Check for completed lines
        for (let py = 0; py < 4; py++) {
          if (piecePosY + py < GRID_HEIGHT - 1) {
            let lineComplete = true
            for (let px = 1; px < GRID_WIDTH - 1; px++) {
              lineComplete &= board[(piecePosY + py) * GRID_WIDTH + px] !== 7
            }
            if (lineComplete) {
              for (let px = 1; px < GRID_WIDTH - 1; px++) {
                board[(piecePosY + py) * GRID_WIDTH + px] = 9
                playArea.children[
                  (piecePosY + py) * GRID_WIDTH + px
                ].classList.add('remove')
              }
              completedLines.push(piecePosY + py)
              totalLinesCleared++
            }
          }
        }

        if (completedLines.length) {
          let bonus = 0.2 * completedLines.length
          playerScore += completedLines.length * 50 * (1 + bonus)
          scoreDisplay.textContent = `SCORE: ${playerScore}`
          renderBoard()
          await delay(250)

          // Remove animation class
          completedLines.forEach((line) => {
            for (let px = 1; px < GRID_WIDTH - 1; px++) {
              for (let py = line; py > 0; py--) {
                playArea.children[py * GRID_WIDTH + px].classList.remove(
                  'remove'
                )
              }
            }
          })
          await delay(250)

          // Shift lines down
          completedLines.forEach((line) => {
            for (let px = 1; px < GRID_WIDTH - 1; px++) {
              for (let py = line; py > 0; py--) {
                board[py * GRID_WIDTH + px] = board[(py - 1) * GRID_WIDTH + px]
                board[px] = 7
              }
            }
          })

          completedLines = []
        }

        // Set next piece
        currentPieceIndex = nextPieceIndex
        nextPieceIndex = Math.floor(Math.random() * 7)
        piecePosX = Math.floor(GRID_WIDTH / 2)
        piecePosY = 0
        pieceRotation = 0
        renderNextPiece()

        if (
          !canPlacePiece(currentPieceIndex, piecePosX, piecePosY, pieceRotation)
        ) {
          isGameOver = true
          renderCurrentPiece()
        }
      }
    }

    // Speed up every 10 lines
    if (totalLinesCleared > 0 && totalLinesCleared % 10 === 0) {
      currentSpeed -= 3
      if (currentSpeed <= 0) currentSpeed = 1
      totalLinesCleared = 0
    }

    startGameLoop()
  } else if (isGameOver) {
    gameOverOverlay.classList.add('show')
  }
}

function rotate(x, y, rotation) {
  switch (rotation % 4) {
    case 0:
      return y * 4 + x
    case 1:
      return 12 + y - x * 4
    case 2:
      return 15 - y * 4 - x
    case 3:
      return 3 - y + x * 4
  }
}

function initializeBoard() {
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      board[y * GRID_WIDTH + x] =
        x === 0 || x === GRID_WIDTH - 1 || y === GRID_HEIGHT - 1 ? 8 : 7
    }
  }
}

function createBoardCells() {
  const cellSize = `${95 / GRID_HEIGHT}vmin`
  playArea.style.gridTemplateColumns = `0px repeat(${
    GRID_WIDTH - 2
  }, ${cellSize}) 0px`
  playArea.style.gridTemplateRows = `repeat(${
    GRID_HEIGHT - 1
  }, ${cellSize}) 0px`

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let cell = document.createElement('div')
      cell.style.width = cell.style.height = cellSize
      playArea.appendChild(cell)
    }
  }

  nextPieceDisplay.style.gridTemplateColumns = `repeat(4, ${
    50 / GRID_HEIGHT
  }vmin)`
  nextPieceDisplay.style.gridTemplateRows = `repeat(4, ${50 / GRID_HEIGHT}vmin)`

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      let cell = document.createElement('div')
      cell.style.width = cell.style.height = `${50 / GRID_HEIGHT}vmin`
      nextPieceDisplay.appendChild(cell)
    }
  }

  scoreDisplay.textContent = `SCORE: ${playerScore}`
  renderNextPiece()
}

function renderBoard() {
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let cell = playArea.children[y * GRID_WIDTH + x]

      if (x === 0 || x === GRID_WIDTH - 1 || y === GRID_HEIGHT - 1) {
        cell.style.width = '0px'
        cell.style.height = '0px'
      } else {
        cell.style.backgroundColor = colors[board[y * GRID_WIDTH + x]]
        if (board[y * GRID_WIDTH + x] !== 7) {
          cell.classList.add('piece')
        } else {
          cell.classList.remove('piece')
        }
      }
    }
  }
}

function renderCurrentPiece() {
  for (let px = 0; px < 4; px++) {
    for (let py = 0; py < 4; py++) {
      if (pieces[currentPieceIndex][rotate(px, py, pieceRotation)] === 'X') {
        let cell =
          playArea.children[(piecePosY + py) * GRID_WIDTH + (piecePosX + px)]
        cell.style.backgroundColor = colors[currentPieceIndex]
        cell.classList.add('piece')
      }
    }
  }
}

function renderNextPiece() {
  for (let px = 0; px < 4; px++) {
    for (let py = 0; py < 4; py++) {
      let cell = nextPieceDisplay.children[py * 4 + px]
      cell.style.backgroundColor = 'transparent'
      if (pieces[nextPieceIndex][4 * py + px] === 'X') {
        cell.style.backgroundColor = colors[nextPieceIndex]
      }
    }
  }
}
