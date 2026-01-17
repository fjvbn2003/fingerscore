import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/header";

describe("Header", () => {
  it("renders the logo", () => {
    render(<Header />);
    expect(screen.getByText("FS")).toBeInTheDocument();
    expect(screen.getByText("FingerScore")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    // Using translation keys since we mock useTranslations
    expect(screen.getByText("nav.tournaments")).toBeInTheDocument();
    expect(screen.getByText("nav.community")).toBeInTheDocument();
    expect(screen.getByText("nav.rankings")).toBeInTheDocument();
    expect(screen.getByText("nav.live")).toBeInTheDocument();
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

    const tournamentsLink = screen.getByRole("link", { name: /nav.tournaments/i });
    const communityLink = screen.getByRole("link", { name: /nav.community/i });
    const rankingsLink = screen.getByRole("link", { name: /nav.rankings/i });
    const liveLink = screen.getByRole("link", { name: /nav.live/i });

    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
    expect(communityLink).toHaveAttribute("href", "/community");
    expect(rankingsLink).toHaveAttribute("href", "/rankings");
    expect(liveLink).toHaveAttribute("href", "/live");
  });
});
