# Supabase 배포 가이드

FingerScore 웹 애플리케이션을 Supabase와 함께 배포하는 방법을 안내합니다.

## 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 스키마 설정](#2-데이터베이스-스키마-설정)
3. [인증 설정](#3-인증-설정)
4. [Row Level Security (RLS) 설정](#4-row-level-security-rls-설정)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [Vercel 배포](#6-vercel-배포)
7. [도메인 연결](#7-도메인-연결)

---

## 1. Supabase 프로젝트 생성

### 1.1 계정 생성 및 로그인

1. [Supabase](https://supabase.com) 접속
2. GitHub 계정으로 로그인 (권장) 또는 이메일 가입
3. "New Project" 클릭

### 1.2 프로젝트 설정

```
Project name: fingerscore
Database Password: (강력한 비밀번호 설정 - 저장해두세요!)
Region: Northeast Asia (ap-northeast-1) - 한국 사용자 기준
Pricing Plan: Free (무료) 또는 Pro
```

### 1.3 프로젝트 생성 완료 후 확인

프로젝트 대시보드에서 다음 정보를 확인합니다:
- **Project URL**: `https://[project-ref].supabase.co`
- **API Key (anon)**: 클라이언트용 공개 키
- **API Key (service_role)**: 서버용 비밀 키 (노출 금지!)

---

## 2. 데이터베이스 스키마 설정

### 2.1 SQL Editor 접속

Supabase 대시보드 → SQL Editor → New Query

### 2.2 테이블 생성

다음 SQL을 순서대로 실행합니다:

```sql
-- 1. Extensions 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types
CREATE TYPE user_role AS ENUM ('USER', 'CLUB_ADMIN', 'SUPER_ADMIN');
CREATE TYPE sport_type AS ENUM ('TABLE_TENNIS', 'TENNIS', 'BADMINTON');
CREATE TYPE match_visibility AS ENUM ('PUBLIC', 'CLUB_ONLY', 'PRIVATE');
CREATE TYPE tournament_status AS ENUM ('DRAFT', 'REGISTRATION', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE match_status AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- 3. Users Profile Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role DEFAULT 'USER',
  preferred_sport sport_type DEFAULT 'TABLE_TENNIS',
  current_rating INTEGER DEFAULT 1200,
  highest_rating INTEGER DEFAULT 1200,
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Clubs Table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  location TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  sport_type sport_type DEFAULT 'TABLE_TENNIS',
  member_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Club Members Table
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER', -- OWNER, ADMIN, MEMBER
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- 6. Tournaments Table
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sport_type sport_type DEFAULT 'TABLE_TENNIS',
  club_id UUID REFERENCES clubs(id),
  status tournament_status DEFAULT 'DRAFT',
  format TEXT DEFAULT 'SINGLE_ELIMINATION', -- SINGLE_ELIMINATION, DOUBLE_ELIMINATION, ROUND_ROBIN, SWISS
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  entry_fee INTEGER DEFAULT 0,
  prize_pool INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  location TEXT,
  rules JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tournament Registrations Table
CREATE TABLE tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED
  seed INTEGER,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- 8. Matches Table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  sport_type sport_type DEFAULT 'TABLE_TENNIS',
  status match_status DEFAULT 'SCHEDULED',
  visibility match_visibility DEFAULT 'PUBLIC',
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES profiles(id),
  set_scores JSONB, -- [{player1: 11, player2: 9}, ...]
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Match Memories Table (AI Briefing)
CREATE TABLE match_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  briefing_status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
  briefing_text TEXT,
  highlights JSONB, -- {key_moments: [], strengths: [], improvements: []}
  stats_snapshot JSONB,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Match Comments Table
CREATE TABLE match_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_quick_message BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- MATCH_INVITE, TOURNAMENT_UPDATE, COMMENT, etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create indexes for performance
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_club ON matches(club_id);
CREATE INDEX idx_matches_players ON matches(player1_id, player2_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_club_members_user ON club_members(user_id);
CREATE INDEX idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);

-- 13. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Apply trigger to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. 인증 설정

### 3.1 이메일 인증 설정

Supabase 대시보드 → Authentication → Providers → Email

```
Enable Email provider: ON
Confirm email: ON (또는 개발 중에는 OFF)
```

### 3.2 소셜 로그인 설정

#### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. APIs & Services → Credentials → Create Credentials → OAuth client ID
4. Application type: Web application
5. Authorized redirect URIs 추가:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
6. Client ID와 Client Secret 복사
7. Supabase 대시보드 → Authentication → Providers → Google
   - Enable: ON
   - Client ID: (붙여넣기)
   - Client Secret: (붙여넣기)

#### Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 추가
3. 플랫폼 → Web 플랫폼 등록
   ```
   사이트 도메인: https://your-domain.com
   ```
4. 카카오 로그인 → 활성화 설정: ON
5. Redirect URI 등록:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
6. 앱 키 → REST API 키 복사
7. 보안 → Client Secret 생성
8. Supabase 대시보드 → Authentication → Providers → Kakao
   - Enable: ON
   - Client ID: REST API 키
   - Client Secret: (붙여넣기)

#### Naver OAuth

1. [Naver Developers](https://developers.naver.com/) 접속
2. Application → 애플리케이션 등록
3. 사용 API: 네이버 로그인
4. 환경: PC웹
5. 서비스 URL: `https://your-domain.com`
6. Callback URL:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
7. Client ID와 Client Secret 복사
8. Supabase에서는 Custom Provider로 설정 필요

---

## 4. Row Level Security (RLS) 설정

### 4.1 RLS 활성화 및 정책 설정

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Clubs policies
CREATE POLICY "Public clubs are viewable by everyone"
  ON clubs FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create clubs"
  ON clubs FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Club owners can update their clubs"
  ON clubs FOR UPDATE
  USING (created_by = auth.uid());

-- Matches policies
CREATE POLICY "Public matches are viewable by everyone"
  ON matches FOR SELECT
  USING (
    visibility = 'PUBLIC'
    OR player1_id = auth.uid()
    OR player2_id = auth.uid()
    OR created_by = auth.uid()
  );

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Match participants can update matches"
  ON matches FOR UPDATE
  USING (
    player1_id = auth.uid()
    OR player2_id = auth.uid()
    OR created_by = auth.uid()
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Match comments policies
CREATE POLICY "Comments on public matches are viewable"
  ON match_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_comments.match_id
      AND (
        matches.visibility = 'PUBLIC'
        OR matches.player1_id = auth.uid()
        OR matches.player2_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON match_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON match_comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON match_comments FOR DELETE
  USING (user_id = auth.uid());
```

---

## 5. 환경 변수 설정

### 5.1 로컬 개발 환경

`web/.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# Optional: Server-side only
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# OAuth (if using custom implementation)
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5.2 프로덕션 환경 변수

Vercel, Netlify 등 배포 플랫폼의 환경 변수 설정에서 동일하게 설정합니다.

---

## 6. Vercel 배포

### 6.1 Vercel 연결

1. [Vercel](https://vercel.com) 로그인
2. "Add New Project"
3. GitHub 저장소 연결 (fingerscore)
4. Root Directory: `web` 설정
5. Framework Preset: Next.js (자동 감지)

### 6.2 환경 변수 설정

Vercel 프로젝트 → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
NEXT_PUBLIC_APP_URL = https://your-domain.com
```

### 6.3 빌드 설정

```json
// vercel.json (web/ 폴더에 생성)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 6.4 배포

```bash
# Vercel CLI 사용 시
npm i -g vercel
cd web
vercel --prod
```

또는 GitHub 푸시 시 자동 배포됩니다.

---

## 7. 도메인 연결

### 7.1 Vercel 도메인 설정

1. Vercel 프로젝트 → Settings → Domains
2. 커스텀 도메인 추가: `fingerscore.app`
3. DNS 설정 안내에 따라 도메인 레코드 추가

### 7.2 Supabase URL 업데이트

Supabase 대시보드 → Authentication → URL Configuration:

```
Site URL: https://fingerscore.app
Redirect URLs:
  - https://fingerscore.app/auth/callback
  - https://fingerscore.app/ko/auth/callback
  - https://fingerscore.app/en/auth/callback
```

### 7.3 OAuth Redirect URI 업데이트

각 OAuth 제공자 설정에서 프로덕션 URL 추가:

```
Google: https://fingerscore.app/auth/callback
Kakao: https://[project-ref].supabase.co/auth/v1/callback
Naver: https://[project-ref].supabase.co/auth/v1/callback
```

---

## 문제 해결

### CORS 오류

Supabase 대시보드 → Settings → API → CORS Settings에서 도메인 추가

### 인증 콜백 오류

1. Redirect URL이 정확한지 확인
2. Supabase의 Site URL 설정 확인
3. OAuth 제공자의 Redirect URI 설정 확인

### RLS 정책 오류

```sql
-- 디버깅: RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- 일시적으로 RLS 비활성화 (테스트용)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

---

## 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
