import React from 'react';
import { cn } from "@/lib/utils";

interface SudokuCellProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  row: number;
  col: number;
  onSelect: () => void;
  isSelected: boolean;
  isFlashing?: boolean;
  useKeyboard: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ 
  value, 
  onChange, 
  isValid, 
  row, 
  col, 
  onSelect,
  isSelected,
  isFlashing,
  useKeyboard 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!useKeyboard) return;
    const newValue = e.target.value.slice(-1);
    if (newValue === '' || /^[1-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onClick={() => onSelect()}
      readOnly={!useKeyboard}
      className={cn(
        "w-10 h-10 text-center text-xl font-semibold border-[1px] border-gray-300",
        "focus:outline-none dark:bg-gray-800 dark:text-white",
        isSelected && "bg-[#3F888F] text-white dark:bg-blue-900",
        !isValid && value !== "" && "text-red-500 bg-red-50 dark:bg-red-900",
        isFlashing && "bg-red-100 dark:bg-red-900 transition-colors duration-1000",
        (col + 1) % 3 === 0 && col !== 8 && "border-r-2 border-r-red-800",
        (row + 1) % 3 === 0 && row !== 8 && "border-b-2 border-b-red-800"
      )}
      maxLength={1}
    />
  );
};

export default SudokuCell;
