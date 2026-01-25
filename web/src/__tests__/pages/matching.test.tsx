import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MatchingPage from "@/app/[locale]/matching/page";

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

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>Select</span>,
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarImage: (props: any) => <img {...props} />,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div role="dialog">{children}</div>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogTrigger: ({ children, asChild }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

describe("MatchingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title", () => {
    render(<MatchingPage />);

    expect(screen.getByText("연습 상대 매칭")).toBeInTheDocument();
  });

  it("renders quick match button", () => {
    render(<MatchingPage />);

    expect(screen.getByText("퀵매칭 시작")).toBeInTheDocument();
  });

  it("renders tab navigation", () => {
    render(<MatchingPage />);

    expect(screen.getByText("파트너 찾기")).toBeInTheDocument();
    expect(screen.getByText("받은 요청")).toBeInTheDocument();
    expect(screen.getByText("보낸 요청")).toBeInTheDocument();
  });

  it("renders available users", () => {
    render(<MatchingPage />);

    expect(screen.getByText("김탁구")).toBeInTheDocument();
    expect(screen.getByText("이스핀")).toBeInTheDocument();
    expect(screen.getByText("박수비")).toBeInTheDocument();
  });

  it("renders user play styles", () => {
    render(<MatchingPage />);

    expect(screen.getAllByText("공격형").length).toBeGreaterThan(0);
    expect(screen.getByText("회전형")).toBeInTheDocument();
    expect(screen.getByText("수비형")).toBeInTheDocument();
  });

  it("renders user ratings", () => {
    render(<MatchingPage />);

    expect(screen.getByText("1650")).toBeInTheDocument();
    expect(screen.getByText("1820")).toBeInTheDocument();
    expect(screen.getByText("1450")).toBeInTheDocument();
  });

  it("renders matching request buttons", () => {
    render(<MatchingPage />);

    const matchButtons = screen.getAllByText("매칭 신청");
    expect(matchButtons.length).toBeGreaterThan(0);
  });

  it("renders search functionality", () => {
    render(<MatchingPage />);

    const searchInput = screen.getByPlaceholderText(/이름, 지역, 탁구장으로 검색/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders matching tips section", () => {
    render(<MatchingPage />);

    expect(screen.getByText("매칭 성공률 높이는 팁")).toBeInTheDocument();
    expect(screen.getByText("정중한 인사")).toBeInTheDocument();
    expect(screen.getByText("구체적인 일정")).toBeInTheDocument();
  });

  it("toggles quick match state", () => {
    render(<MatchingPage />);

    const quickMatchButton = screen.getByText("퀵매칭 시작");
    fireEvent.click(quickMatchButton);

    // After click, button text should change to stop
    expect(screen.getByText("매칭 중지")).toBeInTheDocument();
  });
});
