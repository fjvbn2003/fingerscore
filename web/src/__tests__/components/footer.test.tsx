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
    expect(screen.getByText("서비스")).toBeInTheDocument();

    const tournamentsLink = screen.getByRole("link", { name: "대회" });
    const communityLink = screen.getByRole("link", { name: "커뮤니티" });
    const rankingsLink = screen.getByRole("link", { name: "랭킹" });
    const liveLink = screen.getByRole("link", { name: "라이브" });

    expect(tournamentsLink).toHaveAttribute("href", "/tournaments");
    expect(communityLink).toHaveAttribute("href", "/community");
    expect(rankingsLink).toHaveAttribute("href", "/rankings");
    expect(liveLink).toHaveAttribute("href", "/live");
  });

  it("renders support links section", () => {
    render(<Footer />);
    expect(screen.getByText("지원")).toBeInTheDocument();
    expect(screen.getByText("이용 가이드")).toBeInTheDocument();
    expect(screen.getByText("자주 묻는 질문")).toBeInTheDocument();
    expect(screen.getByText("문의하기")).toBeInTheDocument();
  });

  it("renders legal links section", () => {
    render(<Footer />);
    expect(screen.getByText("법적 고지")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("이용약관")).toBeInTheDocument();
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
    expect(
      screen.getByText(/스마트 링으로 탁구 점수를 기록하고/)
    ).toBeInTheDocument();
  });
});
