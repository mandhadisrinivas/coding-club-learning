let questions = [];
let idx = 0;
let score = 0;
let locked = false;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");

const quizSection = document.getElementById("quiz");
const endSection = document.getElementById("end");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
  shuffle(questions);
  idx = 0; score = 0;
  updateScore();
  render();
}

function render() {
  locked = false;
  nextBtn.disabled = true;
  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";

  if (idx >= questions.length) return showEnd();

  const q = questions[idx];
  questionEl.textContent = `Q${idx + 1}. ${q.question}`;
  choicesEl.innerHTML = "";

  q.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i));
    choicesEl.appendChild(btn);
  });
}

function choose(choiceIndex) {
  if (locked) return;
  locked = true;

  const q = questions[idx];
  const buttons = [...choicesEl.querySelectorAll("button")];
  buttons.forEach(b => (b.disabled = true));

  const correct = choiceIndex === q.answerIndex;
  if (correct) {
    score++;
    feedbackEl.textContent = "Correct! ✅";
    feedbackEl.classList.add("good");
  } else {
    feedbackEl.textContent = `Not quite. ❌ Correct: ${q.choices[q.answerIndex]}`;
    feedbackEl.classList.add("bad");
  }

  updateScore();
  nextBtn.disabled = false;
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function showEnd() {
  quizSection.classList.add("hidden");
  endSection.classList.remove("hidden");
  finalScoreEl.textContent = `You scored ${score} out of ${questions.length}.`;
}

function restart() {
  endSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  loadQuestions();
}

nextBtn.addEventListener("click", () => { idx++; render(); });
restartBtn.addEventListener("click", restart);

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

loadQuestions();
