import React, { useState } from 'react';
import SudokuCell from './SudokuCell';
import { Button } from "@/components/ui/button";
import { isValidCell } from '../utils/validation';
import { solveSudoku } from '../utils/sudokuSolver';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { incrementGameCount } from '../utils/incrementGameCount';
import { useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

type GlobalStats = Database['public']['Tables']['global_stats']['Row'];

interface SudokuGridProps {
  useKeyboard: boolean;
  t: {
    title: string;
    keyboard: string;
    print: string;
    solve: string;
    clear: string;
    solvedSuccess: string;
    solvedError: string;
    gridCleared: string;
  };
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ useKeyboard, t }) => {
  const [grid, setGrid] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [invalidCellFlash, setInvalidCellFlash] = useState<{ row: number; col: number } | null>(null);
  const queryClient = useQueryClient();

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value === '' ? 0 : parseInt(value);
    setGrid(newGrid);
  };

  const handleNumberClick = (number: number | null) => {
    if (selectedCell) {
      if (number === null) {
        if (grid[selectedCell.row][selectedCell.col] === 0) {
          setInvalidCellFlash(selectedCell);
          setTimeout(() => setInvalidCellFlash(null), 1000);
        } else {
          handleCellChange(selectedCell.row, selectedCell.col, '');
        }
      } else {
        handleCellChange(selectedCell.row, selectedCell.col, number.toString());
      }
    }
  };

  const handleSolve = async () => {
    const gridCopy = grid.map(row => [...row]);
    if (solveSudoku(gridCopy)) {
      setGrid(gridCopy);
      toast.success(t.solvedSuccess);
      
      // Optimistically update the games solved count
      const currentStats = queryClient.getQueryData(['global-stats']) as GlobalStats;
      if (currentStats) {
        queryClient.setQueryData(['global-stats'], {
          ...currentStats,
          games_solved: (currentStats.games_solved || 0) + 1
        });
      }
      
      // Update the database
      await incrementGameCount();
    } else {
      toast.error(t.solvedError);
    }
  };

  const handleClear = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));
    toast.info(t.gridCleared);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-9 gap-0 border-2 border-red-800 bg-white">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell === 0 ? '' : cell.toString()}
              onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
              isValid={isValidCell(grid, rowIndex, colIndex, cell)}
              row={rowIndex}
              col={colIndex}
              onSelect={() => setSelectedCell({ row: rowIndex, col: colIndex })}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              isFlashing={invalidCellFlash?.row === rowIndex && invalidCellFlash?.col === colIndex}
              useKeyboard={useKeyboard}
            />
          ))
        ))}
      </div>

      {!useKeyboard && (
        <div className="grid grid-cols-10 gap-2 w-full max-w-md">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <Button
              key={number}
              variant="outline"
              onClick={() => handleNumberClick(number)}
              className="h-10 w-10 p-0"
            >
              {number}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handleNumberClick(null)}
            className="h-10 w-10 p-0 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-4">
        <Button 
          onClick={handleSolve}
          className="bg-red-800 hover:bg-red-900 text-white"
        >
          {t.solve}
        </Button>
        <Button 
          onClick={handleClear}
          variant="outline"
          className="border-red-800 text-red-800 hover:bg-red-50"
        >
          {t.clear}
        </Button>
      </div>
    </div>
  );
};

export default SudokuGrid;
