"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { UserRole } from "@/types/database";

interface UseAdminAuthOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

interface UseAdminAuthReturn {
  isLoading: boolean;
  isAuthorized: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isClubOwner: boolean;
  clubId: string | null;
}

/**
 * Admin 권한 확인 훅
 * - ADMIN: 모든 Admin 페이지 접근 가능
 * - CLUB_OWNER: /admin/system 제외한 Admin 페이지 접근 가능
 * - USER: Admin 접근 불가
 */
export function useAdminAuth(options: UseAdminAuthOptions = {}): UseAdminAuthReturn {
  const { requiredRole, redirectTo = "/auth/login" } = options;
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = profile?.role as UserRole | null;
  const isAdmin = role === "ADMIN";
  const isClubOwner = role === "CLUB_OWNER";

  // Admin 영역 접근 권한 확인
  const isAuthorized = useMemo(() => {
    if (!user || !profile) return false;

    // 기본적으로 ADMIN, CLUB_OWNER만 Admin 접근 가능
    const adminRoles: UserRole[] = ["ADMIN", "CLUB_OWNER"];

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.includes(role as UserRole);
    }

    return adminRoles.includes(role as UserRole);
  }, [user, profile, role, requiredRole]);

  // 권한 없으면 리다이렉트
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // 미로그인 시 로그인 페이지로
      const locale = pathname.split("/")[1] || "ko";
      router.replace(`/${locale}${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAuthorized) {
      // 권한 없음 시 홈으로
      const locale = pathname.split("/")[1] || "ko";
      router.replace(`/${locale}?error=unauthorized`);
    }
  }, [isLoading, user, isAuthorized, router, pathname, redirectTo]);

  return {
    isLoading,
    isAuthorized,
    role,
    isAdmin,
    isClubOwner,
    clubId: null, // Club ID is fetched separately via useClub hook
  };
}

/**
 * ADMIN 전용 권한 확인 훅
 */
export function useSystemAuth(): UseAdminAuthReturn {
  return useAdminAuth({ requiredRole: "ADMIN" });
}

/**
 * 특정 역할 확인 유틸리티
 */
export function hasRole(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Admin 메뉴 접근 권한 확인
 */
export function canAccessAdminMenu(role: UserRole | null, menuPath: string): boolean {
  if (!role) return false;

  // ADMIN은 모든 메뉴 접근 가능
  if (role === "ADMIN") return true;

  // CLUB_OWNER는 system 메뉴 제외
  if (role === "CLUB_OWNER") {
    return !menuPath.includes("/system");
  }

  return false;
}
