const difficulties = {
  easy: {
    time: 30,
    texts: [
      "Rain tapped softly on the window as the world outside turned grey...",
      "A fox darted across the field, barely visible against the tall golden grass...",
      "Typing tests train your fingers to flow effortlessly over the keyboard...",
      "Music filled the room as she danced alone, lost in rhythm and emotion..."
    ]
  },
  medium: {
    time: 60,
    texts: [
      "There’s something deeply satisfying about typing with speed and grace...",
      "The stars above shimmered like ancient lanterns in the vast darkness...",
      "A well-designed typing test doesn't only measure your speed...",
      "He walked along the beach just as dawn broke..."
    ]
  },
  hard: {
    time: 90,
    texts: [
      "Typing, much like playing a musical instrument, requires both practice and patience...",
      "In an age of instant communication, speed is everything...",
      "Life is often compared to a journey, but it’s not always about the destination...",
      "The power of words can never be overstated..."
    ]
  }
};

let currentText = "";
let timer = null;
let timeLeft = 0;
let totalTyped = 0;
let correctTyped = 0;
let difficultyLevel = "";
let testCompleted = false;

function startTest(level) {
  difficultyLevel = level;
  document.getElementById("difficultySelect").classList.add("hidden");
  document.getElementById("testArea").classList.remove("hidden");

  const data = difficulties[level];
  timeLeft = data.time;
  const randomText = data.texts[Math.floor(Math.random() * data.texts.length)];
  currentText = randomText;

  document.getElementById("timer").innerText = timeLeft;
  renderText(currentText);
  document.getElementById("quoteInput").value = "";
  document.getElementById("quoteInput").focus();

  totalTyped = 0;
  correctTyped = 0;
  testCompleted = false;

  document.getElementById("quoteInput").addEventListener("input", handleTyping);
}

function renderText(text) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });
}

function handleTyping() {
  const input = document.getElementById("quoteInput").value;
  const quoteSpans = document.getElementById("quoteDisplay").querySelectorAll("span");

  if (totalTyped === 0 && !timer) startTimer();

  totalTyped = input.length;
  correctTyped = 0;
  let completed = true;

  quoteSpans.forEach((span, i) => {
    const typedChar = input[i];
    if (typedChar == null) {
      span.classList.remove("correct", "incorrect");
      completed = false;
    } else if (typedChar === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correctTyped++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
      completed = false;
    }
  });

  if (completed && input.length === currentText.length) {
    finishTest(true);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
      finishTest(false);
    }
  }, 1000);
}

function finishTest(isCompleted) {
  if (testCompleted) return; // prevent multiple triggers
  testCompleted = true;

  clearInterval(timer);
  timer = null;

  document.getElementById("quoteInput").disabled = true;

  const timeTaken = difficulties[difficultyLevel].time - timeLeft;
  const wpm = Math.round((correctTyped / 5) / (timeTaken / 60));
  const accuracy = Math.round((correctTyped / totalTyped) * 100) || 0;

  document.getElementById("finalTime").innerText = timeTaken;
  document.getElementById("finalWPM").innerText = wpm;
  document.getElementById("finalAccuracy").innerText = accuracy;

  const popup = document.getElementById("resultPopup");
  const tryAgainBtn = document.getElementById("tryAgainBtn");

  popup.classList.remove("hidden");

  if (isCompleted && accuracy >= 90) {
    const canvas = document.getElementById("popupConfetti");
    const popupConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    for (let i = 0; i < 5; i++) {
      popupConfetti({
        particleCount: 100,
        spread: 70 + i * 5,
        origin: { x: 0.5, y: 0.5 }
      });
    }

    tryAgainBtn.innerText = "Type Again";
  } else {
    tryAgainBtn.innerText = "Try Again";
  }
}

function resetTest() {
  document.getElementById("testArea").classList.add("hidden");
  document.getElementById("resultPopup").classList.add("hidden");
  document.getElementById("quoteInput").disabled = false;
  document.getElementById("difficultySelect").classList.remove("hidden");
}
