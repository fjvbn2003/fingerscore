"use client";

import { useSystemAuth } from "@/hooks/admin/use-admin-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface SystemGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 시스템 관리자 전용 가드
 * - ADMIN 역할만 접근 허용
 * - CLUB_OWNER도 접근 불가
 */
export function SystemGuard({ children, fallback }: SystemGuardProps) {
  const { isLoading, isAuthorized, isAdmin, role } = useSystemAuth();

  // 로딩 중
  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">시스템 관리자 권한 확인 중...</p>
          </div>
        </div>
      )
    );
  }

  // ADMIN이 아닌 경우
  if (!isAuthorized || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <ShieldAlert className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">시스템 관리자 전용</h2>
          <p className="mt-2 text-muted-foreground">
            이 페이지는 시스템 관리자(ADMIN)만 접근할 수 있습니다.
            {role && (
              <span className="block mt-1 text-sm">
                현재 역할: <span className="font-medium">{role}</span>
              </span>
            )}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/admin">관장 대시보드로 이동</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
