import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCoaches } from "@/hooks/admin/use-coaches";
import type { Coach } from "@/hooks/admin/use-coaches";

const mockCoaches: Coach[] = [
  {
    id: "coach-1",
    club_id: "club-1",
    user_id: "user-1",
    specialties: ["table-tennis", "billiards"],
    bio: "Experienced coach",
    hourly_rate: 50000,
    availability: {
      monday: [{ start: "09:00", end: "18:00" }],
      tuesday: [{ start: "09:00", end: "18:00" }],
    },
    is_active: true,
    total_lessons: 100,
    total_students: 50,
    average_rating: 4.8,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    profile: {
      id: "user-1",
      display_name: "Coach Kim",
      avatar_url: null,
      email: "coach@example.com",
      phone: "010-1234-5678",
    },
  },
];

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: mockCoaches,
            error: null,
          })
        ),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    upsert: vi.fn(() => Promise.resolve({ error: null })),
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

describe("useCoaches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useCoaches());
    expect(result.current.isLoading).toBe(true);
  });

  it("should return coaches array", async () => {
    const { result } = renderHook(() => useCoaches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.coaches)).toBe(true);
  });

  it("should return stats object with correct structure", async () => {
    const { result } = renderHook(() => useCoaches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toHaveProperty("total");
    expect(result.current.stats).toHaveProperty("active");
    expect(result.current.stats).toHaveProperty("totalLessons");
    expect(result.current.stats).toHaveProperty("totalStudents");
    expect(result.current.stats).toHaveProperty("averageRating");
  });

  it("should have CRUD functions", async () => {
    const { result } = renderHook(() => useCoaches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.addCoach).toBe("function");
    expect(typeof result.current.updateCoach).toBe("function");
    expect(typeof result.current.removeCoach).toBe("function");
    expect(typeof result.current.toggleActive).toBe("function");
  });

  it("should have schedule management functions", async () => {
    const { result } = renderHook(() => useCoaches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.getCoachSchedule).toBe("function");
    expect(typeof result.current.updateCoachSchedule).toBe("function");
  });

  it("should have filter controls", async () => {
    const { result } = renderHook(() => useCoaches());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filters).toBeDefined();
    expect(typeof result.current.setFilters).toBe("function");
  });

  it("should initialize stats with zero values", () => {
    const { result } = renderHook(() => useCoaches());

    expect(result.current.stats.total).toBe(0);
    expect(result.current.stats.active).toBe(0);
    expect(result.current.stats.totalLessons).toBe(0);
    expect(result.current.stats.totalStudents).toBe(0);
    expect(result.current.stats.averageRating).toBe(0);
  });
});
