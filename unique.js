const difficulties = {
  easy: {
    time: 30,
    texts: [
      "The sun dipped below the horizon, casting a golden hue across the quiet village. Birds returned to their nests.",
      "Children played near the pond, their laughter echoing through the air. An old man sat on a bench nearby.",
      "In the distance, the temple bells rang softly, marking the arrival of dusk. Lights flickered on in the small houses.",
      "Moments like these were rare and precious, reminders of simplicity and peace."
    ]
  },
  medium: {
    time: 60,
    texts: [
      "The city woke slowly, bathed in the pale light of morning. Streets were still quiet, with only a few early risers making their way to work. Birds chirped softly as the sky turned from grey to gold. In the distance, the sound of a train broke the silence. Small tea stalls opened, steam rising from kettles. The day was beginning, full of new possibilities. People walked briskly, their thoughts focused and determined.",
      "Rain began to fall lightly, tapping against windows and rooftops. Inside, people gathered around warm drinks and quiet conversations. Books were opened, lamps were lit, and music played softly in the background. Outside, the streets shimmered with reflections of streetlights and umbrellas.",
      "A walk through the forest brought a sense of calm. Leaves crunched underfoot, birds sang from the trees, and sunlight streamed through the canopy. Every step brought a new sound or sight—a squirrel darting, a breeze whispering through the leaves. The air smelled fresh, full of pine and earth.",
      "The ocean stretched endlessly, meeting the sky at a faraway line. Waves crashed gently on the shore, each one slightly different, yet familiar. People strolled along the beach, leaving footprints that faded quickly in the sand. Children built castles, their laughter mixing with the sound of seagulls."
    ]
  },
  hard: {
    time: 90,
    texts: [
      "In a cozy café on a rainy afternoon, people sipped coffee and worked quietly. The hum of conversation blended with the soft clatter of cups and plates. A barista moved rhythmically behind the counter, steaming milk and grinding beans. Outside, raindrops streaked the windows and puddles formed on the street. Inside, warmth and comfort wrapped around everyone. A student typed away on a laptop, while an old couple shared stories. Time slowed in places like this. The world outside kept moving, but in here, it paused just enough for people to breathe, think, and be a little more present.",
      "In the mountains, silence has a different sound. It’s the whisper of wind through pine trees and the distant cry of an eagle. Hiking along a narrow trail, the only focus is the next step. Rocks, roots, and shadows challenge your balance. The air is thinner but crisp and pure. Reaching the top brings more than a view—it brings clarity. Everything below feels smaller, quieter, less urgent. The climb is hard, but the peace is earned. Nature rewards effort with stillness. ",
      "The library smelled of paper and silence. Rows of books stretched endlessly, each one a door to a different world. A few people sat scattered at desks, lost in study or thought. The ticking of a clock and the rustle of turning pages were the only sounds. Light filtered in through tall windows, casting shadows between the shelves. Here, time didn’t matter. Stories lived quietly, waiting to be discovered. A single book could change a mind, shift a perspective, or ignite a dream.",
      "At night, the city transformed. Lights flickered to life, painting the streets in shades of orange and blue. Cars moved like glowing beetles, and distant sirens echoed like ghost songs. Street vendors served late dinners, their stalls lit with flickering bulbs. Strangers passed each other without a word, lost in their own worlds. Above, skyscrapers stood like sleeping giants. The stars fought to be seen through the haze. Despite the noise and lights, a strange calm settled over everything."
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

  const title = document.getElementById("testResultTitle");
  title.textContent = isCompleted ? "✅ Test Completed" : "⏰ Oops! You ran out of time";
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
