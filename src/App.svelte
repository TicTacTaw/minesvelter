<script>
  import { beforeUpdate } from 'svelte'
  import { fly } from 'svelte/transition'
  import board, { SIZE_X } from './stores/board.js'
  import Tile from './components/Tile.svelte'
  import { isAround } from './helpers'

  let results = null

  let myBoard = []
  const unsubscribe = board.subscribe(value => {
    myBoard = value
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
    border: 2px solid #7accde;
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
</style>

<svelte:options immutable />
<div class="boardWrapper">
  <div class="grid">
    <table cellspacing="0" cellpadding="0">
      {#each Array(myBoard.length / SIZE_X) as _, i}
        <tr>
          {#each Array(SIZE_X) as _, j}
            <td>
              <Tile cell={myBoard[i * SIZE_X + j]} />
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
