"use client";

import { useAdminAuth } from "@/hooks/admin/use-admin-auth";
import { Loader2, ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Admin 영역 접근 권한 가드
 * - ADMIN, CLUB_OWNER만 접근 허용
 * - 미로그인/권한 없음 시 적절한 UI 표시
 */
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isLoading, isAuthorized, role } = useAdminAuth();
  const t = useTranslations();

  // 로딩 중
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">권한 확인 중...</p>
          </div>
        </div>
      )
    );
  }

  // 권한 없음
  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">접근 권한이 없습니다</h2>
          <p className="mt-2 text-muted-foreground">
            이 페이지는 관장 또는 관리자만 접근할 수 있습니다.
            {role && (
              <span className="block mt-1 text-sm">
                현재 역할: <span className="font-medium">{role}</span>
              </span>
            )}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/">{t("common.goHome")}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">다시 로그인</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
