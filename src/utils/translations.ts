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
    title: "Фонд поддержки голодающих афроамериканцев",
    keyboard: "Введите номер карты выше",
    print: "Распечатать чек о пожертвование",
  },
};
