import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useClub, useClubById } from "@/hooks/admin/use-club";
import type { Club } from "@/hooks/admin/use-club";

const mockClub: Club = {
  id: "club-1",
  name: "Test Club",
  description: "A test club",
  location: "Seoul",
  address: "123 Test St",
  phone: "010-1234-5678",
  email: "test@club.com",
  website: "https://testclub.com",
  logo_url: null,
  cover_image_url: null,
  operating_hours: null,
  amenities: ["parking", "shower"],
  owner_id: "user-1",
  is_verified: true,
  member_count: 50,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: mockClub, error: null })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    user: { id: "user-1" },
    profile: { role: "CLUB_OWNER" },
    isLoading: false,
  }),
}));

describe("useClub", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useClub());
    expect(result.current.isLoading).toBe(true);
  });

  it("should fetch club data for the current user", async () => {
    const { result } = renderHook(() => useClub());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSupabaseClient.from).toHaveBeenCalledWith("clubs");
  });

  it("should return isOwner based on user role", async () => {
    const { result } = renderHook(() => useClub());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isOwner).toBe(true);
  });

  it("should have updateClub function", async () => {
    const { result } = renderHook(() => useClub());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.updateClub).toBe("function");
  });

  it("should have refetch function", async () => {
    const { result } = renderHook(() => useClub());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });
});

describe("useClubById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not fetch when clubId is null", async () => {
    const { result } = renderHook(() => useClubById(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.club).toBe(null);
  });

  it("should fetch club when clubId is provided", async () => {
    const { result } = renderHook(() => useClubById("club-1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSupabaseClient.from).toHaveBeenCalledWith("clubs");
  });
});
