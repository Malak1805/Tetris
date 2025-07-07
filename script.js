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
