import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlacesPage from "@/app/[locale]/places/page";

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

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>Select</span>,
}));

describe("PlacesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title", () => {
    render(<PlacesPage />);

    expect(screen.getByText(/내 주변 탁구장 찾기/i)).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<PlacesPage />);

    const searchInput = screen.getByPlaceholderText(/탁구장 이름이나 지역으로 검색/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders filter badges", () => {
    render(<PlacesPage />);

    // Check for filter badges
    expect(screen.getAllByText("레슨가능").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("주차가능").length).toBeGreaterThanOrEqual(1);
  });

  it("renders club cards with names", () => {
    render(<PlacesPage />);

    // Check for mock club names
    expect(screen.getByText("강남 탁구클럽")).toBeInTheDocument();
    expect(screen.getByText("역삼동 탁구동호회")).toBeInTheDocument();
  });

  it("renders place types", () => {
    render(<PlacesPage />);

    expect(screen.getAllByText("탁구장").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("동호회").length).toBeGreaterThanOrEqual(1);
  });

  it("allows search input changes", () => {
    render(<PlacesPage />);

    const searchInput = screen.getByPlaceholderText(/탁구장 이름이나 지역으로 검색/i);
    fireEvent.change(searchInput, { target: { value: "강남" } });

    expect(searchInput).toHaveValue("강남");
  });

  it("displays results count", () => {
    render(<PlacesPage />);

    // Should show the total results count
    expect(screen.getByText(/개의 결과/)).toBeInTheDocument();
  });

  it("renders rating information", () => {
    render(<PlacesPage />);

    // Check for ratings
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("4.6")).toBeInTheDocument();
  });
});
