<script>
  import { beforeUpdate, onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'
  import board, { SIZE_X } from './stores/board.js'
  import game from './stores/game.js'
  import Tile from './components/Tile.svelte'
  import { isAround } from './helpers'

  let results = null

  game.subscribe(value => {
    results = value.results
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
  }
  .results {
    padding: 20px 60px;
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 30px;
    color: white;
    font-weight: bold;
  }

  .app {
    display: flex;
    align-items: center;
  }
  .settings {
    left: 0;
    top: 0;
    min-height: 100vh;
    width: 300px;
    background-color: #eee;
  }

  h1 {
    text-align: center;
    font-weight: 100;
    letter-spacing: 8px;
    font-size: 28px;
  }
</style>

<svelte:options immutable />
<div class="app">
  <div class="settings">
    <h1>MINESVELTER</h1>
  </div>
  <div class="boardWrapper">
    <div class="grid">
      <table cellspacing="0" cellpadding="0">
        {#each Array($board.length / SIZE_X) as _, i}
          <tr>
            {#each Array(SIZE_X) as _, j}
              <td>
                <Tile cell={$board[i * SIZE_X + j]} />
              </td>
            {/each}
          </tr>
        {/each}
      </table>

      {#if results}
        <div class="resultsWrapper">
          <div in:fly={{ y: -100, duration: 500 }} class="results">
            {#if !results.isWin}OOPS !{:else}YAY{/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
