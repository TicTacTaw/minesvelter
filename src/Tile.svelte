<script>
  import { createEventDispatcher } from 'svelte'
  let flagged = false
  export let cell = {}
  let revealed
  let minesAround = cell.minesAround !== undefined ? cell.minesAround : ''
  const dispatch = createEventDispatcher()
  const clickHandler = (e = window.event) => {
    if (!cell.revealed && e.metaKey) {
      flagged = !flagged
    } else {
      revealed = true
      dispatch('cellClick', { cell })
    }
  }
</script>

<style>
  .tile {
    background-color: #7accde;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    text-align: center;
    line-height: 30px;
    border: solid 1px white;
    font-weight: bold;
  }
  .tile.revealed {
    background-color: white;
  }
  .tile.flagged {
    background-color: green;
  }
</style>

<div
  class="tile"
  class:revealed={cell.revealed}
  class:flagged
  on:click={clickHandler}
  data-value={cell.revealed ? (cell.hasMine ? 'X' : minesAround) : ''}>
  {#if cell.revealed}{cell.hasMine ? 'X' : minesAround || ''}{/if}
</div>
