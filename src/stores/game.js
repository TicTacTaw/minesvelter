import { writable } from 'svelte/store'

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

export default {
  subscribe: game.subscribe,
  updateResults,
  start,
}
