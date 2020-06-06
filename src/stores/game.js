import { get, writable } from 'svelte/store'
import board from './board'
import timer from './timer'
import { saveHighScore, getScore } from '../helpers'

const initialGame = {
  results: null,
  hasStarted: false,
  bestScore: null,
  settings: {
    x: 8,
    y: 8,
    mines: 10,
    flagless: false,
  },
}

const game = writable(initialGame)

function updateResults(isWin) {
  timer.stop()
  game.update((value) => {
    if (isWin) {
      saveHighScore({ ...value.settings }, get(timer))
    }

    return {
      ...value,
      results: {
        isWin,
      },
      bestScore: getScore(value.settings),
    }
  })
}

function start() {
  timer.start()
  game.update((value) => ({
    ...value,
    hasStarted: true,
  }))
}

function resetGame(newSettings = null) {
  timer.stop()
  timer.reset()
  game.update((value) => {
    const settings = newSettings || value.settings
    return {
      ...initialGame,
      bestScore: getScore(settings),
      settings,
    }
  })
  board.resetBoard()
}

export default {
  subscribe: game.subscribe,
  updateResults,
  start,
  resetGame,
}
