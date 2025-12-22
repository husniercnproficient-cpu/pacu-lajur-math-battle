const hamburger = document.getElementById('hamburger');
const menuItems = document.getElementById('menuItems');

hamburger.onclick = () => {
    menuItems.style.display = menuItems.style.display === 'flex' ? 'none' : 'flex';
};

document.getElementById('menuHome').onclick = () => location.href = 'index.html';
document.getElementById('menuSettings').onclick = () => location.href = 'setting.html';

let car1 = document.getElementById('car1');
let car2 = document.getElementById('car2');
let trackWidth = document.getElementById('track').offsetWidth;
let step = trackWidth * 0.08;

let pos1 = 0, pos2 = 0;
let currentQuestion;

const questionCenter = document.getElementById('questionCenter');
const choicesRed = document.getElementById('choicesRed');
const choicesBlue = document.getElementById('choicesBlue');
const winnerText = document.getElementById('winnerText');

function generateQuestion() {
    let a = Math.ceil(Math.random() * 10);
    let b = Math.ceil(Math.random() * 10);
	return { q: `${a} x ${b}`, a: a * b };
}

function showQuestion() {
    currentQuestion = generateQuestion();
    questionCenter.textContent = currentQuestion.q;

    const answers = [currentQuestion.a];
    while (answers.length < 3) {
        let r = Math.ceil(Math.random() * 10) * Math.ceil(Math.random() * 10);
        if (!answers.includes(r)) answers.push(r);
    }

    answers.sort(() => Math.random() - 0.5);
    choicesRed.innerHTML = '';
    choicesBlue.innerHTML = '';

    answers.forEach(a => {
        choicesRed.appendChild(createBtn('red', a));
        choicesBlue.appendChild(createBtn('blue', a));
    });
}

function createBtn(player, val) {
    const b = document.createElement('button');
    b.className = 'choice-btn';
    b.style.background = player;
    b.textContent = val;
    b.onclick = () => check(player, val);
    return b;
}

function check(player, val) {
    if (val === currentQuestion.a) {
        if (player === 'red') { pos1 += step; car1.style.left = pos1 + 'px'; }
        else { pos2 += step; car2.style.left = pos2 + 'px'; }
    }

    if (pos1 >= trackWidth - 140) return finish('Merah');
    if (pos2 >= trackWidth - 140) return finish('Biru');

    showQuestion();
}

function finish(winner) {
    winnerText.textContent = `${winner} Menang!`;
    winnerText.style.display = 'block';
    choicesRed.innerHTML = '';
    choicesBlue.innerHTML = '';
}

showQuestion();
