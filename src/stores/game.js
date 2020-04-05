import { writable } from 'svelte/store'

const initialGame = {
  results: null,
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

export default {
  subscribe: game.subscribe,
  updateResults,
}
