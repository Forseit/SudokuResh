export const findNextCellToFill = (grid: number[][], i: number, j: number): [number, number] => {
  for (let x = i; x < 9; x++) {
    for (let y = j; y < 9; y++) {
      if (grid[x][y] === 0) return [x, y];
    }
  }
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (grid[x][y] === 0) return [x, y];
    }
  }
  return [-1, -1];
};

export const isValid = (grid: number[][], i: number, j: number, e: number): boolean => {
  // Check row
  const rowOk = grid[i].every((num, index) => index === j || num !== e);
  if (!rowOk) return false;

  // Check column
  const columnOk = grid.every((row, index) => index === i || row[j] !== e);
  if (!columnOk) return false;

  // Check 3x3 box
  const secTopX = 3 * Math.floor(i / 3);
  const secTopY = 3 * Math.floor(j / 3);
  for (let x = secTopX; x < secTopX + 3; x++) {
    for (let y = secTopY; y < secTopY + 3; y++) {
      if (x !== i && y !== j && grid[x][y] === e) return false;
    }
  }
  return true;
};

export const solveSudoku = (grid: number[][]): boolean => {
  const [i, j] = findNextCellToFill(grid, 0, 0);
  if (i === -1) return true;

  for (let e = 1; e <= 9; e++) {
    if (isValid(grid, i, j, e)) {
      grid[i][j] = e;
      if (solveSudoku(grid)) return true;
      grid[i][j] = 0;
    }
  }
  return false;
};