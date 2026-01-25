"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";

export interface Payment {
  id: string;
  club_id: string;
  user_id: string;
  type: "MEMBERSHIP" | "LESSON" | "EVENT" | "OTHER";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";
  payment_method: "CASH" | "CARD" | "TRANSFER" | "OTHER" | null;
  description: string | null;
  reference_id: string | null; // lesson_id, membership_id 등
  reference_type: string | null;
  paid_at: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    email: string | null;
  };
}

export interface PaymentFormData {
  user_id: string;
  type: Payment["type"];
  amount: number;
  status?: Payment["status"];
  payment_method?: Payment["payment_method"];
  description?: string | null;
  reference_id?: string | null;
  reference_type?: string | null;
  due_date?: string | null;
  notes?: string | null;
}

export interface PaymentFilters {
  status?: Payment["status"];
  type?: Payment["type"];
  payment_method?: Payment["payment_method"];
  date_from?: string;
  date_to?: string;
  user_id?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  completedCount: number;
  pendingCount: number;
  byType: Record<Payment["type"], number>;
}

interface UsePaymentsReturn {
  payments: Payment[];
  stats: PaymentStats;
  isLoading: boolean;
  error: Error | null;
  filters: PaymentFilters;
  setFilters: (filters: PaymentFilters) => void;
  refetch: () => Promise<void>;
  createPayment: (data: PaymentFormData) => Promise<{ success: boolean; error?: Error }>;
  updatePayment: (
    paymentId: string,
    data: Partial<PaymentFormData>
  ) => Promise<{ success: boolean; error?: Error }>;
  confirmPayment: (
    paymentId: string,
    paymentMethod: Payment["payment_method"]
  ) => Promise<{ success: boolean; error?: Error }>;
  refundPayment: (paymentId: string) => Promise<{ success: boolean; error?: Error }>;
  deletePayment: (paymentId: string) => Promise<{ success: boolean; error?: Error }>;
  // 내보내기
  exportToCSV: () => string;
  // Pagination
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const PAGE_SIZE = 20;

/**
 * 결제 관리 훅
 */
export function usePayments(): UsePaymentsReturn {
  const { club } = useClub();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]); // 통계용 전체 데이터
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    byType: {
      MEMBERSHIP: 0,
      LESSON: 0,
      EVENT: 0,
      OTHER: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchPayments = useCallback(async () => {
    if (!club?.id) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("payments")
        .select(
          `
          *,
          user:profiles!payments_user_id_fkey (
            id,
            display_name,
            avatar_url,
            email
          )
        `,
          { count: "exact" }
        )
        .eq("club_id", club.id);

      // 필터 적용
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.payment_method) {
        query = query.eq("payment_method", filters.payment_method);
      }
      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id);
      }
      if (filters.date_from) {
        query = query.gte("created_at", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("created_at", filters.date_to);
      }

      // 페이지네이션
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setPayments((data as Payment[]) || []);
      setTotalCount(count || 0);

      // 전체 데이터 조회 (통계용)
      const { data: allDataRaw } = await supabase
        .from("payments")
        .select("amount, status, type, paid_at, created_at")
        .eq("club_id", club.id);

      type PaymentStatsData = {
        amount: number;
        status: string;
        type: string;
        paid_at: string | null;
        created_at: string;
      };

      const allData = (allDataRaw as PaymentStatsData[]) || [];

      if (allData.length > 0) {
        setAllPayments(allData as unknown as Payment[]);

        // 이번 달 시작일
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const completed = allData.filter((p) => p.status === "COMPLETED");
        const pending = allData.filter((p) => p.status === "PENDING");
        const monthlyCompleted = completed.filter((p) => p.paid_at && p.paid_at >= monthStart);

        const byType: Record<Payment["type"], number> = {
          MEMBERSHIP: 0,
          LESSON: 0,
          EVENT: 0,
          OTHER: 0,
        };
        completed.forEach((p) => {
          if (p.type in byType) {
            byType[p.type as Payment["type"]] += p.amount;
          }
        });

        setStats({
          totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
          monthlyRevenue: monthlyCompleted.reduce((sum, p) => sum + p.amount, 0),
          pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
          completedCount: completed.length,
          pendingCount: pending.length,
          byType,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("결제 목록을 불러오는데 실패했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [club?.id, filters, page, supabase]);

  const createPayment = useCallback(
    async (data: PaymentFormData): Promise<{ success: boolean; error?: Error }> => {
      if (!club?.id) {
        return { success: false, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("payments").insert({
          club_id: club.id,
          ...data,
          status: data.status || "PENDING",
        });

        if (insertError) throw insertError;

        await fetchPayments();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("결제 등록에 실패했습니다.");
        return { success: false, error };
      }
    },
    [club?.id, supabase, fetchPayments]
  );

  const updatePayment = useCallback(
    async (
      paymentId: string,
      data: Partial<PaymentFormData>
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("payments")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        if (updateError) throw updateError;

        await fetchPayments();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("결제 정보 수정에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchPayments]
  );

  const confirmPayment = useCallback(
    async (
      paymentId: string,
      paymentMethod: Payment["payment_method"]
    ): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("payments")
          .update({
            status: "COMPLETED",
            payment_method: paymentMethod,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        if (updateError) throw updateError;

        await fetchPayments();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("결제 확인에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchPayments]
  );

  const refundPayment = useCallback(
    async (paymentId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("payments")
          .update({
            status: "REFUNDED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", paymentId);

        if (updateError) throw updateError;

        await fetchPayments();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("환불 처리에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchPayments]
  );

  const deletePayment = useCallback(
    async (paymentId: string): Promise<{ success: boolean; error?: Error }> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any).from("payments").delete().eq("id", paymentId);

        if (deleteError) throw deleteError;

        await fetchPayments();
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("결제 삭제에 실패했습니다.");
        return { success: false, error };
      }
    },
    [supabase, fetchPayments]
  );

  const exportToCSV = useCallback((): string => {
    const headers = ["날짜", "회원명", "유형", "금액", "결제방법", "상태", "설명"];
    const rows = payments.map((p) => [
      p.paid_at || p.created_at,
      p.user?.display_name || "",
      p.type,
      p.amount.toString(),
      p.payment_method || "",
      p.status,
      p.description || "",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    return csvContent;
  }, [payments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    payments,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchPayments,
    createPayment,
    updatePayment,
    confirmPayment,
    refundPayment,
    deletePayment,
    exportToCSV,
    page,
    setPage,
    totalPages,
  };
}
