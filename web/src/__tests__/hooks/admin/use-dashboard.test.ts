import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboard } from "@/hooks/admin/use-dashboard";
import type { DashboardStats } from "@/hooks/admin/use-dashboard";

const mockStats: DashboardStats = {
  totalMembers: 100,
  activeMembers: 80,
  newMembersThisMonth: 10,
  memberGrowthRate: 5.0,
  totalLessons: 50,
  scheduledLessons: 20,
  completedLessonsThisMonth: 15,
  lessonCompletionRate: 75.0,
  totalRevenue: 5000000,
  monthlyRevenue: 1000000,
  pendingPayments: 200000,
  revenueGrowthRate: 10.0,
  totalCoaches: 5,
  activeCoaches: 4,
  exchangeMatchesThisMonth: 3,
  pendingExchangeMatches: 2,
};

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        gte: vi.fn(() => ({
          lt: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          })),
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        })),
      })),
      or: vi.fn(() => ({
        gte: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
      })),
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

describe("useDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have isLoading property", () => {
    const { result } = renderHook(() => useDashboard());
    expect(typeof result.current.isLoading).toBe("boolean");
  });

  it("should return stats object with correct structure", async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toHaveProperty("totalMembers");
    expect(result.current.stats).toHaveProperty("activeMembers");
    expect(result.current.stats).toHaveProperty("newMembersThisMonth");
    expect(result.current.stats).toHaveProperty("memberGrowthRate");
    expect(result.current.stats).toHaveProperty("totalLessons");
    expect(result.current.stats).toHaveProperty("scheduledLessons");
    expect(result.current.stats).toHaveProperty("completedLessonsThisMonth");
    expect(result.current.stats).toHaveProperty("lessonCompletionRate");
    expect(result.current.stats).toHaveProperty("totalRevenue");
    expect(result.current.stats).toHaveProperty("monthlyRevenue");
    expect(result.current.stats).toHaveProperty("pendingPayments");
    expect(result.current.stats).toHaveProperty("revenueGrowthRate");
    expect(result.current.stats).toHaveProperty("totalCoaches");
    expect(result.current.stats).toHaveProperty("activeCoaches");
    expect(result.current.stats).toHaveProperty("exchangeMatchesThisMonth");
    expect(result.current.stats).toHaveProperty("pendingExchangeMatches");
  });

  it("should return recentActivities array", async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.recentActivities)).toBe(true);
  });

  it("should return upcomingEvents array", async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.upcomingEvents)).toBe(true);
  });

  it("should have refetch function", async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("should initialize stats with zero values", async () => {
    const { result } = renderHook(() => useDashboard());

    // Check initial values before loading completes
    expect(result.current.stats.totalMembers).toBe(0);
    expect(result.current.stats.totalRevenue).toBe(0);
  });
});
