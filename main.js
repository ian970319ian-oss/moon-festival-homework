import { GameModel } from './game.js';

const game = new GameModel();

const scoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const levelTitleEl = document.getElementById('level-title');
const mooncakeIconEl = document.getElementById('mooncake-icon');
const mooncakeBtn = document.getElementById('mooncake-btn');
const nextLevelReqEl = document.getElementById('next-level-req');
const progressFillEl = document.getElementById('progress-fill');
const fullscreenOverlay = document.getElementById('fullscreen-overlay');
const overlayContent = document.getElementById('overlay-content');

function updateUI() {
  scoreEl.textContent = game.score;
  highScoreEl.textContent = game.highScore;

  const currentLevel = game.checkEvolution().currentLevel;
  levelTitleEl.textContent = currentLevel.title;
  mooncakeIconEl.textContent = currentLevel.icon;

  const nextInfo = game.getNextLevelInfo();
  if (nextInfo.isMax) {
    nextLevelReqEl.textContent = '已達最高等級！';
    progressFillEl.style.width = '100%';
  } else {
    nextLevelReqEl.textContent = `${nextInfo.req} 次`;
    progressFillEl.style.width = `${nextInfo.percent}%`;
  }
}

// 產生點擊 +1 浮動文字
function showFloatText(x, y, text, color = '#fca311') {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.color = color;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// 滿版粒子爆發
function spawnSparkles(count = 30) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';
    particle.textContent = ['✨', '⭐', '🌕', '🎉'][Math.floor(Math.random() * 4)];
    
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 350 + 100;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
    particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}px`);
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// 觸發全螢幕 Overlay
function triggerOverlay(htmlContent, duration = 2200) {
  overlayContent.innerHTML = htmlContent;
  fullscreenOverlay.classList.remove('hidden');
  setTimeout(() => fullscreenOverlay.classList.add('active'), 10);

  setTimeout(() => {
    fullscreenOverlay.classList.remove('active');
    setTimeout(() => fullscreenOverlay.classList.add('hidden'), 300);
  }, duration);
}

// 點擊事件
mooncakeBtn.addEventListener('click', (e) => {
  const { evolved, currentLevel, specialEvent } = game.addPoint(1);

  // 1. 噴出 +1 浮動數字
  showFloatText(e.clientX, e.clientY - 20, '+1');

  // 2. 進化動畫觸發
  if (evolved) {
    mooncakeBtn.classList.add('evolve-anim');
    setTimeout(() => mooncakeBtn.classList.remove('evolve-anim'), 700);
  }

  // 3. 大招判定：300 次嫦娥 / 100 次玉兔
  if (specialEvent === 'GOD_EVENT') {
    spawnSparkles(60);
    triggerOverlay(`
      <div class="god-sky-super">
        <div class="fairy-fly-super">🧚‍♀️✨</div>
        <div class="god-text-super">🎉 突破 ${game.score} 連擊！<br/>嫦娥賜福 · 中秋大吉！</div>
      </div>
    `, 2800);
  } 
  else if (specialEvent === 'RABBIT_EVENT') {
    spawnSparkles(40);
    triggerOverlay(`
      <div class="rabbit-sky-super">
        <div class="moon-giant-super">🌕</div>
        <div class="rabbit-fly-super">🐇💨</div>
        <div class="rabbit-text-super">🌕 達成 ${game.score} 連擊！<br/>超·玉兔奔月！</div>
      </div>
    `, 2400);
  } 
  // 4. 隨機食材彩蛋
  else {
    const egg = game.triggerEasterEgg();
    if (egg) {
      showFloatText(e.clientX + 30, e.clientY - 40, `${egg.icon} +${egg.bonus}`, '#ffb703');
      spawnSparkles(15);
      triggerOverlay(`
        <div class="egg-banner">
          <div class="egg-icon">${egg.icon}</div>
          <div class="egg-title">幸運獲得食材：${egg.name}！<br/>點數額外 +${egg.bonus}</div>
        </div>
      `, 1200);
    }
  }

  updateUI();
});

updateUI();