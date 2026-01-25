import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EquipmentPage from "@/app/[locale]/equipment/page";

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

vi.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: any) => <div role="progressbar" aria-valuenow={value} />,
}));

describe("EquipmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title and description", () => {
    render(<EquipmentPage />);

    // Page title contains 탁구 장비
    expect(screen.getByText(/탁구 장비/)).toBeInTheDocument();
    // Badge text shows 장비 가이드 (may appear multiple times)
    expect(screen.getAllByText(/장비 가이드/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the four main tabs", () => {
    render(<EquipmentPage />);

    // Tabs: 구매처, 추천 조합, 장비 검색, 비교
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(4);
  });

  it("renders level badges in recommended combos", () => {
    render(<EquipmentPage />);

    expect(screen.getByText("초보")).toBeInTheDocument();
    expect(screen.getByText("중급")).toBeInTheDocument();
    expect(screen.getByText("상급")).toBeInTheDocument();
  });

  it("renders recommended combo titles", () => {
    render(<EquipmentPage />);

    // Check for combo section titles
    expect(screen.getByText(/왕초보 입문 세트/)).toBeInTheDocument();
    expect(screen.getByText(/중급 도약 세트/)).toBeInTheDocument();
    expect(screen.getByText(/공격형 세트/)).toBeInTheDocument();
  });

  it("renders equipment in recommended combos", () => {
    render(<EquipmentPage />);

    // The recommended combos tab shows blade and rubber names
    // 마크V appears in the 초보 combo
    expect(screen.getAllByText("마크V").length).toBeGreaterThanOrEqual(1);
    // 코르벨 appears in combos
    expect(screen.getAllByText("코르벨").length).toBeGreaterThanOrEqual(1);
  });

  it("renders level guide section", () => {
    render(<EquipmentPage />);

    // Level guide titles contain 초보자, 중급자, 상급자
    expect(screen.getAllByText(/초보자/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/중급자/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/상급자/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders FAQ section", () => {
    render(<EquipmentPage />);

    expect(screen.getByText(/자주 묻는 질문/)).toBeInTheDocument();
  });

  it("displays spec progress bars", () => {
    render(<EquipmentPage />);

    // Check for progress bars (used for speed, spin, control)
    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.length).toBeGreaterThan(0);
  });
});
