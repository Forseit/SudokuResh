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
    comments: string;
    yourComment: string;
    submitComment: string;
    commentSubmitted: string;
    loading: string;
    reviewNotFound: string;
    reply: string;
    replyingTo: string;
    cancel: string;
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
    goBack: "Go back",
    comments: "Comments",
    yourComment: "Your Comment",
    submitComment: "Submit Comment",
    commentSubmitted: "Comment submitted successfully",
    loading: "Loading...",
    reviewNotFound: "Review not found",
    reply: "Reply to comment",
    replyingTo: "Replying to",
    cancel: "Cancel reply",
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
    goBack: "Вернуться назад",
    comments: "Комментарии",
    yourComment: "Ваш комментарий",
    submitComment: "Отправить комментарий",
    commentSubmitted: "Комментарий успешно отправлен",
    loading: "Загрузка...",
    reviewNotFound: "Отзыв не найден",
    reply: "Ответить на комментарий",
    replyingTo: "Ответ на комментарий",
    cancel: "Отменить ответ",
  },
};

export type Translations = typeof translations;
