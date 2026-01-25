"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface Coach {
  id: string;
  club_id: string;
  user_id: string;
  specialties: string[] | null;
  bio: string | null;
  hourly_rate: number | null;
  availability: Record<string, { start: string; end: string }[]> | null;
  is_active: boolean;
  total_lessons: number;
  total_students: number;
  average_rating: number | null;
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

export interface CoachFormData {
  user_id: string;
  specialties?: string[] | null;
  bio?: string | null;
  hourly_rate?: number | null;
  availability?: Record<string, { start: string; end: string }[]> | null;
  is_active?: boolean;
}

export interface CoachFilters {
  is_active?: boolean;
  specialty?: string;
  search?: string;
}

export interface CoachStats {
  total: number;
  active: number;
  totalLessons: number;
  totalStudents: number;
  averageRating: number;
}

interface UseCoachesReturn {
  coaches: Coach[];
  stats: CoachStats;
  isLoading: boolean;
  error: Error | null;
  filters: CoachFilters;
  setFilters: (filters: CoachFilters) => void;
  refetch: () => Promise<void>;
  addCoach: (data: CoachFormData) => Promise<{ success: boolean; error?: Error }>;
  updateCoach: (
    coachId: string,
    data: Partial<CoachFormData>
  ) => Promise<{ success: boolean; error?: Error }>;
  removeCoach: (coachId: string) => Promise<{ success: boolean; error?: Error }>;
  toggleActive: (coachId: string) => Promise<{ success: boolean; error?: Error }>;
  // 스케줄 관리
  getCoachSchedule: (coachId: string, date: Date) => { start: string; end: string }[];
  updateCoachSchedule: (
    coachId: string,
    availability: Record<string, { start: string; end: string }[]>
  ) => Promise<{ success: boolean; error?: Error }>;
}

/**
 * 코치 관리 훅
 */
export function useCoaches(): UseCoachesReturn {
  const { club } = useClub();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [stats, setStats] = useState<CoachStats>({
    total: 0,
    active: 0,
    totalLessons: 0,
    totalStudents: 0,
    averageRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<CoachFilters>({});

  const supabase = createClient();

  const fetchCoaches = useCallback(async () => {
    if (!club?.id) {
      setCoaches([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("coaches")
        .select(
          `
          *,
          profile:profiles!coaches_user_id_fkey (
            id,
            display_name,
            avatar_url,
            email,
            phone
          )
        `
        )
        .eq("club_id", club.id);

      // 필터 적용
      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let filteredData = (data as Coach[]) || [];

      // 검색 필터 (클라이언트 사이드)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (coach) =>
            coach.profile?.display_name?.toLowerCase().includes(searchLower) ||
            coach.profile?.email?.toLowerCase().includes(searchLower)
        );
      }

      // 전문 분야 필터 (클라이언트 사이드)
      if (filters.specialty) {
        filteredData = filteredData.filter((coach) =>
          coach.specialties?.includes(filters.specialty!)
        );
      }

      setCoaches(filteredData);

      // 통계 계산
      const activeCoaches = filteredData.filter((c) => c.is_active);
      const ratingsSum = filteredData.reduce((sum, c) => sum + (c.average_rating || 0), 0);
      const ratingsCount = filteredData.filter((c) => c.average_rating !== null).length;

      setStats({
        total: filteredData.length,
        active: activeCoaches.length,
        totalLessons: filteredData.reduce((sum, c) => sum + c.total_lessons, 0),
        totalStudents: filteredData.reduce((sum, c) => sum + c.total_students, 0),
        averageRating: ratingsCount > 0 ? ratingsSum / ratingsCount : 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("코치 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, filters, supabase]);

  const addCoach = useCallback(
    async (data: CoachFormData): Promise<{ success: boolean; error?: Error }> => {
      if (!club?.id) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // 먼저 해당 사용자를 club_members에 COACH 역할로 추가/업데이트
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: memberError } = await (supabase as any).from("club_members").upsert(
          {
            club_id: club.id,
            user_id: data.user_id,
            role: "COACH",
            status: "ACTIVE",
            joined_at: new Date().toISOString(),
          },
          { onConflict: "club_id,user_id" }
        );

        if (memberError) throw memberError;

        // 코치 테이블에 추가
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("coaches").insert({
          club_id: club.id,
          ...data,
          is_active: data.is_active ?? true,
          total_lessons: 0,
          total_students: 0,
        });

        if (insertError) throw insertError;

        await fetchCoaches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("코치 추가에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club?.id, supabase, fetchCoaches]
  );

  const updateCoach = useCallback(
    async (
      coachId: string,
      data: Partial<CoachFormData>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("coaches")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", coachId);

        if (updateError) throw updateError;

        await fetchCoaches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("코치 정보 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchCoaches]
  );

  const removeCoach = useCallback(
    async (coachId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any).from("coaches").delete().eq("id", coachId);

        if (deleteError) throw deleteError;

        await fetchCoaches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("코치 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchCoaches]
  );

  const toggleActive = useCallback(
    async (coachId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        const coach = coaches.find((c) => c.id === coachId);
        if (!coach) {
          return { success: false, error: new Error("코치를 찾을 수 없습니다.") };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("coaches")
          .update({
            is_active: !coach.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", coachId);

        if (updateError) throw updateError;

        await fetchCoaches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("코치 상태 변경에 실패했습니다.");
        return { success: false, error };
      }
    },
    [coaches, supabase, fetchCoaches]
  );

  const getCoachSchedule = useCallback(
    (coachId: string, date: Date): { start: string; end: string }[] => {
      const coach = coaches.find((c) => c.id === coachId);
      if (!coach?.availability) return [];

      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayName = dayNames[date.getDay()];

      return coach.availability[dayName] || [];
    },
    [coaches]
  );

  const updateCoachSchedule = useCallback(
    async (
      coachId: string,
      availability: Record<string, { start: string; end: string }[]>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("coaches")
          .update({
            availability,
            updated_at: new Date().toISOString(),
          })
          .eq("id", coachId);

        if (updateError) throw updateError;

        await fetchCoaches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("스케줄 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchCoaches]
  );

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  return {
    coaches,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchCoaches,
    addCoach,
    updateCoach,
    removeCoach,
    toggleActive,
    getCoachSchedule,
    updateCoachSchedule,
  };
}
