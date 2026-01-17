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
    expect(screen.getByText("대회")).toBeInTheDocument();
    expect(screen.getByText("커뮤니티")).toBeInTheDocument();
    expect(screen.getByText("랭킹")).toBeInTheDocument();
    expect(screen.getByText("라이브")).toBeInTheDocument();
  });

  it("renders auth buttons on desktop", () => {
    render(<Header />);
    const loginButtons = screen.getAllByText("로그인");
    const signupButton = screen.getByText("회원가입");

    expect(loginButtons.length).toBeGreaterThan(0);
    expect(signupButton).toBeInTheDocument();
  });

  it("has correct navigation hrefs", () => {
    render(<Header />);

    const tournamentsLink = screen.getByRole("link", { name: /대회/i });
    const communityLink = screen.getByRole("link", { name: /커뮤니티/i });
    const rankingsLink = screen.getByRole("link", { name: /랭킹/i });
    const liveLink = screen.getByRole("link", { name: /라이브/i });

    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
    expect(communityLink).toHaveAttribute("href", "/community");
    expect(rankingsLink).toHaveAttribute("href", "/rankings");
    expect(liveLink).toHaveAttribute("href", "/live");
  });
});
