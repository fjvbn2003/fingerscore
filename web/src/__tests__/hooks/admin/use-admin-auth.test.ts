import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { canAccessAdminMenu, hasRole } from "@/hooks/admin/use-admin-auth";
import type { UserRole } from "@/types/database";

// Mock the dependencies
vi.mock("@/contexts/auth-context", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "test-user-id" },
    profile: { role: "CLUB_OWNER" as UserRole },
    isLoading: false,
  })),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/admin",
}));

describe("canAccessAdminMenu", () => {
  it("should return false for null role", () => {
    expect(canAccessAdminMenu(null, "/admin")).toBe(false);
  });

  it("should return false for USER role", () => {
    expect(canAccessAdminMenu("USER", "/admin")).toBe(false);
  });

  it("should return true for ADMIN role on any path", () => {
    expect(canAccessAdminMenu("ADMIN", "/admin")).toBe(true);
    expect(canAccessAdminMenu("ADMIN", "/admin/system")).toBe(true);
    expect(canAccessAdminMenu("ADMIN", "/admin/system/users")).toBe(true);
  });

  it("should return true for CLUB_OWNER on non-system paths", () => {
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin")).toBe(true);
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin/members")).toBe(true);
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin/lessons")).toBe(true);
  });

  it("should return false for CLUB_OWNER on system paths", () => {
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin/system")).toBe(false);
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin/system/users")).toBe(false);
    expect(canAccessAdminMenu("CLUB_OWNER", "/admin/system/clubs")).toBe(false);
  });

  it("should return false for ORGANIZER role", () => {
    expect(canAccessAdminMenu("ORGANIZER", "/admin")).toBe(false);
  });
});

describe("hasRole", () => {
  it("should return true when user has the required role", () => {
    expect(hasRole("ADMIN", ["ADMIN"])).toBe(true);
    expect(hasRole("CLUB_OWNER", ["CLUB_OWNER"])).toBe(true);
  });

  it("should return true when user role is in allowed roles array", () => {
    expect(hasRole("ADMIN", ["ADMIN", "CLUB_OWNER"])).toBe(true);
    expect(hasRole("CLUB_OWNER", ["ADMIN", "CLUB_OWNER"])).toBe(true);
  });

  it("should return false when user role is not in allowed roles", () => {
    expect(hasRole("CLUB_OWNER", ["ADMIN"])).toBe(false);
    expect(hasRole("USER", ["CLUB_OWNER"])).toBe(false);
    expect(hasRole("ORGANIZER", ["ADMIN"])).toBe(false);
  });

  it("should return false for null role", () => {
    expect(hasRole(null, ["ADMIN"])).toBe(false);
    expect(hasRole(null, ["USER"])).toBe(false);
  });
});
