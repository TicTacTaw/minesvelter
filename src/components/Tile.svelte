<script>
  import { createEventDispatcher } from 'svelte'
  import board from '../stores/board'
  import game from '../stores/game.js'

  export let cell = {}

  let hasStarted = false
  game.subscribe(value => {
    hasStarted = value.hasStarted
  })

  $: minesAround = cell.minesAround !== undefined ? cell.minesAround : ''

  const clickHandler = async (e = window.event) => {
    if (!cell.revealed && (e.metaKey || e.altKey)) {
      board.flagCell(cell)
    } else if (!cell.flagged) {
      if (!hasStarted) {
        await game.start()
        await board.initBoard(cell)
      }
      await board.revealCell(cell)
    }
  }

  const doubleClickHandler = (e = window.event) => {
    board.massReveal(cell)
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
    cursor: default;
    user-select: none;
  }
  .tile:hover {
    background-color: #4799ab;
  }
  .tile > img {
    width: 100%;
    height: 100%;
    padding: 6px;
    box-sizing: border-box;
  }
  .tile.revealed {
    background-color: #f5f5f5;
  }
  .tile[data-value='X'] {
    background-color: #ee6060;
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
  class:flagged={cell.flagged}
  on:click={clickHandler}
  on:dblclick={doubleClickHandler}
  data-value={cell.revealed ? (cell.hasMine ? 'X' : minesAround) : ''}>
  {#if cell.revealed}
    {#if cell.hasMine}
      <img src={require('../assets/svg/mine.svg')} />
    {:else}{minesAround || ''}{/if}
  {:else if cell.flagged}
    <img src={require('../assets/svg/flag.svg')} />
  {/if}
</div>
