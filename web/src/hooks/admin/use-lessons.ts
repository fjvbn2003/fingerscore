"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface Lesson {
  id: string;
  club_id: string;
  coach_id: string;
  title: string;
  description: string | null;
  type: "PRIVATE" | "GROUP" | "TRIAL";
  max_participants: number;
  current_participants: number;
  duration_minutes: number;
  price: number;
  scheduled_at: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  coach?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  participants?: LessonParticipant[];
}

export interface LessonParticipant {
  id: string;
  lesson_id: string;
  user_id: string;
  status: "REGISTERED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
  registered_at: string;
  profile?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface LessonFormData {
  coach_id: string;
  title: string;
  description?: string | null;
  type: Lesson["type"];
  max_participants: number;
  duration_minutes: number;
  price: number;
  scheduled_at: string;
  location?: string | null;
  notes?: string | null;
}

export interface LessonFilters {
  status?: Lesson["status"];
  type?: Lesson["type"];
  coach_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface LessonStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}

interface UseLessonsReturn {
  lessons: Lesson[];
  stats: LessonStats;
  isLoading: boolean;
  error: Error | null;
  filters: LessonFilters;
  setFilters: (filters: LessonFilters) => void;
  refetch: () => Promise<void>;
  createLesson: (data: LessonFormData) => Promise<{ success: boolean; error?: Error }>;
  updateLesson: (
    lessonId: string,
    data: Partial<LessonFormData>
  ) => Promise<{ success: boolean; error?: Error }>;
  cancelLesson: (lessonId: string) => Promise<{ success: boolean; error?: Error }>;
  deleteLesson: (lessonId: string) => Promise<{ success: boolean; error?: Error }>;
  // 참가자 관리
  addParticipant: (
    lessonId: string,
    userId: string
  ) => Promise<{ success: boolean; error?: Error }>;
  updateParticipantStatus: (
    participantId: string,
    status: LessonParticipant["status"]
  ) => Promise<{ success: boolean; error?: Error }>;
  removeParticipant: (participantId: string) => Promise<{ success: boolean; error?: Error }>;
  // 캘린더 데이터
  getCalendarData: (year: number, month: number) => Lesson[];
}

/**
 * 레슨 관리 훅
 */
export function useLessons(): UseLessonsReturn {
  const { club } = useClub();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [stats, setStats] = useState<LessonStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<LessonFilters>({});

  const supabase = createClient();

  const fetchLessons = useCallback(async () => {
    if (!club?.id) {
      setLessons([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("lessons")
        .select(
          `
          *,
          coach:profiles!lessons_coach_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          participants:lesson_participants (
            id,
            lesson_id,
            user_id,
            status,
            registered_at,
            profile:profiles!lesson_participants_user_id_fkey (
              id,
              display_name,
              avatar_url
            )
          )
        `
        )
        .eq("club_id", club.id);

      // 필터 적용
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.coach_id) {
        query = query.eq("coach_id", filters.coach_id);
      }
      if (filters.date_from) {
        query = query.gte("scheduled_at", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("scheduled_at", filters.date_to);
      }

      query = query.order("scheduled_at", { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const lessonsData = (data as Lesson[]) || [];
      setLessons(lessonsData);

      // 통계 계산
      const completedLessons = lessonsData.filter((l) => l.status === "COMPLETED");
      setStats({
        total: lessonsData.length,
        scheduled: lessonsData.filter((l) => l.status === "SCHEDULED").length,
        completed: completedLessons.length,
        cancelled: lessonsData.filter((l) => l.status === "CANCELLED").length,
        totalRevenue: completedLessons.reduce(
          (sum, l) => sum + l.price * l.current_participants,
          0
        ),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("레슨 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, filters, supabase]);

  const createLesson = useCallback(
    async (data: LessonFormData): Promise<{ success: boolean; error?: Error }> => {
      if (!club?.id) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("lessons").insert({
          club_id: club.id,
          ...data,
          current_participants: 0,
          status: "SCHEDULED",
        });

        if (insertError) throw insertError;

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("레슨 생성에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club?.id, supabase, fetchLessons]
  );

  const updateLesson = useCallback(
    async (
      lessonId: string,
      data: Partial<LessonFormData>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("lessons")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", lessonId);

        if (updateError) throw updateError;

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("레슨 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const cancelLesson = useCallback(
    async (lessonId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("lessons")
          .update({
            status: "CANCELLED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", lessonId);

        if (updateError) throw updateError;

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("레슨 취소에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const deleteLesson = useCallback(
    async (lessonId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any).from("lessons").delete().eq("id", lessonId);

        if (deleteError) throw deleteError;

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("레슨 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const addParticipant = useCallback(
    async (lessonId: string, userId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("lesson_participants").insert({
          lesson_id: lessonId,
          user_id: userId,
          status: "REGISTERED",
          registered_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        // 참가자 수 증가
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).rpc("increment_lesson_participants", { lesson_id: lessonId });

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("참가자 추가에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const updateParticipantStatus = useCallback(
    async (
      participantId: string,
      status: LessonParticipant["status"]
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("lesson_participants")
          .update({ status })
          .eq("id", participantId);

        if (updateError) throw updateError;

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("참가자 상태 변경에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const removeParticipant = useCallback(
    async (participantId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // 먼저 lesson_id 조회
        const { data: participant } = await supabase
          .from("lesson_participants")
          .select("lesson_id")
          .eq("id", participantId)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any)
          .from("lesson_participants")
          .delete()
          .eq("id", participantId);

        if (deleteError) throw deleteError;

        // 참가자 수 감소
        if (participant) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).rpc("decrement_lesson_participants", {
            lesson_id: (participant as { lesson_id: string }).lesson_id,
          });
        }

        await fetchLessons();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("참가자 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchLessons]
  );

  const getCalendarData = useCallback(
    (year: number, month: number): Lesson[] => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      return lessons.filter((lesson) => {
        const lessonDate = new Date(lesson.scheduled_at);
        return lessonDate >= startDate && lessonDate <= endDate;
      });
    },
    [lessons]
  );

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchLessons,
    createLesson,
    updateLesson,
    cancelLesson,
    deleteLesson,
    addParticipant,
    updateParticipantStatus,
    removeParticipant,
    getCalendarData,
  };
}
