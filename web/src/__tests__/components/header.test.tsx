import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/header";

// Mock the theme context
vi.mock("@/contexts/theme-context", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Header", () => {
  it("renders the logo", () => {
    render(<Header />);
    expect(screen.getByText("FS")).toBeInTheDocument();
    expect(screen.getByText("FingerScore")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    // Using translation keys since we mock useTranslations
    expect(screen.getByText("nav.places")).toBeInTheDocument();
    expect(screen.getByText("nav.equipment")).toBeInTheDocument();
    expect(screen.getByText("nav.lessons")).toBeInTheDocument();
    expect(screen.getByText("nav.matching")).toBeInTheDocument();
    expect(screen.getByText("nav.market")).toBeInTheDocument();
    expect(screen.getByText("nav.community")).toBeInTheDocument();
    expect(screen.getByText("nav.rankings")).toBeInTheDocument();
  });

  it("renders auth buttons when not logged in", () => {
    render(<Header />);
    // Both desktop and mobile versions
    const loginButtons = screen.getAllByText("common.login");
    const signupButtons = screen.getAllByText("common.signup");

    expect(loginButtons.length).toBeGreaterThan(0);
    expect(signupButtons.length).toBeGreaterThan(0);
  });

  it("has correct navigation hrefs", () => {
    render(<Header />);

    const placesLink = screen.getByRole("link", { name: /nav.places/i });
    const communityLink = screen.getByRole("link", { name: /nav.community/i });
    const rankingsLink = screen.getByRole("link", { name: /nav.rankings/i });

    expect(placesLink).toHaveAttribute("href", "/places");
    expect(communityLink).toHaveAttribute("href", "/community");
    expect(rankingsLink).toHaveAttribute("href", "/rankings");
  });
});
