"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

export interface Club {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  operating_hours: Record<string, { open: string; close: string }> | null;
  amenities: string[] | null;
  owner_id: string;
  is_verified: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClubFormData {
  name: string;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  operating_hours?: Record<string, { open: string; close: string }> | null;
  amenities?: string[] | null;
}

interface UseClubReturn {
  club: Club | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateClub: (data: Partial<ClubFormData>) => Promise<{ success: boolean; error?: Error }>;
  isOwner: boolean;
}

/**
 * 현재 로그인한 사용자가 소유한 클럽 정보를 관리하는 훅
 */
export function useClub(): UseClubReturn {
  const { user, profile } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchClub = useCallback(async () => {
    if (!user) {
      setClub(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("clubs")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          // 클럽이 없는 경우
          setClub(null);
        } else {
          throw fetchError;
        }
      } else {
        setClub(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("클럽 정보를 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  const updateClub = useCallback(
    async (data: Partial<ClubFormData>): Promise<{ success: boolean; error?: Error }> => {
      if (!club) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("clubs")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", club.id);

        if (updateError) throw updateError;

        await fetchClub();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("클럽 정보 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club, supabase, fetchClub]
  );

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  const isOwner = profile?.role === "CLUB_OWNER" || profile?.role === "ADMIN";

  return {
    club,
    isLoading,
    error,
    refetch: fetchClub,
    updateClub,
    isOwner,
  };
}

/**
 * 특정 클럽 ID로 클럽 정보를 조회하는 훅
 */
export function useClubById(clubId: string | null): Omit<UseClubReturn, "updateClub" | "isOwner"> {
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchClub = useCallback(async () => {
    if (!clubId) {
      setClub(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", clubId)
        .single();

      if (fetchError) throw fetchError;
      setClub(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("클럽 정보를 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [clubId, supabase]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  return {
    club,
    isLoading,
    error,
    refetch: fetchClub,
  };
}
