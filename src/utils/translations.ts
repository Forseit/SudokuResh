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
    users: string;
    gamesSolved: string;
    updatesReleased: string;
    daysFromStart: string;
    contactEmail: string;
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
    gridCleared: "Grid cleared",
    users: "Users",
    gamesSolved: "Games Solved",
    updatesReleased: "Updates Released",
    daysFromStart: "Days Since Launch",
    contactEmail: "Contact Email"
  },
  ru: {
    title: "Решатель Судоку",
    keyboard: "Клавиатура",
    print: "Распечатать",
    solve: "Решить",
    clear: "Очистить",
    solvedSuccess: "Судоку успешно решена!",
    solvedError: "Для данной конфигурации решение не существует",
    gridCleared: "Сетка очищена",
    users: "Пользователей",
    gamesSolved: "Игр решено",
    updatesReleased: "Обновлений сделано",
    daysFromStart: "Дней с открытия",
    contactEmail: "Почта для связи"
  },
};
