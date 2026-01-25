"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface ExchangeMatch {
  id: string;
  requesting_club_id: string;
  receiving_club_id: string;
  title: string;
  description: string | null;
  proposed_date: string;
  proposed_time: string | null;
  location: string | null;
  venue: string | null;
  sport_type: "TABLE_TENNIS" | "BILLIARDS";
  match_format: "SINGLES" | "DOUBLES" | "TEAM";
  participant_count: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  notes: string | null;
  response_message: string | null;
  responded_at: string | null;
  completed_at: string | null;
  result_summary: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  requesting_club?: {
    id: string;
    name: string;
    logo_url: string | null;
    location: string | null;
  };
  receiving_club?: {
    id: string;
    name: string;
    logo_url: string | null;
    location: string | null;
  };
}

export interface ExchangeMatchFormData {
  receiving_club_id: string;
  title: string;
  description?: string | null;
  proposed_date: string;
  proposed_time?: string | null;
  location?: string | null;
  venue?: string | null;
  sport_type: ExchangeMatch["sport_type"];
  match_format: ExchangeMatch["match_format"];
  participant_count: number;
  notes?: string | null;
}

export interface ExchangeMatchFilters {
  status?: ExchangeMatch["status"];
  sport_type?: ExchangeMatch["sport_type"];
  direction?: "sent" | "received" | "all";
  date_from?: string;
  date_to?: string;
}

export interface ExchangeMatchStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  sentCount: number;
  receivedCount: number;
}

interface UseExchangeMatchesReturn {
  matches: ExchangeMatch[];
  stats: ExchangeMatchStats;
  isLoading: boolean;
  error: Error | null;
  filters: ExchangeMatchFilters;
  setFilters: (filters: ExchangeMatchFilters) => void;
  refetch: () => Promise<void>;
  createMatch: (data: ExchangeMatchFormData) => Promise<{ success: boolean; error?: Error }>;
  updateMatch: (
    matchId: string,
    data: Partial<ExchangeMatchFormData>
  ) => Promise<{ success: boolean; error?: Error }>;
  acceptMatch: (
    matchId: string,
    message?: string
  ) => Promise<{ success: boolean; error?: Error }>;
  rejectMatch: (matchId: string, message?: string) => Promise<{ success: boolean; error?: Error }>;
  cancelMatch: (matchId: string) => Promise<{ success: boolean; error?: Error }>;
  completeMatch: (
    matchId: string,
    resultSummary: string
  ) => Promise<{ success: boolean; error?: Error }>;
  // 클럽 검색 (교류전 제안용)
  searchClubs: (query: string) => Promise<
    {
      id: string;
      name: string;
      logo_url: string | null;
      location: string | null;
    }[]
  >;
}

/**
 * 교류전 관리 훅
 */
export function useExchangeMatches(): UseExchangeMatchesReturn {
  const { club } = useClub();
  const [matches, setMatches] = useState<ExchangeMatch[]>([]);
  const [stats, setStats] = useState<ExchangeMatchStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    sentCount: 0,
    receivedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ExchangeMatchFilters>({ direction: "all" });

  const supabase = createClient();

  const fetchMatches = useCallback(async () => {
    if (!club?.id) {
      setMatches([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("exchange_matches")
        .select(
          `
          *,
          requesting_club:clubs!exchange_matches_requesting_club_id_fkey (
            id,
            name,
            logo_url,
            location
          ),
          receiving_club:clubs!exchange_matches_receiving_club_id_fkey (
            id,
            name,
            logo_url,
            location
          )
        `
        )
        .or(`requesting_club_id.eq.${club.id},receiving_club_id.eq.${club.id}`);

      // 필터 적용
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.sport_type) {
        query = query.eq("sport_type", filters.sport_type);
      }
      if (filters.date_from) {
        query = query.gte("proposed_date", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("proposed_date", filters.date_to);
      }

      query = query.order("proposed_date", { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let filteredData = (data as ExchangeMatch[]) || [];

      // 방향 필터 (클라이언트 사이드)
      if (filters.direction === "sent") {
        filteredData = filteredData.filter((m) => m.requesting_club_id === club.id);
      } else if (filters.direction === "received") {
        filteredData = filteredData.filter((m) => m.receiving_club_id === club.id);
      }

      setMatches(filteredData);

      // 통계 계산
      const allData = (data as ExchangeMatch[]) || [];
      const sent = allData.filter((m) => m.requesting_club_id === club.id);
      const received = allData.filter((m) => m.receiving_club_id === club.id);

      setStats({
        total: allData.length,
        pending: allData.filter((m) => m.status === "PENDING").length,
        accepted: allData.filter((m) => m.status === "ACCEPTED").length,
        completed: allData.filter((m) => m.status === "COMPLETED").length,
        sentCount: sent.length,
        receivedCount: received.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("교류전 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, filters, supabase]);

  const createMatch = useCallback(
    async (data: ExchangeMatchFormData): Promise<{ success: boolean; error?: Error }> => {
      if (!club?.id) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("exchange_matches").insert({
          requesting_club_id: club.id,
          ...data,
          status: "PENDING",
        });

        if (insertError) throw insertError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 제안에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club?.id, supabase, fetchMatches]
  );

  const updateMatch = useCallback(
    async (
      matchId: string,
      data: Partial<ExchangeMatchFormData>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("exchange_matches")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (updateError) throw updateError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMatches]
  );

  const acceptMatch = useCallback(
    async (matchId: string, message?: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("exchange_matches")
          .update({
            status: "ACCEPTED",
            response_message: message || null,
            responded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (updateError) throw updateError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 수락에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMatches]
  );

  const rejectMatch = useCallback(
    async (matchId: string, message?: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("exchange_matches")
          .update({
            status: "REJECTED",
            response_message: message || null,
            responded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (updateError) throw updateError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 거절에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMatches]
  );

  const cancelMatch = useCallback(
    async (matchId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("exchange_matches")
          .update({
            status: "CANCELLED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (updateError) throw updateError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 취소에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMatches]
  );

  const completeMatch = useCallback(
    async (
      matchId: string,
      resultSummary: string
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("exchange_matches")
          .update({
            status: "COMPLETED",
            result_summary: resultSummary,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchId);

        if (updateError) throw updateError;

        await fetchMatches();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("교류전 완료 처리에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchMatches]
  );

  const searchClubs = useCallback(
    async (
      query: string
    ): Promise<
      {
        id: string;
        name: string;
        logo_url: string | null;
        location: string | null;
      }[]
    > => {
      if (!query || query.length < 2) return [];

      try {
        const { data, error: searchError } = await supabase
          .from("clubs")
          .select("id, name, logo_url, location")
          .neq("id", club?.id || "")
          .ilike("name", `%${query}%`)
          .limit(10);

        if (searchError) throw searchError;

        return data || [];
      } catch {
        return [];
      }
    },
    [club?.id, supabase]
  );

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchMatches,
    createMatch,
    updateMatch,
    acceptMatch,
    rejectMatch,
    cancelMatch,
    completeMatch,
    searchClubs,
  };
}
