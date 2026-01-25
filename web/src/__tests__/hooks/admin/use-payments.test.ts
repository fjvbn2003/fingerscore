import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePayments } from "@/hooks/admin/use-payments";
import type { Payment, PaymentStats } from "@/hooks/admin/use-payments";

const mockPayments: Payment[] = [
  {
    id: "payment-1",
    club_id: "club-1",
    user_id: "user-1",
    type: "MEMBERSHIP",
    amount: 100000,
    status: "COMPLETED",
    payment_method: "CARD",
    description: "Monthly membership",
    reference_id: null,
    reference_type: null,
    paid_at: "2024-01-15T10:00:00Z",
    due_date: null,
    notes: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    user: {
      id: "user-1",
      display_name: "Test User",
      avatar_url: null,
      email: "test@example.com",
    },
  },
  {
    id: "payment-2",
    club_id: "club-1",
    user_id: "user-2",
    type: "LESSON",
    amount: 50000,
    status: "PENDING",
    payment_method: null,
    description: "Lesson fee",
    reference_id: "lesson-1",
    reference_type: "lesson",
    paid_at: null,
    due_date: "2024-02-01",
    notes: null,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    user: {
      id: "user-2",
      display_name: "Another User",
      avatar_url: null,
      email: "another@example.com",
    },
  },
];

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        range: vi.fn(() => ({
          order: vi.fn(() =>
            Promise.resolve({
              data: mockPayments,
              error: null,
              count: mockPayments.length,
            })
          ),
        })),
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({
            range: vi.fn(() => ({
              order: vi.fn(() =>
                Promise.resolve({
                  data: mockPayments,
                  error: null,
                  count: mockPayments.length,
                })
              ),
            })),
          })),
        })),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}));

vi.mock("@/hooks/admin/use-club", () => ({
  useClub: () => ({
    club: { id: "club-1", name: "Test Club" },
    isLoading: false,
  }),
}));

describe("usePayments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => usePayments());
    expect(result.current.isLoading).toBe(true);
  });

  it("should return payments array", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.payments)).toBe(true);
  });

  it("should return stats object with correct structure", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toHaveProperty("totalRevenue");
    expect(result.current.stats).toHaveProperty("monthlyRevenue");
    expect(result.current.stats).toHaveProperty("pendingAmount");
    expect(result.current.stats).toHaveProperty("completedCount");
    expect(result.current.stats).toHaveProperty("pendingCount");
    expect(result.current.stats).toHaveProperty("byType");
  });

  it("should have pagination controls", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.page).toBe("number");
    expect(typeof result.current.setPage).toBe("function");
    expect(typeof result.current.totalPages).toBe("number");
  });

  it("should have CRUD functions", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.createPayment).toBe("function");
    expect(typeof result.current.updatePayment).toBe("function");
    expect(typeof result.current.confirmPayment).toBe("function");
    expect(typeof result.current.refundPayment).toBe("function");
    expect(typeof result.current.deletePayment).toBe("function");
  });

  it("should have filter controls", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filters).toBeDefined();
    expect(typeof result.current.setFilters).toBe("function");
  });

  it("should have exportToCSV function", async () => {
    const { result } = renderHook(() => usePayments());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.exportToCSV).toBe("function");
  });

  it("should initialize stats with zero values", () => {
    const { result } = renderHook(() => usePayments());

    expect(result.current.stats.totalRevenue).toBe(0);
    expect(result.current.stats.monthlyRevenue).toBe(0);
    expect(result.current.stats.pendingAmount).toBe(0);
    expect(result.current.stats.completedCount).toBe(0);
    expect(result.current.stats.pendingCount).toBe(0);
  });

  it("should initialize byType stats with all payment types", () => {
    const { result } = renderHook(() => usePayments());

    expect(result.current.stats.byType).toHaveProperty("MEMBERSHIP");
    expect(result.current.stats.byType).toHaveProperty("LESSON");
    expect(result.current.stats.byType).toHaveProperty("EVENT");
    expect(result.current.stats.byType).toHaveProperty("OTHER");
  });
});
