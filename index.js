// ------------------ QUIZ QUESTIONS ------------------
const questions = [
  {
    question: "What does `typeof NaN` return?",
    options: ["number", "undefined", "object", "NaN"],
    answer: "number"
  },
  {
    question: "Which method is used to convert JSON to a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.toObject()"],
    answer: "JSON.parse()"
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Mozilla", "Microsoft", "Netscape", "Google"],
    answer: "Netscape"
  },
  {
    question: "What will `console.log(0 == '0')` return?",
    options: ["true", "false", "undefined", "error"],
    answer: "true"
  },
  {
    question: "Which keyword declares a constant variable?",
    options: ["let", "const", "var", "define"],
    answer: "const"
  },
  {
    question: "Which symbol is used for strict equality?",
    options: ["==", "!=", "===", "!=="],
    answer: "==="
  },
  {
    question: "What is the output of '5' + 3 in JavaScript?",
    options: ["8", "53", "NaN", "undefined"],
    answer: "53"
  },
  {
    question: "Which one is NOT a primitive data type?",
    options: ["string", "boolean", "object", "number"],
    answer: "object"
  },
  {
    question: "What does Array.isArray([]) return?",
    options: ["false", "true", "undefined", "error"],
    answer: "true"
  },
  {
    question: "Which loop is guaranteed to execute at least once?",
    options: ["for", "while", "do...while", "foreach"],
    answer: "do...while"
  }
];

// ------------------ VARIABLES ------------------
let current = 0; // current question number
let selectedAnswers = {}; // to save user answers
let timeLeft = 10; // timer for each question
let timer; // store setInterval
let playerName = ""; // player name

// ------------------ PAGE ELEMENTS ------------------
const startPage = document.getElementById("start-page");
const quizPage = document.getElementById("quiz-page");
const reviewPage = document.getElementById("review-page");
const resultPage = document.getElementById("result-page");

const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const timeEl = document.getElementById("time");
const reviewList = document.getElementById("review-list");
const finalScore = document.getElementById("final-score");
const message = document.getElementById("message");

// ------------------ START QUIZ ------------------
document.getElementById("start-btn").onclick = function () {
  const nameBox = document.getElementById("player-name");
  playerName = nameBox.value.trim();

  if (playerName === "") {
    alert("Please enter your name");
    return;
  }

  startPage.classList.add("hidden");
  quizPage.classList.remove("hidden");

  loadQuestion();
  startTimer();
};

// ------------------ LOAD A QUESTION ------------------
function loadQuestion() {
  const q = questions[current]; // get current question
  questionText.textContent = "Q" + (current + 1) + ": " + q.question;

  // clear old options
  optionsDiv.innerHTML = "";

  // show all options
  for (let i = 0; i < q.options.length; i++) {
    const opt = q.options[i];

    const div = document.createElement("div");
    div.className = "option";

    div.innerHTML =
      "<label>" +
      "<input type='radio' name='q' value='" + opt + "' " +
      (selectedAnswers[current] === opt ? "checked" : "") + "/>" +
      opt +
      "</label>";

    optionsDiv.appendChild(div);
  }
}

// ------------------ TIMER ------------------
function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timeEl.textContent = timeLeft;

  timer = setInterval(function () {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft === 0) {
      handleNext(); // move to next question automatically
    }
  }, 1000);
}

// ------------------ NEXT BUTTON ------------------
function handleNext() {
  const selected = document.querySelector("input[name='q']:checked");
  if (selected) {
    selectedAnswers[current] = selected.value;
  }

  if (current < questions.length - 1) {
    current++;
    loadQuestion();
    startTimer();
  } else {
    showReview();
  }
}

// ------------------ PREVIOUS BUTTON ------------------
function handlePrev() {
  if (current > 0) {
    current--;
    loadQuestion();
    startTimer();
  }
}

// connect buttons
document.getElementById("next-btn").onclick = handleNext;
document.getElementById("prev-btn").onclick = handlePrev;

// ------------------ REVIEW ANSWERS ------------------
function showReview() {
  // Stop any running question timer when entering review
  clearInterval(timer);
  // Ensure only the review page is visible
  quizPage.classList.add("hidden");
  resultPage.classList.add("hidden");
  reviewPage.classList.remove("hidden");

  reviewList.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const userAns = selectedAnswers[i];
    const isCorrect = userAns === q.answer;

    const li = document.createElement("li");
    li.className = isCorrect ? "correct" : "incorrect";
    li.innerHTML =
      "<p><strong>Q" + (i + 1) + ":</strong> " + q.question + "</p>" +
      "<p class='ans your " + (isCorrect ? "correct" : "incorrect") + "'><span class='label'>Your answer:</span> <span class='value'>" + (userAns ? userAns : "—") + "</span></p>" +
      "<p class='ans correct'><span class='label'>Correct answer:</span> <span class='value'>" + q.answer + "</span></p>";

    reviewList.appendChild(li);
  }
}

// ------------------ SUBMIT BUTTON ------------------
document.getElementById("submit-btn").onclick = function () {
  showResult();
};

// ------------------ SHOW RESULT ------------------
function showResult() {
  // Stop any running timer so it doesn't navigate back to review
  clearInterval(timer);
  // Ensure only the result page is visible
  reviewPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    if (selectedAnswers[i] === questions[i].answer) {
      score++;
    }
  }

  finalScore.textContent = playerName + ", you scored " + score + " out of " + questions.length;

  if (score >= questions.length * 0.75) {
    message.textContent = "Excellent work! 💪";
  } else if (score >= questions.length * 0.5) {
    message.textContent = "Good job! Keep practicing. 👍";
  } else {
    message.textContent = "Don't worry, try again! 🔁";
  }
}

// ------------------ RETRY BUTTON ------------------
const retryBtn = document.getElementById("retry-btn");
if (retryBtn) {
  retryBtn.onclick = function () {
    current = 0;
    selectedAnswers = {};
    resultPage.classList.add("hidden");
    startPage.classList.remove("hidden");
  };
}
