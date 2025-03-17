document.addEventListener('DOMContentLoaded', () => {
  // Получаем ссылки на элементы интерфейса
  const menuScreen    = document.getElementById('menu');
  const playScreen    = document.getElementById('play');
  const resultScreen  = document.getElementById('result');
  const startBtn      = document.getElementById('start-btn');
  const restartBtn    = document.getElementById('restart-btn');
  const answerInput   = document.getElementById('answer-input');
  const answerBtn     = document.getElementById('answer-btn');
  const feedback      = document.getElementById('feedback');
  const scoreElement  = document.getElementById('score');
  const timeElement   = document.getElementById('time');
  const operand1Span  = document.getElementById('operand1');
  const operand2Span  = document.getElementById('operand2');
  const operatorSpan  = document.getElementById('operator');
  const resultMessage = document.getElementById('result-message');

  // Игровые переменные
  let score = 0;
  let timeLeft = 30;
  let gameInterval;
  let currentAnswer;
  let usedProblems = new Set();  // Для хранения уже использованных примеров

  // Диапазоны чисел для разных уровней сложности
  const difficultyRanges = {
    easy:   [1, 9],   // однозначные числа
    medium: [1, 99],  // до двузначных
    hard:   [1, 999]  // до трёхзначных
  };

  // Функция запуска игры
  function startGame() {
    // Читаем выбранные настройки сложности и времени
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const maxTime    = parseInt(document.querySelector('input[name="time"]:checked').value, 10);
    timeLeft = maxTime;
    score    = 0;
    usedProblems.clear();
    updateScore();
    updateTime();

    // Показываем экран игры, скрываем меню и результат
    menuScreen.style.display   = 'none';
    resultScreen.style.display = 'none';
    playScreen.style.display   = 'block';

    // Генерируем первый пример
    generateProblem(difficulty);
    answerInput.focus();

    // Запускаем таймер обратного отсчёта
    gameInterval = setInterval(() => {
      timeLeft--;
      updateTime();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  // Функция генерации нового примера
  function generateProblem(difficulty) {
    const [min, max] = difficultyRanges[difficulty];
    let a, b, op, questionKey;
    do {
      // Случайные числа в диапазоне [min, max]
      a = getRandomInt(min, max);
      b = getRandomInt(min, max);
      // Случайно выбираем операцию (плюс или минус)
      op = Math.random() < 0.5 ? '+' : '-';
      // Если вычитание, обеспечим a >= b, чтобы не было отрицательных ответов
      if (op === '-' && a < b) {
        [a, b] = [b, a];
      }
      // Создаем ключ вопроса для проверки уникальности (например, "7-3")
      questionKey = `${a}${op}${b}`;
    } while (usedProblems.has(questionKey));
    // Добавляем в множество использованных вопросов
    usedProblems.add(questionKey);

    // Отображаем задачу на экране
    operand1Span.textContent = a;
    operand2Span.textContent = b;
    operatorSpan.textContent = op;
    // Вычисляем правильный ответ
    currentAnswer = (op === '+') ? (a + b) : (a - b);

    // Сбрасываем поле ввода и подсказку
    feedback.textContent = '';
    answerInput.value = '';
  }

  // Вспомогательная функция для получения случайного целого в диапазоне [min, max]
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Проверка ответа игрока
  function checkAnswer() {
    const userAnswer = parseInt(answerInput.value, 10);
    if (!isNaN(userAnswer)) {
      if (userAnswer === currentAnswer) {
        score++;
        feedback.textContent = 'Правильно!';
        feedback.style.color = 'green';
      } else {
        feedback.textContent = 'Неправильно.';
        feedback.style.color = 'red';
      }
      updateScore();
      // Генерируем следующий пример через небольшую паузу (0.5 сек)
      setTimeout(() => {
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        generateProblem(difficulty);
        answerInput.focus();
      }, 500);
    }
  }

  // Обновление счета на экране
  function updateScore() {
    scoreElement.textContent = `Правильно: ${score}`;
  }

  // Обновление таймера на экране
  function updateTime() {
    timeElement.textContent = `Время: ${timeLeft} сек`;
  }

  // Завершение игры и показ результата
  function endGame() {
    clearInterval(gameInterval);
    playScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    resultMessage.textContent = `Вы решили правильно ${score} пример(ов)!`;
  }

  // Обработчики событий для кнопок и ввода
  startBtn.addEventListener('click', startGame);
  answerBtn.addEventListener('click', checkAnswer);
  answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });
  restartBtn.addEventListener('click', () => {
    // Возвращаемся к экрану меню для новой игры
    resultScreen.style.display = 'none';
    menuScreen.style.display   = 'block';
  });
});

