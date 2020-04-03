export const isAround = (cell1, cell2) =>
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y) ||
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y + 1) ||
  (cell2.x === cell1.x && cell2.y === cell1.y + 1) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y + 1)
