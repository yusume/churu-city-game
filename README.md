# 🐱 츄르앤더시티 (Churu & The City)

> K-직장인 고양이 집사 라이프 게임  
> Phaser 3 + Vite · Mobile Portrait (390×844)

---

## 🚀 빠른 시작

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후, **모바일 세로 화면(390×844)** 으로 시뮬레이션하세요.  
(Chrome DevTools → 모바일 에뮬레이터 권장)

---

## 📁 파일 구조

```
churu-and-the-city/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js                  # Phaser 게임 설정 & 씬 등록
│   ├── utils/
│   │   ├── GameState.js         # 전역 상태 관리 (코인, 체력, 기분)
│   │   └── CatRenderer.js       # 고양이 레이어 조합 렌더링
│   └── scenes/
│       ├── PreloadScene.js      # 에셋 로딩
│       ├── HomeScene.js         # 메인 홈 화면
│       ├── GameSelectScene.js   # 미니게임 선택
│       ├── FishGameScene.js     # 🐟 생선 세금 징수 (메인 미니게임)
│       ├── SlotGameScene.js     # 🎰 츄르 복권
│       ├── RatGameScene.js      # 🐀 쥐 단속
│       └── DressRoomScene.js    # 👗 드레스룸
└── public/
    └── assets/                  # PNG 에셋 폴더 (아래 참조)
```

---

## 🎮 게임 시스템

### 전역 상태 (`GameState`)
| 자원 | 설명 | 초기값 |
|------|------|--------|
| `coins` | 츄르값 (기본 재화) | 0 |
| `stamina` | 집사 체력 (5분마다 1 회복) | 10 |
| `catMood` | 고양이 기분 (2분마다 1 감소) | 80 |

- 기분이 0이 되면 **스트레스성 병동 입원** → 코인 100 차감
- 간식(30코인)으로 기분 +20 회복

### 미니게임
| 게임 | 소비 | 보상 |
|------|------|------|
| 🐟 생선 세금 징수 | 체력 1 | 생선 1마리당 코인 +2 |
| 🎰 츄르 복권 | 코인 10 | 배율에 따라 코인 획득 |
| 🐀 쥐 단속 | 체력 1 | 쥐 1마리당 코인 +3 |

---

## 🐾 고양이 레이어 렌더링

`CatRenderer.js`의 `createCatContainer(scene, x, y, equipped, scale)` 함수가  
아래 순서로 Phaser `Container` 내에 레이어를 적층합니다:

```
1. background  (배경)
2. tail        (꼬리)
3. body        (품종별 기본 바디)
4. coat        (무늬/색상)
5. clothes     (의상)
6. accessories (악세사리)
7. expression  (표정)
```

실제 PNG 에셋 없이도 **벡터 플레이스홀더**로 동작합니다.  
에셋 추가 시 `PreloadScene.js`에서 `this.load.image(key, path)` 등록 후 자동 적용됩니다.

---

## 🖼️ 에셋 추가 방법

`public/assets/` 폴더에 투명 PNG 파일을 배치하고,  
`PreloadScene.js`의 `preload()` 메서드에 아래처럼 추가합니다:

```js
// 예시
this.load.image('body_tuxedo',   'assets/cat/body_tuxedo.png');
this.load.image('coat_black',    'assets/cat/coat_black.png');
this.load.image('hat_crown',     'assets/items/hat_crown.png');
this.load.image('bg_office',     'assets/backgrounds/bg_office.png');
```

이미지 키가 `GameState.equipped` 또는 드레스룸 아이템 `key`와 일치하면  
자동으로 플레이스홀더 대신 실제 이미지가 렌더링됩니다.

---

## 🔧 확장 포인트

- **새 미니게임 추가**: `GameSelectScene.js`의 `GAMES` 배열에 항목 추가
- **새 아이템 추가**: `DressRoomScene.js`의 `ITEMS` 객체에 카테고리별 항목 추가
- **스태미나/기분 밸런싱**: `GameState.js`의 상수값 조정
- **세이브 기능**: `GameState._save()` / `_loadFromStorage()`가 `localStorage` 기반 퍼시스턴스 처리

---

## 📱 빌드 & 배포

```bash
npm run build    # dist/ 폴더 생성
npm run preview  # 빌드 결과 미리보기
```

`dist/` 폴더를 Vercel, Netlify, GitHub Pages 등에 정적 배포하면 됩니다.
