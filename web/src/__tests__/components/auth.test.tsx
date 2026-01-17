import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialLogin } from "@/components/auth/social-login";
import { PhoneLogin } from "@/components/auth/phone-login";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
    },
  }),
}));

describe("SocialLogin", () => {
  it("renders Google login button", () => {
    render(<SocialLogin />);
    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
  });

  it("renders Kakao login button", () => {
    render(<SocialLogin />);
    expect(screen.getByText("카카오로 계속하기")).toBeInTheDocument();
  });

  it("has correct number of social login buttons", () => {
    render(<SocialLogin />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // Google, Kakao
  });
});

describe("PhoneLogin", () => {
  it("renders phone input field", () => {
    render(<PhoneLogin />);
    expect(screen.getByLabelText("휴대폰 번호")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<PhoneLogin />);
    expect(screen.getByRole("button", { name: "인증번호 받기" })).toBeInTheDocument();
  });

  it("has placeholder text for phone input", () => {
    render(<PhoneLogin />);
    expect(screen.getByPlaceholderText("01012345678")).toBeInTheDocument();
  });
});
