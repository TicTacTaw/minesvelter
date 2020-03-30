<script>
  import { beforeUpdate } from 'svelte'
  import { board, SIZE_X } from './stores/board.js'
  import Tile from './components/Tile.svelte'
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
    if (cell.minesAround === 0 && !cell.hasMine) {
      const nextMines = myBoard.filter(
        tile =>
          (tile.x === cell.x - 1 && tile.y === cell.y - 1) ||
          (tile.x === cell.x && tile.y === cell.y - 1) ||
          (tile.x === cell.x + 1 && tile.y === cell.y - 1) ||
          (tile.x === cell.x - 1 && tile.y === cell.y) ||
          (tile.x === cell.x + 1 && tile.y === cell.y) ||
          (tile.x === cell.x - 1 && tile.y === cell.y + 1) ||
          (tile.x === cell.x && tile.y === cell.y + 1) ||
          (tile.x === cell.x + 1 && tile.y === cell.y + 1)
      )
      nextMines.forEach(truc => handleClick({ detail: { cell: truc } }))
    }
  }
</script>

<style>
  .boardWrapper {
    width: 529px;
    margin: 0 auto;
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;
    border: 2px solid #7accde;
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
              <Tile cell={myBoard[i * SIZE_X + j]} on:cellClick={handleClick} />
            </td>
          {/each}
        </tr>
      {/each}
    </table>
  </div>
</div>
