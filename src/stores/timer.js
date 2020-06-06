import { writable } from 'svelte/store'

const timer = writable(0)

let interval
function start() {
  const beginning = new Date().getTime()

  interval = setInterval(() => {
    const current = new Date().getTime()
    timer.set(current - beginning)
  }, 10)
}

function stop() {
  interval && clearInterval(interval)
}

function reset() {
  timer.set(0)
}

export default {
  subscribe: timer.subscribe,
  start,
  stop,
  reset,
}
