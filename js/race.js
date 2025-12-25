/* ================= MENU ================= */
const hamburger = document.getElementById("hamburger");
const menuItems = document.getElementById("menuItems");

document.getElementById("menuHome").onclick = () => location.href = "index.html";
document.getElementById("menuSettings").onclick = () => location.href = "setting.html";
document.getElementById("menuRefresh").onclick = () => resetGame();

hamburger.onclick = () => {
  menuItems.classList.toggle("show");
};

/* ================= ELEMENT ================= */
const car1 = document.getElementById("car1");
const car2 = document.getElementById("car2");
const track = document.getElementById("track");

const questionCenter = document.getElementById("questionCenter");
const choicesRed = document.getElementById("choicesRed");
const choicesBlue = document.getElementById("choicesBlue");

const winOverlay = document.getElementById("winOverlay");
const winnerText = document.getElementById("winnerText");
const btnRestart = document.getElementById("btnRestart");
const winSound = document.getElementById("winSound");

/* ================= FIREWORKS ================= */
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];
let fireworksRunning = false;

function createFirework(x, y) {
  for (let i = 0; i < 60; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() - 0.5) * 7,
      life: 60,
      color: `hsl(${Math.random() * 360},100%,60%)`
    });
  }
}

function animateFireworks() {
  if (!fireworksRunning) return;

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  }

  if (fireworksRunning && Math.random() < 0.1) {
    createFirework(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.5
    );
  }

  requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  fireworksRunning = true;
  animateFireworks();
}

function stopFireworks() {
  fireworksRunning = false;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ================= GAME VAR ================= */
let trackWidth = track.offsetWidth;
let step = trackWidth * 0.08;
let finishLine = trackWidth - 140;

let pos1 = 0;
let pos2 = 0;
let currentAnswer = 0;
let gameOver = false;

let redAnswered = false;
let blueAnswered = false;

/* ================= QUESTION ================= */
function generateQuestion() {
  const a = Math.ceil(Math.random() * 10);
  const b = Math.ceil(Math.random() * 10);
  return { q: `${a} × ${b}`, a: a * b };
}

function showQuestion() {
  redAnswered = false;
  blueAnswered = false;

  const q = generateQuestion();
  currentAnswer = q.a;
  questionCenter.textContent = q.q;

  let answers = [q.a];
  while (answers.length < 3) {
    let r = Math.ceil(Math.random() * 10) * Math.ceil(Math.random() * 10);
    if (!answers.includes(r)) answers.push(r);
  }
  answers.sort(() => Math.random() - 0.5);

  choicesRed.innerHTML = "";
  choicesBlue.innerHTML = "";

  answers.forEach(val => {
    choicesRed.appendChild(createBtn("red", val));
    choicesBlue.appendChild(createBtn("blue", val));
  });
}

function createBtn(player, val) {
  const btn = document.createElement("button");
  btn.className = "choice-btn";
  btn.style.background = player;
  btn.textContent = val;

  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    answer(player, val, btn);
  });

  return btn;
}

/* ================= ANSWER ================= */
function answer(player, val, btn) {
  if (gameOver) return;

  if (player === "red" && redAnswered) return;
  if (player === "blue" && blueAnswered) return;

  if (player === "red") redAnswered = true;
  if (player === "blue") blueAnswered = true;

  if (val === currentAnswer) {
    if (player === "red") {
      pos1 += step;
      car1.style.left = pos1 + "px";
    } else {
      pos2 += step;
      car2.style.left = pos2 + "px";
    }
    setTimeout(checkFinishOrNext, 200);
    return;
  }

  btn.style.opacity = "0.4";

  if (redAnswered && blueAnswered) {
    setTimeout(checkFinishOrNext, 300);
  }
}

/* ================= FINISH CHECK ================= */
function checkFinishOrNext() {
  if (gameOver) return;

  if (pos1 >= finishLine && pos2 >= finishLine) {
    finish("SERI");
    return;
  }
  if (pos1 >= finishLine) {
    finish("MERAH");
    return;
  }
  if (pos2 >= finishLine) {
    finish("BIRU");
    return;
  }

  showQuestion();
}

/* ================= FINISH ================= */
function finish(winner) {
  if (gameOver) return;
  gameOver = true;

  // sembunyikan UI lain
  questionCenter.style.display = "none";
  choicesRed.style.display = "none";
  choicesBlue.style.display = "none";
  hamburger.style.display = "none";

  // overlay
  winOverlay.style.display = "flex";

  // winner text
  winnerText.textContent = `${winner} MENANG!`;
  winnerText.style.display = "block";
  if (winner === "MERAH") winnerText.style.color = "#ff3b3b";
  else if (winner === "BIRU") winnerText.style.color = "#2ea8ff";
  else winnerText.style.color = "#ffd700";

  // play sound
  winSound.currentTime = 0;
  winSound.play().catch(()=>{});

  // start fireworks
  startFireworks();

  // show restart button
  btnRestart.style.display = "block";
}

/* ================= RESTART ================= */
btnRestart.onclick = () => {
  winOverlay.style.display = "none";
  questionCenter.style.display = "block";
  choicesRed.style.display = "flex";
  choicesBlue.style.display = "flex";
  hamburger.style.display = "flex";

  stopFireworks();
  resetGame();
};

/* ================= RESET ================= */
function resetGame() {
  gameOver = false;
  redAnswered = false;
  blueAnswered = false;

  pos1 = 0;
  pos2 = 0;
  car1.style.left = "-3%";
  car2.style.left = "-3%";

  winnerText.style.display = "none";
  btnRestart.style.display = "none";

  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  showQuestion();
}

/* ================= START ================= */
showQuestion();
