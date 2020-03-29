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
    } else if (!flagged) {
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
    border: solid 0.5px white;
    font-weight: bold;
  }
  .tile.revealed {
    background-color: #f5f5f5;
  }
  .tile[data-value='X'] {
    background-color: #eb3939;
  }
  .tile[data-value='1'] {
    color: #055dd1;
  }
  .tile[data-value='2'] {
    color: #16a139;
  }
  .tile[data-value='3'] {
    color: #ff6528;
  }
  .tile[data-value='4'] {
    color: #eb3939;
  }
  .tile[data-value='5'] {
    color: #df22fa;
  }
  .tile[data-value='6'] {
    color: #8700e0;
  }
  .tile[data-value='7'] {
    color: #00cece;
  }
  .tile[data-value='8'] {
    color: #865454;
  }
  .tile.flagged {
    background-color: #ffdd44;
  }
</style>

<div
  class="tile"
  class:revealed={cell.revealed}
  class:flagged={flagged && !cell.revealed}
  on:click={clickHandler}
  data-value={cell.revealed ? (cell.hasMine ? 'X' : minesAround) : ''}>
  {#if cell.revealed}{cell.hasMine ? 'X' : minesAround || ''}{/if}
</div>
