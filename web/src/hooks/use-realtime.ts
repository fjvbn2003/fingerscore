"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * 실시간 스코어 구독 훅
 */
export function useLiveScore(matchId: string | null) {
  const [score, setScore] = useState<{
    score_a: number;
    score_b: number;
    sets_a: number;
    sets_b: number;
    is_serving_a: boolean;
    is_live: boolean;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const supabase = createClient();

    // 초기 데이터 로드
    const loadInitialScore = async () => {
      const { data } = await supabase
        .from("live_scores")
        .select("*")
        .eq("match_id", matchId)
        .single();

      if (data) {
        const scoreData = data as {
          current_score_a: number;
          current_score_b: number;
          current_sets_a: number;
          current_sets_b: number;
          is_serving_a: boolean;
          is_live: boolean;
        };
        setScore({
          score_a: scoreData.current_score_a,
          score_b: scoreData.current_score_b,
          sets_a: scoreData.current_sets_a,
          sets_b: scoreData.current_sets_b,
          is_serving_a: scoreData.is_serving_a,
          is_live: scoreData.is_live,
        });
      }
    };

    loadInitialScore();

    // 실시간 구독
    const channel = supabase
      .channel(`live_score:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_scores",
          filter: `match_id=eq.${matchId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          const newData = payload.new as Record<string, unknown>;
          if (newData) {
            setScore({
              score_a: newData.current_score_a as number,
              score_b: newData.current_score_b as number,
              sets_a: newData.current_sets_a as number,
              sets_b: newData.current_sets_b as number,
              is_serving_a: newData.is_serving_a as boolean,
              is_live: newData.is_live as boolean,
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [matchId]);

  return { score, isConnected };
}

/**
 * 대진표 실시간 업데이트 구독 훅
 */
export function useBracketRealtime(tournamentId: string | null) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onUpdateRef = useRef<(() => void) | null>(null);

  const setOnUpdate = useCallback((callback: () => void) => {
    onUpdateRef.current = callback;
  }, []);

  useEffect(() => {
    if (!tournamentId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`bracket:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          setLastUpdate(new Date());
          onUpdateRef.current?.();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      channel.unsubscribe();
    };
  }, [tournamentId]);

  return { lastUpdate, isConnected, setOnUpdate };
}

/**
 * 스코어 제출 알림 구독 (운영진용)
 */
export function useScoreSubmissions(tournamentId: string | null) {
  const [pendingSubmissions, setPendingSubmissions] = useState<
    Array<{
      id: string;
      match_id: string;
      submitted_by: string;
      score_a: number;
      score_b: number;
      created_at: string;
    }>
  >([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;

    const supabase = createClient();

    // 초기 데이터 로드
    const loadPendingSubmissions = async () => {
      const { data } = await supabase
        .from("score_submissions")
        .select(`
          id,
          match_id,
          submitted_by,
          score_a,
          score_b,
          created_at,
          matches!inner(tournament_id)
        `)
        .eq("status", "PENDING")
        .eq("matches.tournament_id", tournamentId);

      if (data) {
        setPendingSubmissions(data as never);
      }
    };

    loadPendingSubmissions();

    // 실시간 구독
    const channel = supabase
      .channel(`submissions:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "score_submissions",
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          const newData = payload.new as Record<string, unknown>;
          if (newData) {
            setPendingSubmissions((prev) => [
              ...prev,
              {
                id: newData.id as string,
                match_id: newData.match_id as string,
                submitted_by: newData.submitted_by as string,
                score_a: newData.score_a as number,
                score_b: newData.score_b as number,
                created_at: newData.created_at as string,
              },
            ]);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      channel.unsubscribe();
    };
  }, [tournamentId]);

  const approveSubmission = useCallback(
    async (submissionId: string) => {
      const supabase = createClient();

      await supabase
        .from("score_submissions")
        .update({ status: "APPROVED" } as never)
        .eq("id", submissionId);

      setPendingSubmissions((prev) =>
        prev.filter((s) => s.id !== submissionId)
      );
    },
    []
  );

  const rejectSubmission = useCallback(
    async (submissionId: string) => {
      const supabase = createClient();

      await supabase
        .from("score_submissions")
        .update({ status: "REJECTED" } as never)
        .eq("id", submissionId);

      setPendingSubmissions((prev) =>
        prev.filter((s) => s.id !== submissionId)
      );
    },
    []
  );

  return {
    pendingSubmissions,
    isConnected,
    approveSubmission,
    rejectSubmission,
  };
}

/**
 * 알림 실시간 구독
 */
export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      body: string;
      is_read: boolean;
      created_at: string;
    }>
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // 초기 데이터 로드
    const loadNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        const notificationsData = data as Array<{
          id: string;
          type: string;
          title: string;
          body: string;
          is_read: boolean;
          created_at: string;
        }>;
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter((n) => !n.is_read).length);
      }
    };

    loadNotifications();

    // 실시간 구독
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          const newData = payload.new as {
            id: string;
            type: string;
            title: string;
            body: string;
            is_read: boolean;
            created_at: string;
          };
          if (newData) {
            setNotifications((prev) => [newData, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const supabase = createClient();

      await supabase
        .from("notifications")
        .update({ is_read: true } as never)
        .eq("id", notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();

    await supabase
      .from("notifications")
      .update({ is_read: true } as never)
      .eq("user_id", userId)
      .eq("is_read", false);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    setUnreadCount(0);
  }, [userId]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
