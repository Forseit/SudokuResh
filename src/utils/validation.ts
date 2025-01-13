export const isValidInput = (value: string): boolean => {
  const num = parseInt(value);
  return !value || (num >= 1 && num <= 9);
};

const isValid = (grid: number[][], row: number, col: number, value: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === value) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === value) return false;
    }
  }

  return true;
};

export const isValidCell = (grid: number[][], row: number, col: number, value: number): boolean => {
  if (value === 0) return true;
  const tempGrid = grid.map(row => [...row]);
  tempGrid[row][col] = 0; // Remove current value to check against other cells
  return isValid(tempGrid, row, col, value);
};