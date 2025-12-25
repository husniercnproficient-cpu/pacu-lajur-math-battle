// ================= MENU =================
const hamburger = document.getElementById("hamburger");
const menuItems = document.getElementById("menuItems");


document.getElementById("menuHome").onclick = () => location.href = "index.html";
document.getElementById("menuSettings").onclick = () => location.href = "setting.html";
document.getElementById("menuRefresh").onclick = () => resetGame();

hamburger.onclick = () => { menuItems.classList.toggle("show"); };

// ================= ELEMENT =================
const car1 = document.getElementById("car1"); // human
const car2 = document.getElementById("car2"); // AI
const track = document.getElementById("track");
const questionCenter = document.getElementById("questionCenter");
const choicesRed = document.getElementById("choicesRed");
const choicesBlue = document.getElementById("choicesBlue");
const winOverlay = document.getElementById("winOverlay");
const winnerText = document.getElementById("winnerText");
const btnRestart = document.getElementById("btnRestart");
const winSound = document.getElementById("winSound");
const splashSound = document.getElementById("splashSound");

// ================= FIREWORKS =================
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener("resize", resizeCanvas); resizeCanvas();

let particles=[]; let fireworksRunning=false;
function createFirework(x,y){ for(let i=0;i<60;i++){ particles.push({x,y,vx:(Math.random()-0.5)*7,vy:(Math.random()-0.5)*7,life:60,color:`hsl(${Math.random()*360},100%,60%)`}); } }
function createSplash(x,y){ for(let i=0;i<5;i++){ particles.push({x,y,vx:(Math.random()-0.5)*4,vy:Math.random()*-3,life:20,color:"rgba(255,255,255,0.8)"}); } }
function animateFireworks(){ if(!fireworksRunning) return; ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,0,canvas.width,canvas.height);
for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.life--; ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill(); if(p.life<=0) particles.splice(i,1); }
if(fireworksRunning && Math.random()<0.1) createFirework(Math.random()*canvas.width,Math.random()*canvas.height*0.5);
requestAnimationFrame(animateFireworks); }
function startFireworks(){ fireworksRunning=true; animateFireworks(); }
function stopFireworks(){ fireworksRunning=false; particles=[]; ctx.clearRect(0,0,canvas.width,canvas.height); }

// ================= GAME VAR =================
let trackWidth = track.offsetWidth;
let step = trackWidth*0.08;
let finishLine = trackWidth-140;
let pos1=0,pos2=0;
let currentAnswer=0;
let gameOver=false;
let redAnswered=false,blueAnswered=false;
let aiTimeout = null; // simpan timeout AI

// ================= SETTINGS =================
const raceType = localStorage.getItem('raceType') || 'multiplication';
const difficulty = parseInt(localStorage.getItem('difficulty')) || 10;
const systemLevel = localStorage.getItem('systemLevel') || 'medium';

// ================= AI SETTINGS =================
function getAIChance(level){
  if(level==='beginner') return 0.5;
  if(level==='medium') return 0.7;
  if(level==='hard') return 0.9;
  return 0.7;
}

// ================= QUESTION =================
function generateQuestion(){
  let a,b;
  if(raceType==='multiplication'){ a=Math.ceil(Math.random()*difficulty); b=Math.ceil(Math.random()*difficulty); return {q:`${a} × ${b}`,a:a*b}; }
  else if(raceType==='addition'){ a=Math.ceil(Math.random()*difficulty); b=Math.ceil(Math.random()*difficulty); return {q:`${a} + ${b}`,a:a+b}; }
  else if(raceType==='subtraction'){ a=Math.ceil(Math.random()*difficulty); b=Math.ceil(Math.random()*a); return {q:`${a} - ${b}`,a:a-b}; }
  else if(raceType==='division'){ b=Math.ceil(Math.random()*difficulty); const c=Math.ceil(Math.random()*difficulty); a=b*c; return {q:`${a} ÷ ${b}`,a:c}; }
}

function showQuestion() {
  redAnswered = false;
  blueAnswered = false;

  const q = generateQuestion();
  currentAnswer = q.a;
  questionCenter.textContent = q.q;

  let answers = [q.a];
  while (answers.length < 3) {
    let r = Math.ceil(Math.random() * difficulty) * Math.ceil(Math.random() * difficulty);
    if (!answers.includes(r)) answers.push(r);
  }
  answers.sort(() => Math.random() - 0.5);

  // kosongkan pilihan
  choicesRed.innerHTML = "";
  choicesBlue.innerHTML = "";

  answers.forEach(val => {
    choicesRed.appendChild(createBtn("red", val));
    choicesBlue.appendChild(createBtn("blue", val));
  });

  // ✅ Update label AI
  const aiLabel = document.getElementById("aiLabel");
  aiLabel.style.display = "block";  
  aiLabel.textContent = `AI: ${systemLevel.charAt(0).toUpperCase() + systemLevel.slice(1)}`;

  // AI jawab otomatis
  aiAnswer();
}






