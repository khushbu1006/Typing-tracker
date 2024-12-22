let timerInterval, totalChars = 0, errors = 0, startTime;

const startButton = document.getElementById("startButton");
const startTestButton = document.getElementById("startTestButton");
const retryButton = document.getElementById("retryButton");
const viewHistoryButton = document.getElementById("viewHistoryButton");
const inputText = document.getElementById("inputText");
const displayText = document.getElementById("displayText");
const timeLeft = document.getElementById("timeLeft");
const wpm = document.getElementById("wpm");
const accuracy = document.getElementById("accuracy");
const timerSelect = document.getElementById("timer");
const testDiv = document.getElementById("test");
const resultDiv = document.getElementById("result-page");
const homePage = document.getElementById("home-page");
const typingPage = document.getElementById("typing-page");

function showTypingPage() {
  homePage.classList.add("hidden");
  typingPage.classList.remove("hidden");
}

function showResultPage(wpmResult, accuracyResult) {
  typingPage.classList.add("hidden");
  resultDiv.classList.remove("hidden");
  document.getElementById("finalWpm").textContent = wpmResult;
  document.getElementById("finalAccuracy").textContent = accuracyResult + "%";
  
  saveTestHistory(wpmResult, accuracyResult);
}

function saveTestHistory(wpmResult, accuracyResult) {
  let testHistory = JSON.parse(localStorage.getItem("testHistory")) || [];
  testHistory.push({ wpm: wpmResult, accuracy: accuracyResult });
  localStorage.setItem("testHistory", JSON.stringify(testHistory));
}

function startTest() {
  const duration = parseInt(timerSelect.value, 10) * 60;
  totalChars = 0;
  errors = 0;
  startTime = new Date().getTime();
  inputText.disabled = false;
  inputText.focus();
  inputText.value = "";
  wpm.textContent = "0";
  accuracy.textContent = "100%";
  testDiv.classList.remove("hidden");
  startTimer(duration);
}

function startTimer(duration) {
  let timeRemaining = duration;
  timeLeft.textContent = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`;
  
  timerInterval = setInterval(() => {
    timeRemaining -= 1;
    timeLeft.textContent = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

function endTest() {
  inputText.disabled = true;
  const finalWPM = calculateWPM();
  const finalAccuracy = calculateAccuracy();
  showResultPage(finalWPM, finalAccuracy);
}

function calculateWPM() {
  const elapsedMinutes = (new Date().getTime() - startTime) / 60000;
  const words = totalChars / 5;
  return Math.round(words / elapsedMinutes);
}

function calculateAccuracy() {
  return Math.round(((totalChars - errors) / totalChars) * 100) || 0;
}

function updateStats() {
  const typedText = inputText.value;
  const originalText = displayText.textContent;
  totalChars = typedText.length;
  errors = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] !== originalText[i]) {
      errors++;
    }
  }

  wpm.textContent = calculateWPM();
  accuracy.textContent = `${calculateAccuracy()}%`;
}

function showTestHistory() {
  const history = JSON.parse(localStorage.getItem("testHistory")) || [];
  alert("Test History:\n" + history.map(item => `WPM: ${item.wpm}, Accuracy: ${item.accuracy}%`).join("\n"));
}

startButton.addEventListener("click", showTypingPage);
startTestButton.addEventListener("click", startTest);
retryButton.addEventListener("click", () => location.reload());
inputText.addEventListener("input", updateStats);
viewHistoryButton.addEventListener("click", showTestHistory);

function updateBackground(progress) {
    document.body.style.background = `linear-gradient(135deg, #4e02db ${progress}%, #1a4beb)`;
}
timerInterval = setInterval(() => {
    timeRemaining -= 1;
    const progress = (timeRemaining / duration) * 100;
    updateBackground(progress);
    // Other timer logic
}, 1000);
const toggleThemeButton = document.getElementById("themeToggle");
toggleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});
function playSound(type) {
    const audio = new Audio(type === 'success' ? 'success.mp3' : 'typing.mp3');
    audio.play();
}
inputText.addEventListener('input', () => playSound('typing'));

function updateProgressBar() {
    const progress = (inputText.value.length / displayText.textContent.length) * 100;
    document.getElementById("progress").style.width = `${progress}%`;
}
inputText.addEventListener("input", updateProgressBar);




