const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const INITIAL_STATE = {
  coins: 0,
  stamina: 10,
  catMood: 80,
  selectedCat: 'zero',
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

const STORAGE_KEY = 'churu-and-the-city-save-v1';

class GameState {
  constructor() {
    this.state = this._loadFromStorage();
    this._timersStarted = false;
    this._game = null;
    this._staminaTimer = null;
    this._moodTimer = null;
  }

  initRegistry(scene) {
    Object.entries(this.state).forEach(([key, value]) => {
      scene.registry.set(key, value);
    });
  }

  get(scene, key) {
    const value = scene.registry.get(key);
    return value === undefined ? this.state[key] : value;
  }

  set(scene, key, value) {
    this.state[key] = value;
    scene.registry.set(key, value);
    this._save();
    scene.game.events.emit('state:changed', { key, value, snapshot: { ...this.state } });
  }

  getActiveScene() {
    if (!this._game) return null;
    const activeScenes = this._game.scene.getScenes(true);
    if (!activeScenes.length) return null;

    return activeScenes.find((s) => s.scene.key === 'HomeScene') || activeScenes[0];
  }

  setWithActiveScene(key, value) {
    const activeScene = this.getActiveScene();
    if (!activeScene) return;
    this.set(activeScene, key, value);
  }

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

  recoverStamina(scene, amount = 1) {
    const next = clamp(this.get(scene, 'stamina') + amount, 0, 10);
    this.set(scene, 'stamina', next);
    return next;
  }

  adjustMood(scene, delta) {
    const next = clamp(this.get(scene, 'catMood') + delta, 0, 100);
    this.set(scene, 'catMood', next);

    if (next <= 0) {
      this.set(scene, 'coins', Math.max(0, this.get(scene, 'coins') - 100));
      this.set(scene, 'catMood', 30);
      scene.game.events.emit('game:alert', '⚠️ 스트레스성 병동 입원! 츄르값 100 차감');
    }

    return this.get(scene, 'catMood');
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

    this._staminaTimer = scene.time.addEvent({
      delay: 5 * 60 * 1000,
      loop: true,
      callback: () => {
        const activeScene = this.getActiveScene();
        if (!activeScene) return;
        const next = clamp(this.get(activeScene, 'stamina') + 1, 0, 10);
        this.setWithActiveScene('stamina', next);
      },
    });

    this._moodTimer = scene.time.addEvent({
      delay: 2 * 60 * 1000,
      loop: true,
      callback: () => {
        const activeScene = this.getActiveScene();
        if (!activeScene) return;
        const nextMood = clamp(this.get(activeScene, 'catMood') - 1, 0, 100);
        this.setWithActiveScene('catMood', nextMood);

        if (nextMood <= 0) {
          const nextCoins = Math.max(0, this.get(activeScene, 'coins') - 100);
          this.setWithActiveScene('coins', nextCoins);
          this.setWithActiveScene('catMood', 30);
          this._game.events.emit('game:alert', '⚠️ 스트레스성 병동 입원! 츄르값 100 차감');
        }
      },
    });
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (_) {
      // ignore storage failures in restricted environments
    }
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(INITIAL_STATE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(INITIAL_STATE),
        ...parsed,
        equipped: {
          ...INITIAL_STATE.equipped,
          ...(parsed?.equipped || {}),
        },
      };
    } catch (_) {
      return structuredClone(INITIAL_STATE);
    }
  }
}

export default new GameState();