function createBtn(player,val){
  const btn=document.createElement("button");
  btn.className="choice-btn";
  btn.style.background=player;
  btn.textContent=val;
  btn.addEventListener("pointerdown",e=>{ e.preventDefault(); answer(player,val,btn); });
  return btn;
}

// ================= ANSWER =================
function answer(player,val,btn){
  if(gameOver) return;
  if(player==="red" && redAnswered) return;
  if(player==="blue" && blueAnswered) return;
  if(player==="red") redAnswered=true;
  if(player==="blue") blueAnswered=true;

  if(val===currentAnswer){
    if(player==="red"){ pos1+=step; car1.style.left=pos1+"px"; splashSound.currentTime=0; splashSound.play().catch(()=>{}); createSplash(pos1+20,car1.offsetTop+car1.offsetHeight); }
    else{ pos2+=step; car2.style.left=pos2+"px"; splashSound.currentTime=0; splashSound.play().catch(()=>{}); createSplash(pos2+20,car2.offsetTop+car2.offsetHeight); }
    setTimeout(checkFinishOrNext,200); return;
  }

  btn.style.opacity="0.4";
  if(redAnswered && blueAnswered) setTimeout(checkFinishOrNext,300);
}

// ================= AI LOGIC =================
function aiAnswer(){
  if(gameOver) return;
  const chance = getAIChance(systemLevel);
  const buttons = Array.from(choicesBlue.children);
  const correctBtn = buttons.find(b=>parseInt(b.textContent)===currentAnswer);
  const delay = 500 + Math.random()*500;

  aiTimeout = setTimeout(()=>{
    if(gameOver) return;
    if(Math.random()<=chance && correctBtn){ answer("blue",currentAnswer,correctBtn); }
    else{
      const wrongBtns = buttons.filter(b=>parseInt(b.textContent)!==currentAnswer);
      if(wrongBtns.length>0){
        const btn = wrongBtns[Math.floor(Math.random()*wrongBtns.length)];
        answer("blue",parseInt(btn.textContent),btn);
      }
    }
  },delay);
}

// ================= FINISH CHECK =================
function checkFinishOrNext(){
  if(gameOver) return;
  if(pos1>=finishLine && pos2>=finishLine){ finish("SERI"); return; }
  if(pos1>=finishLine){ finish("MERAH"); return; }
  if(pos2>=finishLine){ finish("BIRU"); return; }
  showQuestion();
}

// ================= FINISH =================
function finish(winner){
  if(gameOver) return;
  gameOver=true;

  if(aiTimeout){ clearTimeout(aiTimeout); aiTimeout=null; }

  questionCenter.style.display="none"; choicesRed.style.display="none"; choicesBlue.style.display="none"; hamburger.style.display="none";
  winOverlay.style.display="flex"; winnerText.style.display="block";

  if(winner==="SERI"){ winnerText.textContent="SERI"; winnerText.style.color="#ffffff"; }
  else{ winnerText.textContent=`${winner} MENANG!`; winnerText.style.color=(winner==="MERAH")?"#ff3b3b":"#2ea8ff"; }
  winSound.currentTime=0; winSound.play().catch(()=>{});
  startFireworks();
  btnRestart.style.display="block";
}

// ================= RESTART =================
btnRestart.onclick=()=>{
  winOverlay.style.display="none"; questionCenter.style.display="block";
  choicesRed.style.display="flex"; choicesBlue.style.display="flex"; hamburger.style.display="flex";
  stopFireworks(); winSound.pause(); winSound.currentTime=0;
  if(aiTimeout){ clearTimeout(aiTimeout); aiTimeout=null; }
  resetGame();
}

// ================= RESET =================
function resetGame(){
  gameOver=false; redAnswered=false; blueAnswered=false;
  pos1=0; pos2=0;
  car1.style.left="-3%"; car2.style.left="-3%";
  winnerText.style.display="none"; btnRestart.style.display="none";
  particles=[]; ctx.clearRect(0,0,canvas.width,canvas.height);


// Reset AI Label
  const aiLabel = document.getElementById("aiLabel");
  aiLabel.style.display = "block";  // pastikan muncul
  aiLabel.textContent = `AI: ${systemLevel.charAt(0).toUpperCase() + systemLevel.slice(1)}`;



  if(aiTimeout){ clearTimeout(aiTimeout); aiTimeout=null; }
  showQuestion();
}

// ================= ADMOB BANNER =================
function showAdBanner() {
    if (window.admob && admob.banner) {
        // Aktifkan test ads
        admob.banner.config({ testing: true });

        // Tampilkan banner
        admob.banner.show({
            id: 'ca-app-pub-3940256099942544/6300978111', // contoh test ID AdMob
            position: 'bottom',
            autoShow: true
        });
    }
}

// Jalankan AdMob saat device siap
document.addEventListener('deviceready', () => {
    showAdBanner();
});




// ================= START =================
showQuestion();

