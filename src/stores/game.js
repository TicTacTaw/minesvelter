import { writable } from 'svelte/store'
import board from './board'

const initialGame = {
  results: null,
  hasStarted: false,
  settings: {
    x: 8,
    y: 8,
    mines: 10,
  },
}

const game = writable(initialGame)

function updateResults(isWin) {
  game.update((value) => ({
    ...value,
    results: {
      isWin,
    },
  }))
}

function start() {
  game.update((value) => ({
    ...value,
    hasStarted: true,
  }))
}

function resetGame(newSettings = null) {
  game.update((value) => ({
    ...initialGame,
    settings: newSettings || value.settings,
  }))
  board.resetBoard()
}

export default {
  subscribe: game.subscribe,
  updateResults,
  start,
  resetGame,
}
