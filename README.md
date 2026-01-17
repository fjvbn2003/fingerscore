# FingerScore - Smart Sports Platform

스마트 점수 기록 및 대회 관리 플랫폼입니다. 탁구, 테니스, 배드민턴 등 라켓 스포츠를 위한 종합 솔루션을 제공합니다.

## 🎯 주요 기능

### 하드웨어
- **BLE 링 디바이스**: 손가락 제스처로 점수 기록
- **실시간 연동**: 스마트폰/웹과 블루투스 연결

### 웹 애플리케이션
- **다국어 지원**: 한국어/영어 (next-intl)
- **SSO 인증**: Google, Kakao, Naver 소셜 로그인
- **대회 관리**: 토너먼트/리그 생성 및 관리
- **실시간 점수판**: 라이브 스코어 중계
- **랭킹 시스템**: ELO 기반 레이팅
- **클럽 관리**: 클럽 생성 및 회원 관리
- **경기 기록**: AI 기반 매치 분석 및 브리핑
- **통계 분석**: 상세한 경기 통계 및 차트

### 모바일 앱
- **Android 앱**: BLE 링 연동 점수판
- **실시간 동기화**: 웹과 데이터 연동

---

## 프로젝트 구조

```
fingerscore/
├── firmware/          # Arduino 펌웨어 (XIAO nRF52840)
├── android/           # Android 앱
├── web/               # Next.js 웹 애플리케이션
│   ├── src/
│   │   ├── app/       # App Router 페이지
│   │   ├── components/# React 컴포넌트
│   │   ├── i18n/      # 다국어 번역 파일
│   │   ├── contexts/  # React Context
│   │   ├── lib/       # 유틸리티 함수
│   │   └── types/     # TypeScript 타입
│   └── ...
└── docs/              # 문서
```

---

## 1. 웹 애플리케이션 (Next.js)

### 기술 스택
- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui, Lucide Icons
- **Auth**: Supabase Auth (SSO)
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl
- **Testing**: Vitest, Testing Library

### 설치 및 실행

```bash
cd web

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 Supabase 키 등 설정

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build
npm start
```

### 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 홈페이지 |
| `/tournaments` | 대회 목록 및 관리 |
| `/rankings` | 랭킹/리더보드 |
| `/live` | 실시간 점수 중계 |
| `/tools` | 도구 모음 (점수판, 기록, 통계 등) |
| `/tools/scoreboard` | 실시간 점수판 |
| `/tools/match-record` | 경기 기록 관리 |
| `/tools/statistics` | 통계 및 분석 |
| `/dashboard` | 사용자 대시보드 |
| `/profile` | 프로필 관리 |
| `/support/faq` | 자주 묻는 질문 |
| `/support/contact` | 문의하기 |
| `/legal/terms` | 이용약관 |
| `/legal/privacy` | 개인정보처리방침 |

### Docker 배포

```bash
cd web

# 이미지 빌드
docker build -t fingerscore-web .

# 컨테이너 실행
docker run -p 3000:3000 fingerscore-web
```

---

## 2. Firmware Setup (Arduino)

### Prerequisites
- [Arduino IDE](https://www.arduino.cc/en/software) or `arduino-cli` installed.
- **Board URL**: `https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json`

### Terminal Workflow (`arduino-cli`)

1. **Setup**:
   ```bash
   arduino-cli core update-index
   arduino-cli core install Seeeduino:nrf52
   arduino-cli lib install "Adafruit Bluefruit nRF52" "Adafruit TinyUSB Library"
   ```

2. **Identify Board (USB)**:
   ```bash
   arduino-cli board list
   # Look for a device with "XIAO nRF52840 Sense"
   ```

3. **Compile and Upload**:
   ```bash
   # Compile
   arduino-cli compile --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino
   
   # Upload (Replace /dev/... with your port)
   arduino-cli upload -p /dev/cu.usbmodem1101 --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino
   ```

---

## 2. Android App Setup

### Prerequisites
- Android SDK and Platform Tools installed.
- **Wireless Debugging**: Enabled on your Android device (Developer Options).

### Terminal Workflow (CLI)

1. **Setup Project**:
   ```bash
   cd android
   ./gradlew wrapper --gradle-version 8.0.2
   ```

2. **Connect Device (Wireless)**:
   ```bash
   # 1. Pair (Look for IP:Port and Pairing Code on your phone)
   adb pair [IP:PORT] [PAIRING_CODE]
   
   # 2. Connect (Look for IP:Port on your phone)
   adb connect [IP:PORT]
   ```

3. **Build and Deploy**:
   ```bash
   # Build APK
   ./gradlew assembleDebug
   
   # Install and Run
   adb -s [DEVICE_IP:PORT] install -r app/build/outputs/apk/debug/app-debug.apk
   adb -s [DEVICE_IP:PORT] shell am start -n com.example.fingerscore/.MainActivity
   ```

---

## 3. Using the App

### Finding your Ring
- **BLE Name**: The firmware advertises as **`FingerScore-Ring`**.
- **In-App Scan**: Click `PAIR RING A` or `PAIR RING B`. The app will list all nearby BLE devices. Look for **`FingerScore-Ring`**.
- **Bluetooth/Location**: Ensure both are **ON** on your phone. Location is mandatory for BLE scanning on Android.

### Scoreboard Features
- **Team A/B**: Split screen for two rings.
- **Sports**: Supports Table Tennis, Tennis (15/30/40), and Badminton.
- **Manual Mode**: Tap `+` or `-` on the screen to adjust scores manually.

---

## 4. 스포츠별 점수 규칙

### 탁구 (Table Tennis)
- 11점 선취제, 듀스 시 2점 차 승리
- 게임 수: 3, 5, 7판제

### 테니스 (Tennis)
- 포인트: 0, 15, 30, 40, Deuce, Advantage
- 게임 → 세트 → 매치

### 배드민턴 (Badminton)
- 21점 선취제, 듀스 시 2점 차 또는 30점 선도
- 3세트 중 2세트 선취 승리

---

## 5. 환경 변수

웹 애플리케이션 실행에 필요한 환경 변수:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OAuth (선택)
GOOGLE_CLIENT_ID=your-google-client-id
KAKAO_CLIENT_ID=your-kakao-client-id
NAVER_CLIENT_ID=your-naver-client-id
```

---

## 6. 테스트

```bash
cd web

# 전체 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```

### 테스트 범위
- 스포츠 점수 검증 (27 tests)
- 공개 설정 로직 (16 tests)
- 스포츠 명언 티커 (17 tests)
- 매치 메모리/코멘트 (23 tests)
- 번역 구조 검증 (8 tests)
- UI 컴포넌트 (16 tests)

---

## 7. 라이선스

MIT License

---

## 8. 문의

- **이메일**: support@fingerscore.app
- **GitHub Issues**: [fingerscore/issues](https://github.com/fingerscore/issues)
