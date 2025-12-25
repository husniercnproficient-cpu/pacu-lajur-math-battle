const opponentSelect = document.getElementById('opponent');
const systemLevelContainer = document.getElementById('system-level-container');
const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('startGameBtn');

/* Generate level 1 - 10 */
for (let i = 1; i <= 10; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = i;
  difficultySelect.appendChild(opt);
}

/* Set default values */
difficultySelect.value = "10";    // default level 10
opponentSelect.value = "friend";  // default lawan Teman


/* Initial AI level visibility */
systemLevelContainer.style.display =
  opponentSelect.value === 'ai' ? 'block' : 'none';

/* Toggle AI level container */
opponentSelect.addEventListener('change', () => {
  systemLevelContainer.style.display =
    opponentSelect.value === 'ai' ? 'block' : 'none';
});

/* Start Game */
startBtn.addEventListener('click', () => {
  const data = {
    raceType: document.getElementById('race-type').value,
    difficulty: parseInt(difficultySelect.value), // angka
    opponent: opponentSelect.value,
    systemLevel: document.getElementById('system-level').value
  };

  // simpan pengaturan umum
  localStorage.setItem('raceType', data.raceType);
  localStorage.setItem('difficulty', data.difficulty);
  localStorage.setItem('opponent', data.opponent);

  if (data.opponent === 'ai') {
    localStorage.setItem('systemLevel', data.systemLevel);
    // redirect ke halaman AI
    window.location.href = 'pacu_jalur_ai.html';
  } else {
    localStorage.removeItem('systemLevel');
    // redirect ke halaman Human
    window.location.href = 'pacu_jalur_human.html';
  }
});
