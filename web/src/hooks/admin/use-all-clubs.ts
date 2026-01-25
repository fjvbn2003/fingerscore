"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SystemClub {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  owner_id: string;
  is_verified: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: {
    id: string;
    display_name: string;
    email: string | null;
    avatar_url: string | null;
  };
  // 추가 통계
  total_lessons: number;
  total_revenue: number;
  coach_count: number;
}

export interface ClubFilters {
  is_verified?: boolean;
  location?: string;
  search?: string;
  created_from?: string;
  created_to?: string;
}

export interface ClubStats {
  total: number;
  verified: number;
  totalMembers: number;
  newThisMonth: number;
  byLocation: Record<string, number>;
}

interface UseAllClubsReturn {
  clubs: SystemClub[];
  stats: ClubStats;
  isLoading: boolean;
  error: Error | null;
  filters: ClubFilters;
  setFilters: (filters: ClubFilters) => void;
  refetch: () => Promise<void>;
  toggleVerified: (clubId: string) => Promise<{ success: boolean; error?: Error }>;
  deleteClub: (clubId: string) => Promise<{ success: boolean; error?: Error }>;
  // Pagination
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

/**
 * 전체 클럽 관리 훅 (ADMIN 전용)
 */
export function useAllClubs(): UseAllClubsReturn {
  const [clubs, setClubs] = useState<SystemClub[]>([]);
  const [stats, setStats] = useState<ClubStats>({
    total: 0,
    verified: 0,
    totalMembers: 0,
    newThisMonth: 0,
    byLocation: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ClubFilters>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchClubs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 기본 쿼리
      let query = supabase
        .from("clubs")
        .select(
          `
          *,
          owner:profiles!clubs_owner_id_fkey (
            id,
            display_name,
            email,
            avatar_url
          )
        `,
          { count: "exact" }
        );

      // 필터 적용
      if (filters.is_verified !== undefined) {
        query = query.eq("is_verified", filters.is_verified);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
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

      // 검색 필터 (클라이언트 사이드)
      type ClubQueryResult = {
        id: string;
        name: string;
        description: string | null;
        location: string | null;
        address: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        logo_url: string | null;
        owner_id: string;
        is_verified: boolean;
        member_count: number;
        created_at: string;
        updated_at: string;
        owner: {
          id: string;
          display_name: string;
          email: string | null;
          avatar_url: string | null;
        } | null;
      };
      let filteredData: ClubQueryResult[] = (data as ClubQueryResult[]) || [];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (club) =>
            club.name?.toLowerCase().includes(searchLower) ||
            club.location?.toLowerCase().includes(searchLower) ||
            club.owner?.display_name?.toLowerCase().includes(searchLower)
        );
      }

      // 각 클럽의 추가 통계 조회 (Note: lessons/payments/coaches tables may not exist yet)
      const clubsWithStats = filteredData.map((club) => {
        return {
          ...club,
          total_lessons: 0,
          total_revenue: 0,
          coach_count: 0,
        } as SystemClub;
      });

      setClubs(clubsWithStats);
      setTotalCount(count || 0);

      // 전체 통계 조회
      type ClubStatsResult = {
        is_verified: boolean;
        member_count: number;
        location: string | null;
        created_at: string;
      };
      const { data: allClubsData } = await supabase
        .from("clubs")
        .select("is_verified, member_count, location, created_at");

      const allClubs = (allClubsData as ClubStatsResult[]) || [];

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const byLocation: Record<string, number> = {};
      allClubs.forEach((c) => {
        const loc = c.location || "미지정";
        byLocation[loc] = (byLocation[loc] || 0) + 1;
      });

      setStats({
        total: allClubs.length,
        verified: allClubs.filter((c) => c.is_verified).length,
        totalMembers: allClubs.reduce((sum, c) => sum + (c.member_count || 0), 0),
        newThisMonth: allClubs.filter((c) => c.created_at >= monthStart).length,
        byLocation,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("클럽 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, supabase]);

  const toggleVerified = useCallback(
    async (clubId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        const club = clubs.find((c) => c.id === clubId);
        if (!club) {
          return { success: false, error: new Error("클럽을 찾을 수 없습니다.") };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("clubs")
          .update({
            is_verified: !club.is_verified,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clubId);

        if (updateError) throw updateError;

        await fetchClubs();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("인증 상태 변경에 실패했습니다.");
        return { success: false, error };
      }
    },
    [clubs, supabase, fetchClubs]
  );

  const deleteClub = useCallback(
    async (clubId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        const { error: deleteError } = await supabase.from("clubs").delete().eq("id", clubId);

        if (deleteError) throw deleteError;

        await fetchClubs();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("클럽 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchClubs]
  );

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    clubs,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchClubs,
    toggleVerified,
    deleteClub,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}
