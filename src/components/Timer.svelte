<script>
  import timer from '../stores/timer.js'
  import { formatTime } from '../helpers'

  let time = 0
  const unsubscribe = timer.subscribe(value => {
    time = value
  })
</script>

<style>
  .timer {
    font-weight: 300;
    font-size: 48px;
  }
</style>

<span class="timer">{formatTime(time)}s</span>
