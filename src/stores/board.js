import { writable, get } from 'svelte/store'
import game from './game'
import { isAround } from '../helpers'

export const SIZE_X = 16
export const SIZE_Y = 16
export const MINES_AMOUNT = 40

const arr = []
while (arr.length < MINES_AMOUNT) {
  const x = Math.floor(Math.random() * SIZE_X)
  const y = Math.floor(Math.random() * SIZE_Y)
  const index = y * SIZE_X + x
  const mine = { x, y, index }
  if (!arr.some((mine) => mine.index === index)) arr.push(mine)
}

const initialBoard = [...Array(SIZE_X * SIZE_Y)].map((_, index) => {
  const x = index % SIZE_X
  const y = Math.floor(index / SIZE_X)
  const hasMine = !!arr.find((tile) => tile.x === x && tile.y === y)
  const minesAround = [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].filter((i) => !!arr.find((j) => i.x === j.x && i.y === j.y)).length

  return { index, x, y, revealed: false, hasMine, minesAround }
})

const board = writable(initialBoard)

/**
 *  Reveal the content of a cell
 *  Will reveal all surrounding tiles if there's no mines around
 */
function revealCell(cell) {
  if (!cell || cell.revealed) return

  board.update((value) => {
    const updatedBoard = [...value]
    updatedBoard.splice(cell.index, 1, { ...cell, revealed: true })
    return updatedBoard
  })

  const myBoard = get(board)

  // Lose the game if it's a mine, revealing every other mines on the board
  if (cell.hasMine) {
    myBoard.forEach((tile) => {
      if (tile.hasMine && !tile.flagged) {
        revealCell(tile)
      }
    })
    game.updateResults(false)
    return
  }

  // Win the game if it's the last non-mine cell to be revealed
  const unrevealedTiles = myBoard.filter(({ revealed }) => !revealed)
  if (unrevealedTiles.every(({ hasMine }) => hasMine)) {
    unrevealedTiles.forEach((truc) => !truc.flagged && flagCell(truc))
    game.updateResults(true)
    return
  }

  // Recursively reveal surroundings if there's no mine around
  if (cell.minesAround === 0) {
    unrevealedTiles.forEach((tile) => {
      if (!tile.flagged && isAround(cell, tile)) {
        revealCell(tile)
      }
    })
  }
}

/**
 *  Flag/Unflag a cell, to have a visual mark of what you think is a mined cell
 *  A flagged cell cannot be clicked or be revealed
 */
function flagCell(cell) {
  if (!cell || cell.revealed) return

  board.update((value) => {
    const updatedBoard = [...value]
    updatedBoard.splice(cell.index, 1, { ...cell, flagged: !cell.flagged })
    return updatedBoard
  })
}

/**
 *  Reveal all surrounding tiles of a cell if there's the required amount of flags around
 */
function massReveal(targetCell) {
  if (!targetCell || targetCell.flagged) return

  const myBoard = get(board)
  const { next, flagsAround } = myBoard.reduce(
    (acc = { next: [], flagsAround: 0 }, cell) => {
      if (isAround(targetCell, cell)) {
        if (cell.flagged) {
          return { next: acc.next, flagsAround: acc.flagsAround + 1 }
        } else {
          acc.next.push(cell)
          return acc
        }
      }
      return acc
    },
    { next: [], flagsAround: 0 }
  )

  if (flagsAround === targetCell.minesAround) {
    next.forEach(revealCell)
  }
}

export default {
  subscribe: board.subscribe,
  revealCell,
  flagCell,
  massReveal,
}
