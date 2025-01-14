type Translations = {
  [key: string]: {
    title: string;
    keyboard: string;
    print: string;
  };
};

export const translations: Translations = {
  en: {
    title: "Sudoku Solver",
    keyboard: "Keyboard",
    print: "Print",
  },
  ru: {
    title: "Решатель Судоку",
    keyboard: "Клавиатура",
    print: "Распечатать",
  },
};
