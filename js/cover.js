// SOUND EFFECT
const clickSound = new Audio('sounds/click.mp3');
clickSound.volume = 0.4;

// BACKGROUND MUSIC
const bgm = new Audio('sounds/bgm.mp3');
bgm.loop = true;
bgm.volume = 0.3;

// Mobile autoplay fix (harus ada interaksi user)
document.addEventListener('click', () => {
  if (bgm.paused) {
    bgm.play();
  }
}, { once: true });

function enterGame() {
  clickSound.play();

  // fade out before move page
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';

  setTimeout(() => {
    window.location.href = 'setting.html';
  }, 600);
}
