import { writable } from 'svelte/store';

export const SIZE_X = 16;
export const SIZE_Y = 16;
export const MINES_AMOUNT = 40;

const arr = [];
while (arr.length < MINES_AMOUNT) {
  const x = Math.floor(Math.random() * SIZE_X);
  const y = Math.floor(Math.random() * SIZE_Y);
  const index = y * SIZE_X + x;
  const mine = { x, y, index };
  if (!arr.includes(mine)) arr.push(mine);
}

const initialBoard = [...Array(SIZE_X * SIZE_Y)].map((_, index) => {
  const x = index % SIZE_X;
  const y = Math.floor(index / SIZE_X);
  const hasMine = !!arr.find((tile) => tile.x === x && tile.y === y);
  const minesAround = [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].filter((i) => !!arr.find((j) => i.x === j.x && i.y === j.y)).length;

  return { index, x, y, revealed: false, hasMine, minesAround };
});

export const board = writable(initialBoard);
