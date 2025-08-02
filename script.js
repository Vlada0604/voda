let goal = 2000;
let reminderMinutes = 60;
let reminderIntervalId = null;

const waterAmountEl = document.getElementById("waterAmount");
const progressBar = document.getElementById("progressBar");
const historyList = document.getElementById("historyList");
const goalInput = document.getElementById("goalInput");
const addInput = document.getElementById("addInput");
const reminderInput = document.getElementById("reminderInput");

function getTodayKey() {
  const today = new Date();
  return "water-" + today.toISOString().split("T")[0];
}

function loadWater(key) {
  const saved = localStorage.getItem(key);
  return saved ? parseInt(saved) : 0;
}

function saveWater(key, amount) {
  localStorage.setItem(key, amount);
}

function updateUI(amount) {
  waterAmountEl.textContent = `${amount} мл`;
  const percent = Math.min((amount / goal) * 100, 100);
  progressBar.style.width = `${percent}%`;
}

function addWater() {
  const key = getTodayKey();
  let current = loadWater(key);
  const toAdd = parseInt(addInput.value) || 0;
  current += toAdd;
  saveWater(key, current);
  updateUI(current);
  updateHistory();
}

function applySettings() {
  goal = parseInt(goalInput.value) || 2000;
  reminderMinutes = parseInt(reminderInput.value) || 60;

  localStorage.setItem("daily-goal", goal);
  localStorage.setItem("reminder-minutes", reminderMinutes);

  if (reminderIntervalId) clearInterval(reminderIntervalId);
  reminderIntervalId = setInterval(() => {
    alert("🚰 Час випити води!");
  }, reminderMinutes * 60 * 1000);

  updateUI(loadWater(getTodayKey()));
}

function updateHistory() {
  historyList.innerHTML = "";
  const keys = Object.keys(localStorage)
    .filter(k => k.startsWith("water-"))
    .sort()
    .reverse();

  keys.forEach(k => {
    const value = localStorage.getItem(k);
    const date = k.replace("water-", "");
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<span>${date}</span><span>${value} мл</span>`;
    historyList.appendChild(div);
  });
}

function loadSettings() {
  const storedGoal = localStorage.getItem("daily-goal");
  const storedReminder = localStorage.getItem("reminder-minutes");

  if (storedGoal) {
    goal = parseInt(storedGoal);
    goalInput.value = goal;
  }

  if (storedReminder) {
    reminderMinutes = parseInt(storedReminder);
    reminderInput.value = reminderMinutes;
  }

  if (reminderIntervalId) clearInterval(reminderIntervalId);
  reminderIntervalId = setInterval(() => {
    alert("💧 Час випити води!");
  }, reminderMinutes * 60 * 1000);
}

window.onload = () => {
  loadSettings();
  const key = getTodayKey();
  const current = loadWater(key);
  updateUI(current);
  updateHistory();
};
