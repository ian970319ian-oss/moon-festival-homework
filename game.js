export const LEVELS = [
  { threshold: 0, title: 'LV 1：傳統蛋黃酥', icon: '🥮' },
  { threshold: 10, title: 'LV 2：廣式大月餅', icon: '🥮✨' },
  { threshold: 30, title: 'LV 3：冰皮月餅', icon: '🧊🥮' },
  { threshold: 50, title: 'LV 4：黃金神級月餅', icon: '🌕👑' }
];

export const EASTER_EGGS = [
  { name: '頂級文旦柚', icon: '🍊', bonus: 3 },
  { name: '多汁烤香腸', icon: '🍢', bonus: 3 },
  { name: '極品霜降烤肉', icon: '🥩', bonus: 5 }
];

export class GameModel {
  constructor() {
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('mooncake_high_score')) || 0;
    this.currentLevelIndex = 0;
  }

  addPoint(amount = 1) {
    this.score += amount;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('mooncake_high_score', this.highScore);
    }

    const specialEvent = this.checkMilestones(this.score);
    const { evolved, currentLevel } = this.checkEvolution();

    return { evolved, currentLevel, specialEvent };
  }

  checkMilestones(score) {
    if (score > 0 && score % 300 === 0) {
      return 'GOD_EVENT';
    }
    if (score > 0 && score % 100 === 0) {
      return 'RABBIT_EVENT';
    }
    return null;
  }

  checkEvolution() {
    let newLevelIndex = this.currentLevelIndex;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (this.score >= LEVELS[i].threshold) {
        newLevelIndex = i;
        break;
      }
    }
    const evolved = newLevelIndex > this.currentLevelIndex;
    this.currentLevelIndex = newLevelIndex;
    return { evolved, currentLevel: LEVELS[this.currentLevelIndex] };
  }

  triggerEasterEgg() {
    if (Math.random() < 0.05) {
      const egg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
      this.score += egg.bonus;
      return egg;
    }
    return null;
  }

  getNextLevelInfo() {
    const nextLevel = LEVELS[this.currentLevelIndex + 1];
    if (!nextLevel) return { isMax: true, req: 0, percent: 100 };
    const currentThreshold = LEVELS[this.currentLevelIndex].threshold;
    const req = nextLevel.threshold - this.score;
    const totalNeeded = nextLevel.threshold - currentThreshold;
    const percent = Math.min(100, Math.max(0, ((this.score - currentThreshold) / totalNeeded) * 100));
    return { isMax: false, req, percent };
  }
}