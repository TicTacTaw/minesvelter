<script>
  import { beforeUpdate, onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import board, { SIZE_X } from './stores/board.js'
  import game from './stores/game.js'
  import Tile from './components/Tile.svelte'
  import Settings from './components/Settings.svelte'
  import Timer from './components/Timer.svelte'
  import { formatTime, isAround } from './helpers'

  const reset = () => game.resetGame()

  onMount(() => {
    reset()
  })
</script>

<style>
  .boardWrapper {
    margin: 0 auto;
  }

  .grid {
    position: relative;
    display: inline-block;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }

  .resultsWrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.6);
  }
  .results {
    color: #333;
    cursor: pointer;
  }

  .results__title {
    display: block;
    padding: 20px 60px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
  }

  .results__reset {
    display: block;
    font-size: 14px;
    padding: 10px 20px;
    text-align: center;
    text-transform: uppercase;
  }

  .app {
    display: flex;
    align-items: center;
  }
  aside {
    left: 0;
    top: 0;
    min-height: 100vh;
    width: 300px;
    background-color: #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h1 {
    text-align: center;
    font-weight: 100;
    letter-spacing: 8px;
    font-size: 28px;
  }

  .app__stats {
    color: #333;
    padding: 2rem;
  }

  .stat__bestScore {
    display: block;
    font-weight: 300;
    font-size: 14px;
  }
</style>

<svelte:options immutable />
<div class="app">
  <aside>
    <h1>MINESVELTER</h1>

    <Settings />

    <div class="app__stats">
      <Timer />
      <span class="stat__bestScore">
        PERSONAL BEST: {formatTime($game.bestScore)}s
      </span>
    </div>
  </aside>
  <div class="boardWrapper">
    <div class="grid">
      <table cellspacing="0" cellpadding="0">
        {#each Array($board.length / $game.settings.x) as _, i}
          <tr>
            {#each Array($game.settings.x) as _, j}
              <td>
                <Tile cell={$board[i * $game.settings.x + j]} />
              </td>
            {/each}
          </tr>
        {/each}
      </table>

      {#if $game.results}
        <div class="resultsWrapper">
          <div in:fade={{ duration: 200 }} class="results" on:click={reset}>
            <span class="results__title">
              {#if !$game.results.isWin}OOPS !{:else}YAY{/if}
            </span>
            <span class="results__reset">Click to start a new game</span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
