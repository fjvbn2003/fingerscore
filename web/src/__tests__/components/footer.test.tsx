import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders the logo and brand name", () => {
    render(<Footer />);
    expect(screen.getByText("FS")).toBeInTheDocument();
    expect(screen.getByText("FingerScore")).toBeInTheDocument();
  });

  it("renders service links section", () => {
    render(<Footer />);
    expect(screen.getByText("footer.service")).toBeInTheDocument();

    const tournamentsLink = screen.getByRole("link", { name: "nav.tournaments" });
    const communityLink = screen.getByRole("link", { name: "nav.community" });
    const rankingsLink = screen.getByRole("link", { name: "nav.rankings" });
    const liveLink = screen.getByRole("link", { name: "nav.live" });

    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
    expect(communityLink).toHaveAttribute("href", "/community");
    expect(rankingsLink).toHaveAttribute("href", "/rankings");
    expect(liveLink).toHaveAttribute("href", "/live");
  });

  it("renders support links section", () => {
    render(<Footer />);
    expect(screen.getByText("footer.support")).toBeInTheDocument();
    expect(screen.getByText("footer.guide")).toBeInTheDocument();
    expect(screen.getByText("faq.title")).toBeInTheDocument();
    expect(screen.getByText("contact.title")).toBeInTheDocument();
  });

  it("renders legal links section", () => {
    render(<Footer />);
    expect(screen.getByText("footer.legal")).toBeInTheDocument();
    expect(screen.getByText("legal.privacyTitle")).toBeInTheDocument();
    expect(screen.getByText("legal.termsTitle")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} FingerScore. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it("renders brand description", () => {
    render(<Footer />);
    expect(screen.getByText("home.hero.description")).toBeInTheDocument();
  });
});
