import { writable } from 'svelte/store'
import board from './board'

const initialGame = {
  results: null,
  hasStarted: false,
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

function resetGame() {
  game.set(initialGame)
  board.resetBoard()
}

export default {
  subscribe: game.subscribe,
  updateResults,
  start,
  resetGame,
}
