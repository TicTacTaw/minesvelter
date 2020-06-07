import { writable, get } from 'svelte/store'
import game from './game'
import { isAround } from '../helpers'

const board = writable([])

function initBoard(firstCell) {
  const { settings } = get(game)
  const arr = []
  while (arr.length < settings.mines) {
    const x = Math.floor(Math.random() * settings.x)
    const y = Math.floor(Math.random() * settings.y)
    const index = y * settings.x + x
    const mine = { x, y, index }

    if (
      !arr.some((mine) => mine.index === index) &&
      mine.index !== firstCell.index &&
      !isAround(firstCell, mine)
    ) {
      arr.push(mine)
    }
  }

  board.update((value) => {
    return value.map(({ x, y, index, revealed }) => {
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

      return { x, y, index, hasMine, minesAround, revealed }
    })
  })
}
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
    const { results } = get(game)

    if (!results) {
      game.updateResults(false)
      myBoard.forEach((tile) => {
        if (tile.hasMine && !tile.flagged) {
          revealCell(tile)
        }
      })
    }

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

function resetBoard() {
  const { settings } = get(game)
  board.set(
    [...Array(settings.x * settings.y)].map((_, index) => ({
      x: index % settings.x,
      y: Math.floor(index / settings.x),
      index,
      revealed: false,
    }))
  )
}

export default {
  subscribe: board.subscribe,
  revealCell,
  flagCell,
  massReveal,
  initBoard,
  resetBoard,
}
