import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LessonsPage from "@/app/[locale]/lessons/page";

// Mock the UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children, defaultValue }: any) => <div data-testid="tabs" data-default={defaultValue}>{children}</div>,
  TabsList: ({ children }: any) => <div role="tablist">{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button role="tab" data-value={value}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div role="tabpanel" data-value={value}>{children}</div>,
}));

vi.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: any) => <div role="progressbar" aria-valuenow={value} />,
}));

describe("LessonsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page hero section", () => {
    render(<LessonsPage />);

    expect(screen.getByText("탁구 교실")).toBeInTheDocument();
    expect(screen.getByText(/기술을 업그레이드/i)).toBeInTheDocument();
  });

  it("renders skill categories", () => {
    render(<LessonsPage />);

    expect(screen.getByText("기초")).toBeInTheDocument();
    expect(screen.getByText("서브")).toBeInTheDocument();
    expect(screen.getByText("공격")).toBeInTheDocument();
    expect(screen.getByText("수비")).toBeInTheDocument();
    expect(screen.getByText("회전")).toBeInTheDocument();
  });

  it("renders tab navigation", () => {
    render(<LessonsPage />);

    expect(screen.getByText("인기 레슨")).toBeInTheDocument();
    expect(screen.getByText("학습 경로")).toBeInTheDocument();
    expect(screen.getByText("연습 드릴")).toBeInTheDocument();
    expect(screen.getByText("오늘의 팁")).toBeInTheDocument();
  });

  it("renders popular lessons", () => {
    render(<LessonsPage />);

    expect(screen.getByText("포핸드 드라이브 완벽 가이드")).toBeInTheDocument();
    expect(screen.getByText("백핸드 플릭 마스터하기")).toBeInTheDocument();
    expect(screen.getByText("하회전 서브의 모든 것")).toBeInTheDocument();
  });

  it("renders learning paths", () => {
    render(<LessonsPage />);

    expect(screen.getByText("입문자 완성 코스")).toBeInTheDocument();
    expect(screen.getByText("서브 마스터 코스")).toBeInTheDocument();
    expect(screen.getByText("공격 테크닉 심화")).toBeInTheDocument();
  });

  it("renders practice drills", () => {
    render(<LessonsPage />);

    expect(screen.getByText("멀티볼 드라이브")).toBeInTheDocument();
    expect(screen.getByText("서브 & 3구 공격")).toBeInTheDocument();
    expect(screen.getByText("풋워크 드릴")).toBeInTheDocument();
  });

  it("renders daily tips", () => {
    render(<LessonsPage />);

    expect(screen.getByText("서브 회전량 높이기")).toBeInTheDocument();
    expect(screen.getByText("풋워크의 중요성")).toBeInTheDocument();
  });

  it("allows category selection", () => {
    render(<LessonsPage />);

    const attackButton = screen.getByText("공격");
    fireEvent.click(attackButton);

    // The button should be clickable
    expect(attackButton).toBeInTheDocument();
  });

  it("renders search functionality", () => {
    render(<LessonsPage />);

    const searchInput = screen.getByPlaceholderText(/배우고 싶은 기술 검색/i);
    expect(searchInput).toBeInTheDocument();
  });
});
