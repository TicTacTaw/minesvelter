<script>
  import { beforeUpdate } from 'svelte'
  import { fly } from 'svelte/transition'
  import { board, SIZE_X } from './stores/board.js'
  import Tile from './components/Tile.svelte'

  let results = null

  let myBoard = []
  const unsubscribe = board.subscribe(value => {
    myBoard = value
  })
  function handleClick({ detail: c }) {
    const cell = c.cell
    if (!cell || cell.revealed) return
    board.update(value => {
      const updatedBoard = [...value]
      updatedBoard.splice(cell.index, 1, { ...cell, revealed: true })
      return updatedBoard
    })

    if (cell.hasMine) {
      results = { isWin: false }
      const nextMines = myBoard.filter(tile => tile.hasMine && !tile.flagged)
      nextMines.forEach(truc => handleClick({ detail: { cell: truc } }))
      return
    }
    const unrevealedTiles = myBoard.filter(({ revealed }) => !revealed)
    if (unrevealedTiles.every(({ hasMine }) => hasMine)) {
      unrevealedTiles.forEach(
        truc => !truc.flagged && flagCell({ detail: { cell: truc } })
      )
      results = { isWin: true }
      return
    }

    if (cell.minesAround === 0 && !cell.hasMine) {
      const nextMines = myBoard.filter(
        tile =>
          !tile.revealed &&
          !tile.flagged &&
          ((tile.x === cell.x - 1 && tile.y === cell.y - 1) ||
            (tile.x === cell.x && tile.y === cell.y - 1) ||
            (tile.x === cell.x + 1 && tile.y === cell.y - 1) ||
            (tile.x === cell.x - 1 && tile.y === cell.y) ||
            (tile.x === cell.x + 1 && tile.y === cell.y) ||
            (tile.x === cell.x - 1 && tile.y === cell.y + 1) ||
            (tile.x === cell.x && tile.y === cell.y + 1) ||
            (tile.x === cell.x + 1 && tile.y === cell.y + 1))
      )
      nextMines.forEach(truc => handleClick({ detail: { cell: truc } }))
    }
  }

  function flagCell({ detail: c }) {
    const cell = c.cell
    if (!cell || cell.revealed) return
    board.update(value => {
      const updatedBoard = [...value]
      updatedBoard.splice(cell.index, 1, { ...cell, flagged: !cell.flagged })
      return updatedBoard
    })
  }
  function massReveal({ detail: c }) {
    const cell = c.cell
    if (!cell || cell.flagged) return
    const { next, flagsAround } = myBoard.reduce(
      (acc = { next: [], flagsAround: 0 }, tile) => {
        if (
          (tile.x === cell.x - 1 && tile.y === cell.y - 1) ||
          (tile.x === cell.x && tile.y === cell.y - 1) ||
          (tile.x === cell.x + 1 && tile.y === cell.y - 1) ||
          (tile.x === cell.x - 1 && tile.y === cell.y) ||
          (tile.x === cell.x + 1 && tile.y === cell.y) ||
          (tile.x === cell.x - 1 && tile.y === cell.y + 1) ||
          (tile.x === cell.x && tile.y === cell.y + 1) ||
          (tile.x === cell.x + 1 && tile.y === cell.y + 1)
        ) {
          if (tile.flagged) {
            return { next: acc.next, flagsAround: acc.flagsAround + 1 }
          } else {
            acc.next.push(tile)
            return acc
          }
        }
        return acc
      },
      { next: [], flagsAround: 0 }
    )
    if (flagsAround === cell.minesAround) {
      next.forEach(truc => handleClick({ detail: { cell: truc } }))
    }
  }
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
              <Tile
                cell={myBoard[i * SIZE_X + j]}
                on:cellClick={handleClick}
                on:flagCell={flagCell}
                on:massReveal={massReveal} />
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
