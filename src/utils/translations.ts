type Translations = {
  [key: string]: {
    title: string;
    keyboard: string;
    print: string;
    solve: string;
    clear: string;
    solvedSuccess: string;
    solvedError: string;
    gridCleared: string;
  };
};

export const translations: Translations = {
  en: {
    title: "Sudoku Solver",
    keyboard: "Keyboard",
    print: "Print",
    solve: "Solve",
    clear: "Clear",
    solvedSuccess: "Sudoku solved successfully!",
    solvedError: "No solution exists for this configuration",
    gridCleared: "Grid cleared"
  },
  ru: {
    title: "Решатель Судоку",
    keyboard: "Клавиатура",
    print: "Распечатать",
    solve: "Решить",
    clear: "Очистить",
    solvedSuccess: "Судоку успешно решена!",
    solvedError: "Для данной конфигурации решение не существует",
    gridCleared: "Сетка очищена"
  },
};
