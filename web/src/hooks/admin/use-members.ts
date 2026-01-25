"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: "MEMBER" | "COACH" | "MANAGER";
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  joined_at: string;
  membership_start: string | null;
  membership_end: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
  };
}

export interface MemberFormData {
  user_id: string;
  role?: ClubMember["role"];
  status?: ClubMember["status"];
  membership_start?: string | null;
  membership_end?: string | null;
  notes?: string | null;
}

export interface MemberFilters {
  status?: ClubMember["status"];
  role?: ClubMember["role"];
  search?: string;
}

export interface MemberStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  coaches: number;
}

interface UseMembersReturn {
  members: ClubMember[];
  stats: MemberStats;
  isLoading: boolean;
  error: Error | null;
  filters: MemberFilters;
  setFilters: (filters: MemberFilters) => void;
  refetch: () => Promise<void>;
  addMember: (data: MemberFormData) => Promise<{ success: boolean; error?: Error }>;
  updateMember: (
    memberId: string,
    data: Partial<MemberFormData>
  ) => Promise<{ success: boolean; error?: Error }>;
  removeMember: (memberId: string) => Promise<{ success: boolean; error?: Error }>;
  // Pagination
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

/**
 * 클럽 회원 관리 훅
 */
export function useMembers(): UseMembersReturn {
  const { club } = useClub();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    coaches: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<MemberFilters>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    if (!club?.id) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 기본 쿼리 생성
      let query = supabase
        .from("club_members")
        .select(
          `
          *,
          profile:profiles!club_members_user_id_fkey (
            id,
            display_name,
            avatar_url,
            email,
            phone
          )
        `,
          { count: "exact" }
        )
        .eq("club_id", club.id);

      // 필터 적용
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.role) {
        query = query.eq("role", filters.role);
      }

      // 페이지네이션
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // 검색 필터 (클라이언트 사이드)
      let filteredData = (data as ClubMember[]) || [];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (member) =>
            member.profile?.display_name?.toLowerCase().includes(searchLower) ||
            member.profile?.email?.toLowerCase().includes(searchLower) ||
            member.profile?.phone?.includes(filters.search!)
        );
      }

      setMembers(filteredData);
      setTotalCount(count || 0);

      // 통계 조회
      type MemberStatsResult = { status: string; role: string };
      const { data: statsDataRaw } = await supabase
        .from("club_members")
        .select("status, role")
        .eq("club_id", club.id);

      const statsData = (statsDataRaw as MemberStatsResult[]) || [];
      setStats({
        total: statsData.length,
        active: statsData.filter((m) => m.status === "ACTIVE").length,
        inactive: statsData.filter((m) => m.status === "INACTIVE").length,
        pending: statsData.filter((m) => m.status === "PENDING").length,
        coaches: statsData.filter((m) => m.role === "COACH").length,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("회원 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, filters, page, supabase]);

  const addMember = useCallback(
    async (data: MemberFormData): Promise<{ success: boolean; error?: Error }> => {
      if (!club?.id) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("club_members").insert({
          club_id: club.id,
          user_id: data.user_id,
          role: data.role || "MEMBER",
          status: data.status || "PENDING",
          membership_start: data.membership_start,
          membership_end: data.membership_end,
          notes: data.notes,
          joined_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        await fetchMembers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("회원 추가에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club?.id, supabase, fetchMembers]
  );

  const updateMember = useCallback(
    async (
      memberId: string,
      data: Partial<MemberFormData>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("club_members")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", memberId);

        if (updateError) throw updateError;

        await fetchMembers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("회원 정보 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMembers]
  );

  const removeMember = useCallback(
    async (memberId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any)
          .from("club_members")
          .delete()
          .eq("id", memberId);

        if (deleteError) throw deleteError;

        await fetchMembers();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("회원 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMembers]
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    members,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchMembers,
    addMember,
    updateMember,
    removeMember,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}
