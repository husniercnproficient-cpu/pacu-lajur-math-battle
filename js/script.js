// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const menuItems = document.getElementById('menuItems');
hamburger.addEventListener('click', ()=>{
    menuItems.style.display = (menuItems.style.display==='flex') ? 'none' : 'flex';
});

// Menu item actions
document.getElementById('menuHome').addEventListener('click', ()=>{ window.location.href='index.html'; });
document.getElementById('menuRefresh').addEventListener('click', ()=>{
    pos1=0; pos2=0; car1.style.left='-3%'; car2.style.left='-3%';
    currentQuestion = generateQuestion();
    showQuestion();
    menuItems.style.display='none';
});
document.getElementById('menuSettings').addEventListener('click', ()=>{ window.location.href='setting.html'; });

// ====== Game Script =======
let pos1=0, pos2=0;
let trackWidth=document.getElementById('track').offsetWidth;
const step=trackWidth*0.08;

let car1=document.getElementById('car1');
let car2=document.getElementById('car2');
let questionCenter=document.getElementById('questionCenter');
let winnerText=document.getElementById('winnerText');

const choicesRed=document.getElementById('choicesRed');
const choicesBlue=document.getElementById('choicesBlue');

let answeredRed=false, answeredBlue=false;
let fastest='';

function generateQuestion(){
    let a=Math.ceil(Math.random()*10);
    let b=Math.ceil(Math.random()*10);
    return {question:`${a}×${b}`, answer: a*b};
}

let currentQuestion = generateQuestion();
showQuestion();

function createButton(player, ans){
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.className = 'choice-btn';
    btn.style.background = (player === 'red') ? 'red' : 'blue';
    btn.style.color = '#fff';
    btn.disabled = false;
    btn.addEventListener('touchstart', e => { e.preventDefault(); checkAnswer(player, ans, btn); });
    btn.addEventListener('mousedown', e => { e.preventDefault(); checkAnswer(player, ans, btn); });
    return btn;
}

function showQuestion(){
    questionCenter.textContent=`${currentQuestion.question}`;
    const answers=[currentQuestion.answer];
    while(answers.length<3){
        let wrong=Math.ceil(Math.random()*10)*Math.ceil(Math.random()*10);
        if(!answers.includes(wrong)) answers.push(wrong);
    }
    answers.sort(()=>Math.random()-0.5);

    choicesRed.innerHTML='';
    choicesBlue.innerHTML='';
    answers.forEach(ans=>{
        choicesRed.appendChild(createButton('red', ans));
        choicesBlue.appendChild(createButton('blue', ans));
    });

    answeredRed=false;
    answeredBlue=false;
    fastest='';
    winnerText.style.display='none';
    questionCenter.style.display='block';
}

function checkAnswer(player, ans, btn){
    if((player==='red' && answeredRed) || (player==='blue' && answeredBlue)) return;

    if(ans===currentQuestion.answer && !fastest) fastest=player;

    if(ans===currentQuestion.answer && fastest===player){
        if(player==='red'){ pos1+=step; car1.style.left=pos1+'px'; }
        if(player==='blue'){ pos2+=step; car2.style.left=pos2+'px'; }
    }

    btn.style.background=(player==='red')?'darkred':'darkblue';

    if(ans!==currentQuestion.answer){
        const parent = (player==='red')?choicesRed:choicesBlue;
        Array.from(parent.children).forEach(b => { 
            b.disabled = true; 
            if(b!==btn) b.style.opacity = 0.6; 
        });
        btn.style.opacity = 0.3;
    } else {
        btn.style.background = (player==='red') ? 'darkred' : 'darkblue';
    }

    if(player==='red') answeredRed=true;
    if(player==='blue') answeredBlue=true;

    if(fastest || (answeredRed && answeredBlue && fastest==='')){
        setTimeout(()=>{
            if(pos1>=trackWidth-140){ endGame('Merah'); return; }
            if(pos2>=trackWidth-140){ endGame('Biru'); return; }
            currentQuestion = generateQuestion();
            showQuestion();
        },150);
    }
}

function endGame(winner){
    winnerText.textContent=`${winner} Menang!`;
    winnerText.style.display='block';
    questionCenter.style.display='none';
    choicesRed.innerHTML='';
    choicesBlue.innerHTML='';
    startFireworks();
}

window.addEventListener('resize', ()=>{ trackWidth=document.getElementById('track').offsetWidth; });

// Fireworks
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function startFireworks(){
    particles=[];
    for(let i=0;i<100;i++){
        particles.push({
            x: window.innerWidth/2,
            y: window.innerHeight/2,
            vx:(Math.random()-0.5)*6,
            vy:(Math.random()-0.5)*6,
            alpha:1,
            color:`hsl(${Math.random()*360},100%,50%)`,
        });
    }
    animateFireworks();
}

function animateFireworks(){
    ctx.fillStyle='rgba(0,0,0,0.2)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        p.x+=p.vx;
        p.y+=p.vy;
        p.vy+=0.05; // gravity
        p.alpha-=0.01;
        ctx.fillStyle=p.color;
        ctx.globalAlpha=p.alpha;
        ctx.beginPath();
        ctx.arc(p.x,p.y,3,0,2*Math.PI);
        ctx.fill();
    });

    particles = particles.filter(p=>p.alpha>0);
    if(particles.length>0) requestAnimationFrame(animateFireworks);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
}
