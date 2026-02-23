import Phaser from 'phaser';
import gameState from '../utils/GameState';

const W = 390;
const H = 844;

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
    this.uiTexts = {};
  }

  create() {
    gameState.startGlobalTimers(this);

    this._drawBackground();
    this._drawWindowFrames();
    this._drawCushion();
    this._drawCatZero();
    this._drawCatSuga();
    this._drawFloatingCoins();
    this._drawTitle();
    this._drawStartButton();
    this._drawSubButtons();
    this._drawHud();

    this.updateHud();
    this.game.events.on('state:changed', this.updateHud, this);
    this.game.events.on('game:alert', this.showToast, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  // ── 1. 배경 ───────────────────────────────────────────
  _drawBackground() {
    const g = this.add.graphics();
    // 딥 퍼플 그라데이션 배경
    g.fillGradientStyle(0x1a0933, 0x1a0933, 0x2d1260, 0x2d1260, 1);
    g.fillRect(0, 0, W, H);

    // 상단 미묘한 광원
    g.fillStyle(0x4a1e8a, 0.3);
    g.fillEllipse(W / 2, -40, 340, 200);

    // 바닥 그림자
    g.fillStyle(0x0a0520, 0.5);
    g.fillEllipse(W / 2, H - 60, 320, 80);
  }

  // ── 2. 두 개의 창문 프레임 ─────────────────────────────
  _drawWindowFrames() {
    const g = this.add.graphics();

    // 왼쪽 창 (지하철 내부 - 밝은 느낌)
    const lx = 18, ly = 120, lw = 162, lh = 340;
    g.fillStyle(0xd4c5a9, 1);
    g.fillRoundedRect(lx, ly, lw, lh, { tl: 18, tr: 0, bl: 0, br: 0 });

    // 왼쪽 창 내부 (지하철 배경)
    g.fillStyle(0xe8dcc8, 1);
    g.fillRoundedRect(lx + 6, ly + 6, lw - 12, lh - 12, { tl: 14, tr: 0, bl: 0, br: 0 });

    // 지하철 내부 디테일 (사람 실루엣들)
    g.fillStyle(0xb0a090, 0.6);
    // 손잡이 봉
    g.fillRect(lx + 20, ly + 12, 3, lh - 30);
    g.fillRect(lx + 55, ly + 12, 3, lh - 30);
    g.fillRect(lx + 90, ly + 12, 3, lh - 30);
    g.fillRect(lx + 125, ly + 12, 3, lh - 30);
    // 손잡이 링
    [lx + 20, lx + 55, lx + 90, lx + 125].forEach(hx => {
      g.fillStyle(0x998878, 0.7);
      g.fillEllipse(hx + 1, ly + 28, 14, 10);
    });
    // 사람 실루엣
    g.fillStyle(0x9a8f80, 0.5);
    g.fillEllipse(lx + 35, ly + 200, 28, 36); // 몸
    g.fillCircle(lx + 35, ly + 178, 13);       // 머리
    g.fillEllipse(lx + 95, ly + 210, 26, 32);
    g.fillCircle(lx + 95, ly + 189, 12);
    g.fillEllipse(lx + 130, ly + 205, 24, 30);
    g.fillCircle(lx + 130, ly + 185, 11);

    // 오른쪽 창 (야경 - 어두운 느낌)
    const rx = W - 18 - 162, ry = 120, rw = 162, rh = 340;
    g.fillStyle(0x1a2a50, 1);
    g.fillRoundedRect(rx, ry, rw, rh, { tl: 0, tr: 18, bl: 0, br: 0 });

    // 밤하늘
    g.fillStyle(0x0d1a3a, 1);
    g.fillRoundedRect(rx + 6, ry + 6, rw - 12, rh - 12, { tl: 0, tr: 14, bl: 0, br: 0 });

    // 별
    const stars = [
      [rx + 20, ry + 30], [rx + 45, ry + 18], [rx + 80, ry + 42],
      [rx + 110, ry + 25], [rx + 140, ry + 15], [rx + 35, ry + 60],
      [rx + 120, ry + 55], [rx + 65, ry + 10],
    ];
    stars.forEach(([sx, sy]) => {
      g.fillStyle(0xffffff, Math.random() * 0.5 + 0.5);
      g.fillCircle(sx, sy, 1.5);
    });

    // 빌딩 실루엣
    const buildings = [
      { x: rx + 8,   w: 28, h: 160 },
      { x: rx + 40,  w: 20, h: 200 },
      { x: rx + 64,  w: 35, h: 140 },
      { x: rx + 103, w: 25, h: 180 },
      { x: rx + 132, w: 22, h: 120 },
    ];
    buildings.forEach(b => {
      g.fillStyle(0x1e3060, 1);
      g.fillRect(b.x, ry + rh - b.h - 6, b.w, b.h);
      // 빌딩 창문
      g.fillStyle(0xf5c842, 0.7);
      for (let wy = ry + rh - b.h; wy < ry + rh - 20; wy += 14) {
        for (let wx = b.x + 3; wx < b.x + b.w - 4; wx += 9) {
          if (Math.random() > 0.35) g.fillRect(wx, wy, 5, 6);
        }
      }
    });

    // 창문 프레임 테두리 (나무 느낌)
    g.lineStyle(8, 0x6b4e2a, 1);
    g.strokeRoundedRect(lx, ly, lw, lh, { tl: 18, tr: 0, bl: 0, br: 0 });
    g.strokeRoundedRect(rx, ry, rw, rh, { tl: 0, tr: 18, bl: 0, br: 0 });

    // 가운데 세로 프레임 바
    g.fillStyle(0x6b4e2a, 1);
    g.fillRect(W / 2 - 5, ly, 10, lh);

    // 창문 상단 곡선 아치
    g.fillStyle(0x6b4e2a, 1);
    g.fillRect(lx, ly, W - lx * 2, 10);
  }

  // ── 3. 쿠션/왕좌 ──────────────────────────────────────
  _drawCushion() {
    const g = this.add.graphics();
    const cy = 490;

    // 쿠션 그림자
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(W / 2, cy + 52, 310, 30);

    // 쿠션 본체 (벨벳 퍼플)
    g.fillStyle(0x4a2070, 1);
    g.fillEllipse(W / 2, cy + 20, 320, 70);

    // 쿠션 상단면
    g.fillStyle(0x5c2a88, 1);
    g.fillEllipse(W / 2, cy, 320, 55);

    // 쿠션 하이라이트
    g.fillStyle(0x7a3ab0, 0.5);
    g.fillEllipse(W / 2 - 30, cy - 8, 200, 28);

    // 쿠션 테두리 골드
    g.lineStyle(3, 0xd4a017, 1);
    g.strokeEllipse(W / 2, cy, 320, 55);

    // 쿠션 술 장식 (하단)
    for (let i = 0; i < 8; i++) {
      const tx = 50 + i * 42;
      g.fillStyle(0xd4a017, 1);
      g.fillRect(tx, cy + 30, 4, 18);
      g.fillCircle(tx + 2, cy + 50, 4);
    }
  }

  // ── 4. 고양이 Zero (턱시도, 왼쪽) ─────────────────────
  _drawCatZero() {
    const g = this.add.graphics();
    const cx = 113, cy = 390;

    // ── 몸통 ──
    g.fillStyle(0x1a1a1a, 1);
    g.fillEllipse(cx, cy + 30, 110, 130); // 몸
    // 흰 가슴
    g.fillStyle(0xf0f0f0, 1);
    g.fillEllipse(cx, cy + 45, 48, 80);

    // ── 머리 ──
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(cx, cy - 30, 52);

    // 흰 얼굴 패치
    g.fillStyle(0xf0f0f0, 1);
    g.fillEllipse(cx, cy - 22, 52, 44);

    // ── 귀 ──
    g.fillStyle(0x1a1a1a, 1);
    g.fillTriangle(cx - 36, cy - 70, cx - 20, cy - 46, cx - 52, cy - 50);
    g.fillTriangle(cx + 36, cy - 70, cx + 20, cy - 46, cx + 52, cy - 50);
    g.fillStyle(0xff9999, 0.6);
    g.fillTriangle(cx - 34, cy - 67, cx - 22, cy - 50, cx - 46, cy - 52);
    g.fillTriangle(cx + 34, cy - 67, cx + 22, cy - 50, cx + 46, cy - 52);

    // ── 눈 (시크한 반쯤 감은 눈) ──
    g.fillStyle(0xf0c030, 1);
    g.fillEllipse(cx - 16, cy - 28, 18, 14);
    g.fillEllipse(cx + 16, cy - 28, 18, 14);
    g.fillStyle(0x1a1a1a, 1);
    g.fillEllipse(cx - 16, cy - 28, 9, 12);
    g.fillEllipse(cx + 16, cy - 28, 9, 12);
    // 눈꺼풀 (시크하게 반쯤)
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(cx - 26, cy - 34, 22, 6);
    g.fillRect(cx + 4,  cy - 34, 22, 6);

    // ── 코 / 입 ──
    g.fillStyle(0xff8899, 1);
    g.fillTriangle(cx - 4, cy - 16, cx + 4, cy - 16, cx, cy - 10);
    g.lineStyle(1.5, 0xcccccc, 1);
    g.beginPath(); g.moveTo(cx, cy - 10); g.lineTo(cx - 7, cy - 4); g.strokePath();
    g.beginPath(); g.moveTo(cx, cy - 10); g.lineTo(cx + 7, cy - 4); g.strokePath();

    // ── 수염 ──
    g.lineStyle(1.5, 0xffffff, 0.8);
    [[-42, -14], [-42, -8], [-42, -2]].forEach(([wx, wy]) => {
      g.lineBetween(cx + wx, cy + wy, cx - 14, cy - 8);
    });
    [[42, -14], [42, -8], [42, -2]].forEach(([wx, wy]) => {
      g.lineBetween(cx + wx, cy + wy, cx + 14, cy - 8);
    });

    // ── 왕관 ──
    this._drawCrown(cx, cy - 92, 0xffd700, 'big');

    // 이름 태그
    this.add.text(cx, cy + 108, 'Zero', {
      fontSize: '15px', color: '#f5d060', fontStyle: 'bold',
      stroke: '#1a0933', strokeThickness: 3,
    }).setOrigin(0.5);
  }

  // ── 5. 고양이 Suga (얼룩, 오른쪽) ─────────────────────
  _drawCatSuga() {
    const g = this.add.graphics();
    const cx = 277, cy = 400;

    // ── 몸통 ──
    g.fillStyle(0xf5f0e8, 1);
    g.fillEllipse(cx, cy + 25, 100, 120);
    // 몸통 무늬
    g.fillStyle(0x444444, 0.7);
    g.fillEllipse(cx + 20, cy + 10, 30, 50);
    g.fillEllipse(cx - 22, cy + 30, 20, 35);

    // ── 머리 ──
    g.fillStyle(0xf5f0e8, 1);
    g.fillCircle(cx, cy - 35, 48);
    // 머리 무늬
    g.fillStyle(0x444444, 0.65);
    g.fillEllipse(cx + 12, cy - 48, 28, 22);
    g.fillEllipse(cx - 8,  cy - 30, 18, 24);

    // ── 귀 ──
    g.fillStyle(0xf5f0e8, 1);
    g.fillTriangle(cx - 34, cy - 76, cx - 18, cy - 52, cx - 48, cy - 54);
    g.fillTriangle(cx + 34, cy - 76, cx + 18, cy - 52, cx + 48, cy - 54);
    g.fillStyle(0x444444, 0.5);
    g.fillTriangle(cx + 30, cy - 73, cx + 20, cy - 55, cx + 44, cy - 57);
    g.fillStyle(0xff9999, 0.5);
    g.fillTriangle(cx - 32, cy - 73, cx - 20, cy - 54, cx - 44, cy - 55);

    // ── 눈 (해맑게 동그란 눈) ──
    g.fillStyle(0x228844, 1);
    g.fillCircle(cx - 15, cy - 36, 9);
    g.fillCircle(cx + 15, cy - 36, 9);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - 15, cy - 36, 5);
    g.fillCircle(cx + 15, cy - 36, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - 12, cy - 39, 2.5);
    g.fillCircle(cx + 18, cy - 39, 2.5);

    // ── 코 / 입 ──
    g.fillStyle(0xff8899, 1);
    g.fillTriangle(cx - 4, cy - 22, cx + 4, cy - 22, cx, cy - 16);
    // 웃는 입
    g.lineStyle(2, 0x885566, 1);
    g.beginPath();
    g.arc(cx, cy - 10, 8, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160), false);
    g.strokePath();

    // ── 수염 ──
    g.lineStyle(1.5, 0x999999, 0.8);
    [[-40, -18], [-40, -12], [-40, -6]].forEach(([wx, wy]) => {
      g.lineBetween(cx + wx, cy + wy, cx - 12, cy - 14);
    });
    [[40, -18], [40, -12], [40, -6]].forEach(([wx, wy]) => {
      g.lineBetween(cx + wx, cy + wy, cx + 12, cy - 14);
    });

    // ── 쪽 왕관 (작은) ──
    this._drawCrown(cx, cy - 96, 0xffc0cb, 'small');

    // 이름 태그
    this.add.text(cx, cy + 100, 'Suga', {
      fontSize: '15px', color: '#f5d060', fontStyle: 'bold',
      stroke: '#1a0933', strokeThickness: 3,
    }).setOrigin(0.5);

    // 츄르 (발 앞에)
    this._drawChuru(cx + 8, cy + 80);
  }

  // ── 왕관 유틸 ──────────────────────────────────────────
  _drawCrown(cx, cy, color, size) {
    const g = this.add.graphics();
    const big = size === 'big';
    const s = big ? 1 : 0.75;
    const w = 44 * s, h = 28 * s;

    // 왕관 테두리 (검정)
    g.fillStyle(0x000000, 0.3);
    g.fillRoundedRect(cx - w / 2 - 2, cy - h - 2, w + 4, h + 8, 4);

    // 왕관 본체
    g.fillStyle(color, 1);
    g.fillRect(cx - w / 2, cy - h + 6, w, h - 4);

    // 왕관 뾰족한 부분 3개
    g.fillTriangle(cx - w / 2, cy - h + 8, cx - w / 2, cy, cx - w / 2 + 10 * s, cy - h);
    g.fillTriangle(cx, cy - h - 8 * s, cx - 10 * s, cy - h + 6, cx + 10 * s, cy - h + 6);
    g.fillTriangle(cx + w / 2, cy - h + 8, cx + w / 2, cy, cx + w / 2 - 10 * s, cy - h);

    // 보석
    g.fillStyle(0xff4466, 1);
    g.fillCircle(cx, cy - h + 2, 4 * s);
    g.fillStyle(0x44aaff, 1);
    g.fillCircle(cx - w / 2 + 10 * s, cy - 4, 3 * s);
    g.fillCircle(cx + w / 2 - 10 * s, cy - 4, 3 * s);

    // 왕관 테두리 라인
    g.lineStyle(1.5, 0xaa8800, 1);
    g.strokeRect(cx - w / 2, cy - h + 6, w, h - 4);
  }

  // ── 츄르 아이템 ────────────────────────────────────────
  _drawChuru(x, y) {
    const g = this.add.graphics();
    // 츄르 막대기
    g.fillStyle(0xff6644, 1);
    g.fillRoundedRect(x - 6, y - 4, 28, 10, 4);
    g.fillStyle(0xffffff, 0.4);
    g.fillRoundedRect(x - 4, y - 2, 12, 4, 2);
    // 뚜껑 쪽
    g.fillStyle(0xcc4422, 1);
    g.fillRoundedRect(x + 16, y - 6, 8, 14, 3);
  }

  // ── 6. 떠다니는 코인/발바닥 장식 ──────────────────────
  _drawFloatingCoins() {
    const decorations = [
      { x: 30,       y: 170, type: 'paw',  scale: 1.1 },
      { x: W - 38,   y: 145, type: 'coin', scale: 1.0 },
      { x: 22,       y: 460, type: 'coin', scale: 0.85 },
      { x: W - 30,   y: 480, type: 'paw',  scale: 0.9 },
    ];

    decorations.forEach(({ x, y, type, scale }) => {
      const g = this.add.graphics();
      if (type === 'coin') {
        g.fillStyle(0xf5c842, 1);
        g.fillCircle(x, y, 16 * scale);
        g.fillStyle(0xd4a017, 1);
        g.fillCircle(x, y, 13 * scale);
        g.fillStyle(0xf5c842, 0.8);
        g.fillCircle(x - 2 * scale, y - 2 * scale, 6 * scale);
      } else {
        // 발바닥
        g.fillStyle(0x9966cc, 0.8);
        g.fillCircle(x, y, 10 * scale);
        g.fillCircle(x - 8 * scale, y - 8 * scale, 5 * scale);
        g.fillCircle(x + 8 * scale, y - 8 * scale, 5 * scale);
        g.fillCircle(x - 14 * scale, y - 2 * scale, 4 * scale);
        g.fillCircle(x + 14 * scale, y - 2 * scale, 4 * scale);
      }

      // 둥실둥실 애니메이션
      this.tweens.add({
        targets: g,
        y: `+=${6 * scale}`,
        duration: 1800 + Math.random() * 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 1000,
      });
    });
  }

  // ── 7. 타이틀 텍스트 ──────────────────────────────────
  _drawTitle() {
    // 왕관 장식
    const crownG = this.add.graphics();
    crownG.fillStyle(0xffd700, 1);
    crownG.fillTriangle(W / 2 - 28, 82, W / 2 - 20, 62, W / 2 - 10, 82);
    crownG.fillTriangle(W / 2,       82, W / 2,       55, W / 2 + 10, 82);
    crownG.fillTriangle(W / 2 + 28,  82, W / 2 + 20,  62, W / 2 + 10, 82);
    crownG.fillRect(W / 2 - 28, 80, 56, 16);
    crownG.fillStyle(0xff4466, 1).fillCircle(W / 2, 78, 4);
    crownG.fillStyle(0x44aaff, 1).fillCircle(W / 2 - 20, 90, 3).fillCircle(W / 2 + 20, 90, 3);

    // 타이틀 배경 광채
    const glow = this.add.graphics();
    glow.fillStyle(0x8833cc, 0.25);
    glow.fillEllipse(W / 2, 108, 340, 60);

    // 타이틀 텍스트 (아웃라인 + 그림자)
    this.add.text(W / 2 + 3, 111, '츄르앤더시티', {
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#2a0060',
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    }).setOrigin(0.5);

    const title = this.add.text(W / 2, 108, '츄르앤더시티', {
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#5500aa',
      strokeThickness: 6,
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      shadow: { offsetX: 0, offsetY: 2, color: '#8833cc', blur: 8, fill: true },
    }).setOrigin(0.5);

    // 살짝 흔들리는 애니메이션
    this.tweens.add({
      targets: title,
      scaleX: 1.02, scaleY: 1.02,
      duration: 2000,
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ── 8. 게임 시작 버튼 ─────────────────────────────────
  _drawStartButton() {
    const bx = W / 2, by = 680;
    const bw = 280, bh = 62;
    const g = this.add.graphics();

    // 버튼 그림자
    g.fillStyle(0x1a5230, 0.5);
    g.fillRoundedRect(bx - bw / 2 + 4, by - bh / 2 + 6, bw, bh, 32);

    // 버튼 본체 (초록)
    g.fillStyle(0x3cb96a, 1);
    g.fillRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);

    // 버튼 상단 하이라이트
    g.fillStyle(0x5cd88a, 0.5);
    g.fillRoundedRect(bx - bw / 2 + 10, by - bh / 2 + 6, bw - 20, bh / 2 - 4, 20);

    // 버튼 테두리
    g.lineStyle(2, 0x2a8a4a, 1);
    g.strokeRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);

    const txt = this.add.text(bx, by, '게임 시작', {
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1a6035',
      strokeThickness: 3,
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      shadow: { offsetY: 2, color: '#1a6035', blur: 4, fill: true },
    }).setOrigin(0.5);

    // 클릭 영역
    const zone = this.add.zone(bx - bw / 2, by - bh / 2, bw, bh).setOrigin(0).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      g.clear();
      g.fillStyle(0x1a5230, 0.5).fillRoundedRect(bx - bw / 2 + 4, by - bh / 2 + 6, bw, bh, 32);
      g.fillStyle(0x4ed880, 1).fillRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);
      g.lineStyle(2, 0x2a8a4a, 1).strokeRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);
    });
    zone.on('pointerout', () => {
      g.clear();
      g.fillStyle(0x1a5230, 0.5).fillRoundedRect(bx - bw / 2 + 4, by - bh / 2 + 6, bw, bh, 32);
      g.fillStyle(0x3cb96a, 1).fillRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);
      g.fillStyle(0x5cd88a, 0.5).fillRoundedRect(bx - bw / 2 + 10, by - bh / 2 + 6, bw - 20, bh / 2 - 4, 20);
      g.lineStyle(2, 0x2a8a4a, 1).strokeRoundedRect(bx - bw / 2, by - bh / 2, bw, bh, 32);
    });
    zone.on('pointerdown', () => {
      this.tweens.add({ targets: [g, txt], scaleX: 0.96, scaleY: 0.96, duration: 80, yoyo: true });
      this.time.delayedCall(120, () => this.scene.start('GameSelectScene'));
    });

    // 버튼 반짝임 파티클 (우측 하단 별)
    const sparkle = this.add.text(bx + bw / 2 - 20, by + bh / 2 - 8, '✦', {
      fontSize: '14px', color: '#ffffff',
    }).setOrigin(0.5);
    this.tweens.add({ targets: sparkle, alpha: 0.2, duration: 1000, yoyo: true, repeat: -1 });
  }

  // ── 9. 서브 버튼 (드레스룸, 간식) ─────────────────────
  _drawSubButtons() {
    // 드레스룸 버튼
    this._makeSmallBtn(W / 2 - 80, 760, 150, 46, '👗 드레스룸', 0x8844cc, () => {
      this.scene.start('DressRoomScene');
    });

    // 간식 버튼
    this._makeSmallBtn(W / 2 + 80, 760, 150, 46, '🍗 간식(-30)', 0xcc7722, () => {
      if (!gameState.feedSnack(this)) this.showToast('코인이 부족합니다 😿');
      else this.showToast('냥~ 기분 +20 🐱');
    });
  }

  _makeSmallBtn(cx, cy, w, h, label, color, cb) {
    const g = this.add.graphics();
    g.fillStyle(color, 1).fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 14);
    g.fillStyle(0xffffff, 0.15).fillRoundedRect(cx - w / 2 + 6, cy - h / 2 + 4, w - 12, h / 2 - 4, 8);
    g.lineStyle(2, Phaser.Display.Color.IntegerToColor(color).darken(30).color, 1);
    g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 14);

    this.add.text(cx, cy, label, {
      fontSize: '17px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#00000044', strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.zone(cx - w / 2, cy - h / 2, w, h).setOrigin(0).setInteractive({ useHandCursor: true })
      .on('pointerdown', cb);
  }

  // ── 10. 상단 HUD ───────────────────────────────────────
  _drawHud() {
    // 반투명 HUD 배경 (상단)
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.35);
    g.fillRoundedRect(8, 8, W - 16, 52, 14);

    // 텍스트들
    this.uiTexts.coins   = this.add.text(18, 20, '', { fontSize: '16px', color: '#f5d060', fontFamily: 'monospace' });
    this.uiTexts.stamina = this.add.text(W / 2 - 40, 20, '', { fontSize: '16px', color: '#88eebb', fontFamily: 'monospace' });
    this.uiTexts.mood    = this.add.text(W / 2 + 60, 20, '', { fontSize: '16px', color: '#ff9999', fontFamily: 'monospace' });
  }

  // ── HUD 갱신 ───────────────────────────────────────────
  updateHud() {
    if (!this.uiTexts.coins) return;
    this.uiTexts.coins.setText(`💰${gameState.get(this, 'coins')}`);
    this.uiTexts.stamina.setText(`🐾${gameState.get(this, 'stamina')}/10`);
    const mood = gameState.get(this, 'catMood');
    const moodEmoji = mood > 60 ? '😸' : mood > 30 ? '😐' : '😿';
    this.uiTexts.mood.setText(`${moodEmoji}${mood}`);
  }

  // ── 토스트 ─────────────────────────────────────────────
  showToast(message) {
    const toast = this.add.text(W / 2, 610, message, {
      fontSize: '17px', color: '#fff',
      backgroundColor: '#220044cc',
      padding: { x: 14, y: 8 },
      borderRadius: 12,
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({
      targets: toast, alpha: 0, y: 580,
      delay: 1200, duration: 500,
      onComplete: () => toast.destroy(),
    });
  }

  // ── 씬 정리 ────────────────────────────────────────────
  shutdown() {
    this.game.events.off('state:changed', this.updateHud, this);
    this.game.events.off('game:alert', this.showToast, this);
  }
}
