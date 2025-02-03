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
    reviews: string;
    yourName: string;
    yourReview: string;
    anonymous: string;
    submit: string;
    anonymousUser: string;
    error: string;
    success: string;
    reviewRequired: string;
    reviewSubmitted: string;
    errorOccurred: string;
    goBack: string;
  };
};

export const translations: Translations = {
  en: {
    // ... keep existing code (existing English translations)
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
    contactEmail: "Contact Email",
    reviews: "Reviews",
    yourName: "Your Name",
    yourReview: "Your Review",
    anonymous: "Post anonymously",
    submit: "Submit Review",
    anonymousUser: "Anonymous User",
    error: "Error",
    success: "Success",
    reviewRequired: "Review content is required",
    reviewSubmitted: "Review submitted successfully",
    errorOccurred: "An error occurred while submitting the review",
    goBack: "Go back"
  },
  ru: {
    // ... keep existing code (existing Russian translations)
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
    contactEmail: "Почта для связи",
    reviews: "Отзывы",
    yourName: "Ваше имя",
    yourReview: "Ваш отзыв",
    anonymous: "Отправить анонимно",
    submit: "Отправить отзыв",
    anonymousUser: "Анонимный пользователь",
    error: "Ошибка",
    success: "Успешно",
    reviewRequired: "Необходимо написать отзыв",
    reviewSubmitted: "Отзыв успешно отправлен",
    errorOccurred: "Произошла ошибка при отправке отзыва",
    goBack: "Вернуться назад"
  },
};
