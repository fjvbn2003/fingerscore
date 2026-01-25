"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "USER" | "ORGANIZER" | "CLUB_OWNER" | "ADMIN";

export interface SystemUser {
  id: string;
  email: string | null;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  role: UserRole;
  is_verified: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  // 추가 정보
  clubs_owned: number;
  clubs_member_of: number;
}

export interface UserFilters {
  role?: UserRole;
  is_verified?: boolean;
  search?: string;
  created_from?: string;
  created_to?: string;
}

export interface UserStats {
  total: number;
  byRole: Record<UserRole, number>;
  verified: number;
  newThisMonth: number;
}

interface UseAllUsersReturn {
  users: SystemUser[];
  stats: UserStats;
  isLoading: boolean;
  error: Error | null;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  refetch: () => Promise<void>;
  updateUserRole: (
    userId: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: Error }>;
  toggleVerified: (userId: string) => Promise<{ success: boolean; error?: Error }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: Error }>;
  // Pagination
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

/**
 * 전체 사용자 관리 훅 (ADMIN 전용)
 */
export function useAllUsers(): UseAllUsersReturn {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    byRole: { USER: 0, ORGANIZER: 0, CLUB_OWNER: 0, ADMIN: 0 },
    verified: 0,
    newThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 기본 쿼리
      let query = supabase.from("profiles").select("*", { count: "exact" });

      // 필터 적용
      if (filters.role) {
        query = query.eq("role", filters.role);
      }
      if (filters.is_verified !== undefined) {
        query = query.eq("is_verified", filters.is_verified);
      }
      if (filters.created_from) {
        query = query.gte("created_at", filters.created_from);
      }
      if (filters.created_to) {
        query = query.lte("created_at", filters.created_to);
      }

      // 페이지네이션
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // 타입 정의
      type ProfileQueryResult = {
        id: string;
        email: string | null;
        display_name: string;
        avatar_url: string | null;
        phone: string | null;
        bio: string | null;
        role: UserRole;
        is_verified: boolean;
        current_rating: number;
        created_at: string;
        updated_at: string;
      };

      // 검색 필터 (클라이언트 사이드)
      let filteredData: ProfileQueryResult[] = (data as ProfileQueryResult[]) || [];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (user) =>
            user.display_name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.phone?.includes(filters.search!)
        );
      }

      // 각 사용자의 클럽 관련 정보 조회 (간단하게 카운트 없이)
      const usersWithClubInfo = filteredData.map((user) => {
        return {
          ...user,
          rating: user.current_rating || 0,
          last_sign_in_at: null,
          clubs_owned: 0,
          clubs_member_of: 0,
        } as SystemUser;
      });

      setUsers(usersWithClubInfo);
      setTotalCount(count || 0);

      // 전체 통계 조회
      type ProfileStatsResult = {
        role: UserRole;
        is_verified: boolean;
        created_at: string;
      };
      const { data: allProfilesData } = await supabase
        .from("profiles")
        .select("role, is_verified, created_at");

      const allProfiles = (allProfilesData as ProfileStatsResult[]) || [];

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const byRole: Record<UserRole, number> = {
        USER: 0,
        ORGANIZER: 0,
        CLUB_OWNER: 0,
        ADMIN: 0,
      };

      allProfiles.forEach((p) => {
        if (p.role in byRole) {
          byRole[p.role as UserRole]++;
        }
      });

      setStats({
        total: allProfiles.length,
        byRole,
        verified: allProfiles.filter((p) => p.is_verified).length,
        newThisMonth: allProfiles.filter((p) => p.created_at >= monthStart).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("사용자 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, supabase]);

  const updateUserRole = useCallback(
    async (userId: string, role: UserRole): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("profiles")
          .update({
            role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) throw updateError;

        await fetchUsers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("역할 변경에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchUsers]
  );

  const toggleVerified = useCallback(
    async (userId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          return { success: false, error: new Error("사용자를 찾을 수 없습니다.") };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("profiles")
          .update({
            is_verified: !user.is_verified,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) throw updateError;

        await fetchUsers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("인증 상태 변경에 실패했습니다.");
        return { success: false, error };
      }
    },
    [users, supabase, fetchUsers]
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // 프로필 삭제 (auth.users는 별도 처리 필요)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any)
          .from("profiles")
          .delete()
          .eq("id", userId);

        if (deleteError) throw deleteError;

        await fetchUsers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("사용자 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    users,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchUsers,
    updateUserRole,
    toggleVerified,
    deleteUser,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}
