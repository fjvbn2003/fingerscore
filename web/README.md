# FingerScore Web

<p align="center">
  스마트 링으로 탁구/테니스/배드민턴 점수를 기록하고 관리하는 웹 애플리케이션
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#docker">Docker</a> •
  <a href="#testing">Testing</a>
</p>

---

## Features

- **대회 관리**: 대회 생성, 참가 신청, 대진표 자동 생성
- **실시간 라이브**: 진행 중인 경기 실시간 관전
- **랭킹 시스템**: ELO 레이팅 기반 순위
- **커뮤니티**: 게시판, 대회 후기, 장비 리뷰
- **다국어 지원**: 한국어, English, 日本語, 简体中文
- **소셜 로그인**: Google, Kakao, 휴대폰 인증

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Radix UI |
| State | React Context |
| Forms | React Hook Form, Zod |
| i18n | next-intl |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Testing | Vitest, React Testing Library |
| Deployment | Docker, Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase 프로젝트 (또는 로컬 Supabase)

### Environment Variables

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm test` | 테스트 실행 |
| `npm run test:watch` | Watch 모드로 테스트 |
| `npm run test:coverage` | 테스트 커버리지 리포트 |

## Docker

### Production Build

```bash
# 빌드
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -t fingerscore-web .

# 실행
docker run -p 3000:3000 fingerscore-web
```

### Docker Compose

```bash
# .env 파일 생성 후
docker-compose up -d

# 개발 모드
docker-compose --profile dev up web-dev
```

### Multi-stage Build

Dockerfile은 3단계 멀티스테이지 빌드를 사용합니다:

1. **deps**: 의존성 설치
2. **builder**: 애플리케이션 빌드
3. **runner**: 최소 런타임 이미지 (standalone output)

## Testing

### Test Structure

```
src/__tests__/
├── setup.tsx                    # 테스트 설정
├── components/
│   ├── header.test.tsx          # Header 컴포넌트
│   └── footer.test.tsx          # Footer 컴포넌트
├── i18n/
│   └── translations.test.ts     # 번역 파일 검증
└── types/
    └── database.test.ts         # 타입 검증
```

### Running Tests

```bash
# 전체 테스트
npm test

# Watch 모드
npm run test:watch

# 커버리지
npm run test:coverage
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/             # 다국어 라우팅
│   │   ├── auth/             # 인증 페이지
│   │   ├── tournaments/      # 대회 페이지
│   │   ├── community/        # 커뮤니티
│   │   ├── rankings/         # 랭킹
│   │   ├── live/             # 라이브
│   │   └── dashboard/        # 대시보드
│   └── api/                  # API Routes
├── components/
│   ├── auth/                 # 인증 컴포넌트
│   ├── layout/               # 레이아웃 (Header, Footer)
│   └── ui/                   # UI 컴포넌트 (shadcn/ui)
├── contexts/                 # React Context
├── hooks/                    # Custom Hooks
├── i18n/                     # 국제화 설정
├── lib/                      # 유틸리티
│   └── supabase/             # Supabase 클라이언트
└── types/                    # TypeScript 타입
```

## Authentication

### Supported Methods

| Method | Description |
|--------|-------------|
| Email/Password | 기본 이메일 인증 |
| Google OAuth | Google 계정 로그인 |
| Kakao OAuth | 카카오 계정 로그인 |
| Phone OTP | 휴대폰 인증번호 |

### Supabase Auth Setup

1. Supabase 대시보드에서 Authentication > Providers 설정
2. Google/Kakao OAuth 앱 생성 및 Client ID/Secret 등록
3. Phone Auth 활성화 (Twilio 연동 필요)

## Database Schema

### Main Tables

- `profiles` - 사용자 프로필
- `tournaments` - 대회 정보
- `tournament_registrations` - 대회 참가
- `matches` - 경기 정보
- `live_scores` - 실시간 점수
- `posts` - 커뮤니티 게시글
- `comments` - 댓글
- `notifications` - 알림

### Migrations

```bash
# Supabase CLI 설치
npm install -g supabase

# 마이그레이션 실행
supabase db push
```

## Supported Languages

| Code | Language |
|------|----------|
| ko | 한국어 (기본) |
| en | English |
| ja | 日本語 |
| zh | 简体中文 |

## Supported Sports

| Sport | Status |
|-------|--------|
| Table Tennis | ✅ |
| Tennis | ✅ |
| Badminton | ✅ |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  Made with ❤️ by FingerScore Team
</p>
