# FingerScore - 스마트 스포츠 플랫폼

스마트 점수 기록 및 대회 관리 플랫폼입니다. 탁구, 테니스, 배드민턴 등 라켓 스포츠를 위한 종합 솔루션을 제공합니다.

## 주요 기능

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

## 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [웹 애플리케이션](#1-웹-애플리케이션-nextjs)
3. [배포 가이드](#2-배포-가이드)
4. [펌웨어 설정](#3-펌웨어-설정-arduino)
5. [Android 앱 설정](#4-android-앱-설정)
6. [스포츠별 점수 규칙](#5-스포츠별-점수-규칙)
7. [환경 변수](#6-환경-변수)
8. [테스트](#7-테스트)

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
├── k8s/               # Kubernetes 배포 설정
│   └── helm/          # Helm 차트
│       └── fingerscore/
└── docs/              # 문서
    ├── SUPABASE_DEPLOYMENT.md
    └── KUBERNETES_DEPLOYMENT.md
```

---

## 1. 웹 애플리케이션 (Next.js)

### 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16+ (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui, Lucide Icons |
| Auth | Supabase Auth (SSO) |
| Database | Supabase (PostgreSQL) |
| i18n | next-intl |
| Testing | Vitest, Testing Library |

### 로컬 개발 환경 설정

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
| `/live-score` | 라이브 스코어보드 |
| `/tools` | 도구 모음 |
| `/tools/scoreboard` | 실시간 점수판 |
| `/tools/match-record` | 경기 기록 관리 |
| `/tools/statistics` | 통계 및 분석 |
| `/tools/club-map` | 클럽 지도 |
| `/dashboard` | 사용자 대시보드 |
| `/profile` | 프로필 관리 |
| `/admin` | 클럽 관리자 페이지 |
| `/support/faq` | 자주 묻는 질문 |
| `/support/contact` | 문의하기 |
| `/legal/terms` | 이용약관 |
| `/legal/privacy` | 개인정보처리방침 |

---

## 2. 배포 가이드

### 2.1 Docker 배포

#### Docker Hub 이미지 사용

```bash
# 최신 이미지 가져오기
docker pull fjvbn2003/fingerscore:latest

# 또는 특정 버전
docker pull fjvbn2003/fingerscore:v1.0.0

# 컨테이너 실행
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  --name fingerscore \
  fjvbn2003/fingerscore:latest
```

#### 직접 이미지 빌드

```bash
cd web

# 이미지 빌드
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -t fingerscore-web .

# 컨테이너 실행
docker run -d -p 3000:3000 --name fingerscore fingerscore-web
```

### 2.2 Kubernetes + Helm 배포

#### 사전 요구사항

```bash
# kubectl 설치
brew install kubectl

# Helm 설치
brew install helm

# 클러스터 연결 확인
kubectl cluster-info
```

#### cert-manager 설치 (TLS 인증서 자동화)

```bash
# Helm 저장소 추가
helm repo add jetstack https://charts.jetstack.io
helm repo update

# CRDs 설치
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.3/cert-manager.crds.yaml

# cert-manager 설치
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.3
```

#### NGINX Ingress Controller 설치

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

#### FingerScore 배포

```bash
# 네임스페이스 생성
kubectl create namespace fingerscore

# 시크릿 생성
kubectl create secret generic fingerscore-secrets \
  --from-literal=supabase-url='https://xxx.supabase.co' \
  --from-literal=supabase-anon-key='your-anon-key' \
  --from-literal=supabase-service-role-key='your-service-key' \
  -n fingerscore

# Helm 의존성 업데이트
cd k8s/helm/fingerscore
helm dependency update

# 개발 환경 배포
helm install fingerscore-dev . \
  --namespace fingerscore-dev \
  --create-namespace \
  -f values-dev.yaml

# 프로덕션 배포
helm install fingerscore . \
  --namespace fingerscore \
  -f values-prod.yaml

# 배포 상태 확인
kubectl get pods -n fingerscore
kubectl get ingress -n fingerscore
kubectl get certificate -n fingerscore
```

#### Helm 업그레이드 및 롤백

```bash
# 업그레이드
helm upgrade fingerscore . \
  --namespace fingerscore \
  -f values-prod.yaml \
  --set image.tag=v1.1.0

# 히스토리 확인
helm history fingerscore -n fingerscore

# 롤백
helm rollback fingerscore 1 -n fingerscore
```

### 2.3 Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd web
vercel --prod
```

또는 GitHub 연동으로 자동 배포 설정:
1. [Vercel](https://vercel.com) 로그인
2. "Import Project" → GitHub 저장소 선택
3. Root Directory: `web` 설정
4. 환경 변수 설정

### 2.4 셀프 호스팅 (Supabase/Vercel 없이)

Vercel이나 Supabase SaaS 없이 완전히 자체 인프라에서 운영할 수 있습니다.

#### PostgreSQL 직접 설치

```bash
# Docker로 PostgreSQL 실행
docker run -d \
  --name fingerscore-db \
  -e POSTGRES_USER=fingerscore \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=fingerscore \
  -p 5432:5432 \
  -v fingerscore-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 또는 Kubernetes에서 Helm으로 설치
helm install postgresql bitnami/postgresql \
  --namespace fingerscore \
  --set auth.username=fingerscore \
  --set auth.password=your-password \
  --set auth.database=fingerscore
```

#### Supabase 셀프 호스팅

```bash
# Supabase 셀프 호스팅 (Docker Compose)
git clone https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
# .env 파일 편집 후
docker compose up -d
```

#### 환경 변수 (셀프 호스팅)

```env
# PostgreSQL 직접 연결 시
DATABASE_URL=postgresql://fingerscore:password@localhost:5432/fingerscore

# Supabase 셀프 호스팅 시
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

#### Helm 차트에서 PostgreSQL 활성화

```yaml
# values.yaml에서 내장 PostgreSQL 사용
postgresql:
  enabled: true
  auth:
    username: fingerscore
    password: your-secure-password
    database: fingerscore
  primary:
    persistence:
      size: 10Gi
```

### 2.5 Supabase 클라우드 설정

Supabase 클라우드(SaaS)를 사용하는 경우:
[docs/SUPABASE_DEPLOYMENT.md](docs/SUPABASE_DEPLOYMENT.md) 참조

```bash
# 주요 단계
1. Supabase 프로젝트 생성 (https://supabase.com)
2. SQL Editor에서 데이터베이스 스키마 실행
3. Authentication → Providers에서 OAuth 설정
4. Row Level Security (RLS) 정책 적용
```

---

## 3. 펌웨어 설정 (Arduino)

### 요구사항
- [Arduino IDE](https://www.arduino.cc/en/software) 또는 `arduino-cli`
- **보드 URL**: `https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json`

### arduino-cli 사용법

```bash
# 보드 설정
arduino-cli core update-index
arduino-cli core install Seeeduino:nrf52
arduino-cli lib install "Adafruit Bluefruit nRF52" "Adafruit TinyUSB Library"

# 보드 확인
arduino-cli board list

# 컴파일
arduino-cli compile --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino

# 업로드 (포트는 환경에 맞게 변경)
arduino-cli upload -p /dev/cu.usbmodem1101 --fqbn Seeeduino:nrf52:xiaonRF52840Sense firmware/firmware.ino
```

---

## 4. Android 앱 설정

### 요구사항
- Android SDK 및 Platform Tools
- 무선 디버깅 활성화 (개발자 옵션)

### 빌드 및 배포

```bash
cd android

# Gradle Wrapper 설정
./gradlew wrapper --gradle-version 8.0.2

# 무선 디버깅 연결
adb pair [IP:PORT] [PAIRING_CODE]
adb connect [IP:PORT]

# APK 빌드
./gradlew assembleDebug

# 설치 및 실행
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.example.fingerscore/.MainActivity
```

### 링 연결 방법
- **BLE 이름**: `FingerScore-Ring`으로 광고됨
- 앱에서 `PAIR RING A` 또는 `PAIR RING B` 클릭
- Bluetooth와 위치 권한이 필요함

---

## 5. 스포츠별 점수 규칙

### 탁구 (Table Tennis)
- 11점 선취제
- 듀스 시 2점 차 승리 (최대 15점)
- 게임 수: 3판 2선승, 5판 3선승, 7판 4선승

### 테니스 (Tennis)
- 포인트: 0 → 15 → 30 → 40 → 게임
- 듀스: 40-40에서 2포인트 차 승리
- 세트: 6게임 선취 (타이브레이크: 6-6)
- 매치: 3세트 2선승

### 배드민턴 (Badminton)
- 21점 선취제
- 듀스 시 2점 차 또는 30점 선도 승리
- 3세트 2선승

---

## 6. 환경 변수

### 웹 애플리케이션 (.env.local)

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 서버 전용 (선택)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# 앱 URL
NEXT_PUBLIC_APP_URL=https://fingerscore.app

# OAuth (선택)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

### Kubernetes 시크릿

```bash
kubectl create secret generic fingerscore-secrets \
  --from-literal=supabase-url='https://xxx.supabase.co' \
  --from-literal=supabase-anon-key='eyJhbGci...' \
  --from-literal=supabase-service-role-key='eyJhbGci...' \
  -n fingerscore
```

---

## 7. 테스트

```bash
cd web

# 전체 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```

### 테스트 범위 (119개 테스트)

| 분류 | 테스트 수 | 설명 |
|------|----------|------|
| 스포츠 점수 검증 | 27 | 탁구/테니스/배드민턴 점수 규칙 |
| 공개 설정 로직 | 16 | PUBLIC/CLUB_ONLY/PRIVATE 설정 |
| 스포츠 명언 티커 | 17 | 명언 로테이션 및 표시 |
| 매치 메모리 | 23 | AI 브리핑, 코멘트, 반응 |
| 번역 구조 | 8 | 다국어 키 일관성 |
| UI 컴포넌트 | 16 | Header, Footer, Auth |

---

## 8. 라이선스

MIT License

---

## 9. 문의

- **이메일**: support@fingerscore.app
- **GitHub Issues**: [fjvbn2003/fingerscore/issues](https://github.com/fjvbn2003/fingerscore/issues)
- **Docker Hub**: [fjvbn2003/fingerscore](https://hub.docker.com/r/fjvbn2003/fingerscore)
