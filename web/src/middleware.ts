import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Admin 경로 패턴
const ADMIN_PATH_REGEX = /^\/[a-z]{2}\/admin/;
const AUTH_PATH_REGEX = /^\/[a-z]{2}\/auth/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin 경로 체크
  const isAdminPath = ADMIN_PATH_REGEX.test(pathname);
  const isAuthPath = AUTH_PATH_REGEX.test(pathname);

  // Admin 경로가 아닌 경우 intl 미들웨어만 실행
  if (!isAdminPath) {
    return intlMiddleware(request);
  }

  // Admin 경로인 경우 Supabase 세션 확인
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    const locale = pathname.split("/")[1] || "ko";
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 프로필 조회하여 역할 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const isSystemPath = pathname.includes("/admin/system");

  // 권한 없는 경우 홈으로 리다이렉트
  if (!role || (role !== "ADMIN" && role !== "CLUB_OWNER")) {
    const locale = pathname.split("/")[1] || "ko";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // System 경로는 ADMIN만 접근 가능
  if (isSystemPath && role !== "ADMIN") {
    const locale = pathname.split("/")[1] || "ko";
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  // intl 미들웨어도 실행하여 locale 처리
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
