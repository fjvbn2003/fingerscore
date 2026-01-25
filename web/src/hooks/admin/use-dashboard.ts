"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface DashboardStats {
  // 회원 통계
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  memberGrowthRate: number;

  // 레슨 통계
  totalLessons: number;
  scheduledLessons: number;
  completedLessonsThisMonth: number;
  lessonCompletionRate: number;

  // 매출 통계
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  revenueGrowthRate: number;

  // 코치 통계
  totalCoaches: number;
  activeCoaches: number;

  // 교류전 통계
  exchangeMatchesThisMonth: number;
  pendingExchangeMatches: number;
}

export interface RecentActivity {
  id: string;
  type: "MEMBER_JOINED" | "LESSON_COMPLETED" | "PAYMENT_RECEIVED" | "EXCHANGE_MATCH_ACCEPTED";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface UpcomingEvent {
  id: string;
  type: "LESSON" | "EXCHANGE_MATCH" | "MEMBERSHIP_EXPIRY";
  title: string;
  date: string;
  time?: string;
  metadata?: Record<string, unknown>;
}

interface UseDashboardReturn {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingEvents: UpcomingEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const initialStats: DashboardStats = {
  totalMembers: 0,
  activeMembers: 0,
  newMembersThisMonth: 0,
  memberGrowthRate: 0,
  totalLessons: 0,
  scheduledLessons: 0,
  completedLessonsThisMonth: 0,
  lessonCompletionRate: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  pendingPayments: 0,
  revenueGrowthRate: 0,
  totalCoaches: 0,
  activeCoaches: 0,
  exchangeMatchesThisMonth: 0,
  pendingExchangeMatches: 0,
};

/**
 * 관장 대시보드 통계 훅
 */
export function useDashboard(): UseDashboardReturn {
  const { club } = useClub();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchDashboard = useCallback(async () => {
    if (!club?.id) {
      setStats(initialStats);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // 병렬로 모든 데이터 조회
      const [
        membersResult,
        newMembersResult,
        lastMonthMembersResult,
        lessonsResult,
        completedLessonsResult,
        scheduledLessonsResult,
        paymentsResult,
        monthlyPaymentsResult,
        lastMonthPaymentsResult,
        pendingPaymentsResult,
        coachesResult,
        exchangeMatchesResult,
        pendingExchangeMatchesResult,
      ] = await Promise.all([
        // 전체 회원 수
        supabase
          .from("club_members")
          .select("status", { count: "exact" })
          .eq("club_id", club.id),
        // 이번 달 신규 회원
        supabase
          .from("club_members")
          .select("id", { count: "exact" })
          .eq("club_id", club.id)
          .gte("joined_at", monthStart),
        // 지난 달 신규 회원 (성장률 계산용)
        supabase
          .from("club_members")
          .select("id", { count: "exact" })
          .eq("club_id", club.id)
          .gte("joined_at", lastMonthStart)
          .lt("joined_at", lastMonthEnd),
        // 전체 레슨 수
        supabase
          .from("lessons")
          .select("status", { count: "exact" })
          .eq("club_id", club.id),
        // 이번 달 완료된 레슨
        supabase
          .from("lessons")
          .select("id", { count: "exact" })
          .eq("club_id", club.id)
          .eq("status", "COMPLETED")
          .gte("scheduled_at", monthStart),
        // 예정된 레슨
        supabase
          .from("lessons")
          .select("id, title, scheduled_at", { count: "exact" })
          .eq("club_id", club.id)
          .eq("status", "SCHEDULED")
          .gte("scheduled_at", now.toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(5),
        // 전체 매출
        supabase
          .from("payments")
          .select("amount")
          .eq("club_id", club.id)
          .eq("status", "COMPLETED"),
        // 이번 달 매출
        supabase
          .from("payments")
          .select("amount")
          .eq("club_id", club.id)
          .eq("status", "COMPLETED")
          .gte("paid_at", monthStart),
        // 지난 달 매출 (성장률 계산용)
        supabase
          .from("payments")
          .select("amount")
          .eq("club_id", club.id)
          .eq("status", "COMPLETED")
          .gte("paid_at", lastMonthStart)
          .lt("paid_at", lastMonthEnd),
        // 미수금
        supabase
          .from("payments")
          .select("amount")
          .eq("club_id", club.id)
          .eq("status", "PENDING"),
        // 코치
        supabase
          .from("coaches")
          .select("is_active", { count: "exact" })
          .eq("club_id", club.id),
        // 이번 달 교류전
        supabase
          .from("exchange_matches")
          .select("id", { count: "exact" })
          .or(`requesting_club_id.eq.${club.id},receiving_club_id.eq.${club.id}`)
          .gte("proposed_date", monthStart),
        // 대기 중인 교류전
        supabase
          .from("exchange_matches")
          .select("id, title, proposed_date", { count: "exact" })
          .eq("receiving_club_id", club.id)
          .eq("status", "PENDING"),
      ]);

      // 통계 계산 (타입 단언 사용)
      type MemberStatus = { status: string };
      type LessonStatus = { status: string };
      type PaymentAmount = { amount: number };
      type CoachActive = { is_active: boolean };
      type LessonSchedule = { id: string; title: string; scheduled_at: string };
      type ExchangeMatchPending = { id: string; title: string; proposed_date: string };

      const totalMembers = membersResult.count || 0;
      const activeMembers = ((membersResult.data || []) as MemberStatus[]).filter(
        (m) => m.status === "ACTIVE"
      ).length;
      const newMembersThisMonth = newMembersResult.count || 0;
      const lastMonthMembers = lastMonthMembersResult.count || 0;
      const memberGrowthRate =
        lastMonthMembers > 0
          ? ((newMembersThisMonth - lastMonthMembers) / lastMonthMembers) * 100
          : 0;

      const totalLessons = lessonsResult.count || 0;
      const scheduledLessons = scheduledLessonsResult.count || 0;
      const completedLessonsThisMonth = completedLessonsResult.count || 0;
      const lessonCompletionRate =
        totalLessons > 0
          ? (((lessonsResult.data || []) as LessonStatus[]).filter((l) => l.status === "COMPLETED").length /
              totalLessons) *
            100
          : 0;

      const totalRevenue = ((paymentsResult.data || []) as PaymentAmount[]).reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const monthlyRevenue = ((monthlyPaymentsResult.data || []) as PaymentAmount[]).reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const lastMonthRevenue = ((lastMonthPaymentsResult.data || []) as PaymentAmount[]).reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const pendingPaymentsAmount = ((pendingPaymentsResult.data || []) as PaymentAmount[]).reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const revenueGrowthRate =
        lastMonthRevenue > 0
          ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

      const totalCoaches = coachesResult.count || 0;
      const activeCoaches = ((coachesResult.data || []) as CoachActive[]).filter(
        (c) => c.is_active
      ).length;

      const exchangeMatchesThisMonth = exchangeMatchesResult.count || 0;
      const pendingExchangeMatches = pendingExchangeMatchesResult.count || 0;

      setStats({
        totalMembers,
        activeMembers,
        newMembersThisMonth,
        memberGrowthRate,
        totalLessons,
        scheduledLessons,
        completedLessonsThisMonth,
        lessonCompletionRate,
        totalRevenue,
        monthlyRevenue,
        pendingPayments: pendingPaymentsAmount,
        revenueGrowthRate,
        totalCoaches,
        activeCoaches,
        exchangeMatchesThisMonth,
        pendingExchangeMatches,
      });

      // 다가오는 일정
      const events: UpcomingEvent[] = [];

      // 예정된 레슨
      ((scheduledLessonsResult.data || []) as LessonSchedule[]).forEach((lesson) => {
        events.push({
          id: `lesson-${lesson.id}`,
          type: "LESSON",
          title: lesson.title,
          date: lesson.scheduled_at,
        });
      });

      // 대기 중인 교류전
      ((pendingExchangeMatchesResult.data || []) as ExchangeMatchPending[]).forEach((match) => {
        events.push({
          id: `exchange-${match.id}`,
          type: "EXCHANGE_MATCH",
          title: match.title,
          date: match.proposed_date,
        });
      });

      // 날짜순 정렬
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcomingEvents(events.slice(0, 5));

      // 최근 활동 (더미 데이터 - 실제로는 activity_log 테이블에서 조회)
      // TODO: activity_log 테이블 구현 후 실제 데이터로 교체
      setRecentActivities([]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("대시보드 데이터를 불러오는데 실패했습니다.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, supabase]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    recentActivities,
    upcomingEvents,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
