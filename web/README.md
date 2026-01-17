# FingerScore Web

스마트 링으로 탁구/테니스/배드민턴 점수를 기록하고 관리하는 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, Radix UI
- **국제화**: next-intl (한국어, 영어, 일본어, 중국어)
- **백엔드**: Supabase
- **테스트**: Vitest, React Testing Library

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

### 린트

```bash
npm run lint
```

## 테스트

### 테스트 실행

```bash
npm test
```

### 테스트 Watch 모드

```bash
npm run test:watch
```

### 테스트 커버리지

```bash
npm run test:coverage
```

### 테스트 구조

```
src/__tests__/
├── setup.tsx                    # 테스트 설정 파일
├── components/
│   ├── header.test.tsx          # Header 컴포넌트 테스트
│   └── footer.test.tsx          # Footer 컴포넌트 테스트
├── i18n/
│   └── translations.test.ts     # 국제화 설정 및 번역 테스트
└── types/
    └── database.test.ts         # 데이터베이스 타입 테스트
```

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router 페이지
│   └── [locale]/         # 다국어 라우팅
├── components/
│   ├── layout/           # 레이아웃 컴포넌트 (Header, Footer)
│   └── ui/               # UI 컴포넌트 (Button, Card, Dialog 등)
├── i18n/                 # 국제화 설정 및 번역 파일
├── lib/                  # 유틸리티 함수
└── types/                # TypeScript 타입 정의
```

## 지원 언어

- 한국어 (ko) - 기본
- English (en)
- 日本語 (ja)
- 简体中文 (zh)

## 지원 스포츠

- 탁구 (Table Tennis)
- 테니스 (Tennis)
- 배드민턴 (Badminton)
