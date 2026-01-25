import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMembers } from "@/hooks/admin/use-members";
import type { ClubMember } from "@/hooks/admin/use-members";

const mockMembers: ClubMember[] = [
  {
    id: "member-1",
    club_id: "club-1",
    user_id: "user-1",
    role: "MEMBER",
    status: "ACTIVE",
    joined_at: "2024-01-01T00:00:00Z",
    membership_start: "2024-01-01",
    membership_end: "2024-12-31",
    notes: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    profile: {
      id: "user-1",
      display_name: "Test User",
      avatar_url: null,
      email: "test@example.com",
      phone: "010-1234-5678",
    },
  },
  {
    id: "member-2",
    club_id: "club-1",
    user_id: "user-2",
    role: "COACH",
    status: "ACTIVE",
    joined_at: "2024-01-15T00:00:00Z",
    membership_start: null,
    membership_end: null,
    notes: "Coach notes",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    profile: {
      id: "user-2",
      display_name: "Coach User",
      avatar_url: null,
      email: "coach@example.com",
      phone: "010-9876-5432",
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
              data: mockMembers,
              error: null,
              count: mockMembers.length,
            })
          ),
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

describe("useMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useMembers());
    expect(result.current.isLoading).toBe(true);
  });

  it("should return members array", async () => {
    const { result } = renderHook(() => useMembers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.members)).toBe(true);
  });

  it("should return stats object with correct structure", async () => {
    const { result } = renderHook(() => useMembers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toHaveProperty("total");
    expect(result.current.stats).toHaveProperty("active");
    expect(result.current.stats).toHaveProperty("inactive");
    expect(result.current.stats).toHaveProperty("pending");
    expect(result.current.stats).toHaveProperty("coaches");
  });

  it("should have pagination controls", async () => {
    const { result } = renderHook(() => useMembers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.page).toBe("number");
    expect(typeof result.current.setPage).toBe("function");
    expect(typeof result.current.totalPages).toBe("number");
    expect(typeof result.current.pageSize).toBe("number");
  });

  it("should have CRUD functions", async () => {
    const { result } = renderHook(() => useMembers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.addMember).toBe("function");
    expect(typeof result.current.updateMember).toBe("function");
    expect(typeof result.current.removeMember).toBe("function");
  });

  it("should have filter controls", async () => {
    const { result } = renderHook(() => useMembers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filters).toBeDefined();
    expect(typeof result.current.setFilters).toBe("function");
  });
});
