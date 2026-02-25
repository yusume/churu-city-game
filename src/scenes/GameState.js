const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const INITIAL_STATE = {
  butlerName: '',     // 집사명
  catName: '',        // 고양이 이름
  catType: 'zero',    // 'zero' (턱시도형) or 'suga' (셀커크랙스형)
  catColor: 'black',  // 색상
  coins: 0,
  stamina: 10,
  catMood: 80,
  equipped: {
    background: 'bg_office',
    tail: 'tail_default',
    body: 'body_tuxedo',
    coat: 'coat_white_chest',
    clothes: 'clothes_none',
    accessories: 'acc_none',
    expression: 'exp_neutral',
  },
};

const STORAGE_KEY = 'churu-and-the-city-save-v2'; // 버전 업!

class GameState {
  constructor() {
    this.state = this._loadFromStorage();
    this._timersStarted = false;
    this._game = null;
  }

  // ... (기존 initRegistry, get, set, getActiveScene, setWithActiveScene 등 유지)
  initRegistry(scene) {
    Object.entries(this.state).forEach(([key, value]) => scene.registry.set(key, value));
  }
  get(scene, key) {
    const value = scene.registry.get(key);
    return value === undefined ? this.state[key] : value;
  }
  set(scene, key, value) {
    this.state[key] = value;
    scene.registry.set(key, value);
    this._save();
    scene.game.events.emit('state:changed', { key, value });
  }

  // ... (기존 addCoins, spendCoins, consumeStamina, adjustMood, feedSnack, startGlobalTimers 동일하게 유지)
  addCoins(scene, delta) {
    const nextCoins = Math.max(0, this.get(scene, 'coins') + delta);
    this.set(scene, 'coins', nextCoins);
    return nextCoins;
  }
  spendCoins(scene, amount) {
    const current = this.get(scene, 'coins');
    if (current < amount) return false;
    this.set(scene, 'coins', current - amount);
    return true;
  }
  consumeStamina(scene, amount = 1) {
    const current = this.get(scene, 'stamina');
    if (current < amount) return false;
    this.set(scene, 'stamina', current - amount);
    return true;
  }
  adjustMood(scene, delta) {
    const next = clamp(this.get(scene, 'catMood') + delta, 0, 100);
    this.set(scene, 'catMood', next);
    return next;
  }
  feedSnack(scene, snackCost = 30, moodGain = 20) {
    if (!this.spendCoins(scene, snackCost)) return false;
    this.adjustMood(scene, moodGain);
    return true;
  }

  startGlobalTimers(scene) {
    if (this._timersStarted) return;
    this._timersStarted = true;
    this._game = scene.game;

    scene.time.addEvent({
      delay: 5 * 60 * 1000, loop: true,
      callback: () => {
        const activeScene = this.getActiveScene();
        if (activeScene) this.setWithActiveScene('stamina', clamp(this.get(activeScene, 'stamina') + 1, 0, 10));
      },
    });

    scene.time.addEvent({
      delay: 2 * 60 * 1000, loop: true,
      callback: () => {
        const activeScene = this.getActiveScene();
        if (!activeScene) return;
        const nextMood = clamp(this.get(activeScene, 'catMood') - 1, 0, 100);
        this.setWithActiveScene('catMood', nextMood);
        if (nextMood <= 0) {
          this.setWithActiveScene('coins', Math.max(0, this.get(activeScene, 'coins') - 100));
          this.setWithActiveScene('catMood', 30);
          this._game.events.emit('game:alert', '⚠️ 스트레스성 병동 입원! 츄르값 100 차감');
        }
      },
    });
  }

  getActiveScene() {
    if (!this._game) return null;
    const activeScenes = this._game.scene.getScenes(true);
    return activeScenes.find((s) => s.scene.key === 'HomeScene') || activeScenes[0];
  }
  setWithActiveScene(key, value) {
    const activeScene = this.getActiveScene();
    if (activeScene) this.set(activeScene, key, value);
  }

  _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (_) {}
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(INITIAL_STATE);
      return { ...structuredClone(INITIAL_STATE), ...JSON.parse(raw) };
    } catch (_) { return structuredClone(INITIAL_STATE); }
  }
}

export default new GameState();