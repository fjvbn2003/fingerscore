import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MarketPage from "@/app/[locale]/market/page";

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

describe("MarketPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page hero section", () => {
    render(<MarketPage />);

    expect(screen.getByText("중고 장터")).toBeInTheDocument();
    expect(screen.getByText(/중고 거래/i)).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<MarketPage />);

    const searchInput = screen.getByPlaceholderText(/찾는 장비를 검색하세요/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders the sell button", () => {
    render(<MarketPage />);

    expect(screen.getByText("판매하기")).toBeInTheDocument();
  });

  it("renders category filters", () => {
    render(<MarketPage />);

    // Categories are rendered as button text
    expect(screen.getByText("전체")).toBeInTheDocument();
    expect(screen.getAllByText(/블레이드/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/러버/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders product listings", () => {
    render(<MarketPage />);

    expect(screen.getByText("버터플라이 티모볼 ALC 블레이드")).toBeInTheDocument();
    expect(screen.getByText("테너지 05 포핸드 러버 (새상품)")).toBeInTheDocument();
    expect(screen.getByText("스티가 올라운드 입문용 라켓 세트")).toBeInTheDocument();
  });

  it("renders product prices", () => {
    render(<MarketPage />);

    expect(screen.getByText(/180,000원/)).toBeInTheDocument();
    expect(screen.getByText(/45,000원/)).toBeInTheDocument();
    expect(screen.getByText(/35,000원/)).toBeInTheDocument();
  });

  it("renders condition badges", () => {
    render(<MarketPage />);

    expect(screen.getAllByText("A급").length).toBeGreaterThan(0);
    expect(screen.getAllByText("새상품").length).toBeGreaterThan(0);
    expect(screen.getByText("B급")).toBeInTheDocument();
  });

  it("renders sold status for completed items", () => {
    render(<MarketPage />);

    expect(screen.getByText("판매완료")).toBeInTheDocument();
  });

  it("renders reserved status", () => {
    render(<MarketPage />);

    expect(screen.getByText("예약중")).toBeInTheDocument();
  });

  it("renders safety guide section", () => {
    render(<MarketPage />);

    expect(screen.getByText("안전 거래 가이드")).toBeInTheDocument();
    expect(screen.getByText(/직거래 시 공공장소에서 만나세요/i)).toBeInTheDocument();
  });

  it("renders popular search terms", () => {
    render(<MarketPage />);

    expect(screen.getByText("인기 검색어")).toBeInTheDocument();
    // These words appear multiple times in the page
    expect(screen.getAllByText("버터플라이").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("테너지").length).toBeGreaterThanOrEqual(1);
  });

  it("displays product count", () => {
    render(<MarketPage />);

    // Should show the count of products
    expect(screen.getByText(/개의 상품/)).toBeInTheDocument();
  });
});
