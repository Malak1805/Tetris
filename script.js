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
