"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2, Phone, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "올바른 전화번호를 입력해주세요")
    .regex(/^01[0-9]{8,9}$/, "올바른 휴대폰 번호를 입력해주세요"),
});

const otpSchema = z.object({
  token: z.string().length(6, "인증번호 6자리를 입력해주세요"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface PhoneLoginProps {
  redirectTo?: string;
}

export function PhoneLogin({ redirectTo = "/dashboard" }: PhoneLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleSendOtp = async (data: PhoneFormData) => {
    setIsLoading(true);
    const formattedPhone = `+82${data.phone.slice(1)}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        toast.error("인증번호 발송 실패", {
          description: error.message,
        });
        return;
      }

      setPhone(formattedPhone);
      setStep("otp");
      toast.success("인증번호 발송", {
        description: "입력하신 번호로 인증번호를 발송했습니다.",
      });
    } catch {
      toast.error("오류 발생", {
        description: "다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: data.token,
        type: "sms",
      });

      if (error) {
        toast.error("인증 실패", {
          description: "인증번호가 올바르지 않습니다.",
        });
        return;
      }

      toast.success("로그인 성공", {
        description: "환영합니다!",
      });
      router.push(redirectTo);
    } catch {
      toast.error("오류 발생", {
        description: "다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        toast.error("재발송 실패", {
          description: error.message,
        });
        return;
      }

      toast.success("인증번호 재발송", {
        description: "인증번호를 다시 발송했습니다.",
      });
    } catch {
      toast.error("오류 발생", {
        description: "다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">인증번호</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="token"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              className="pl-10 text-center text-lg tracking-widest"
              maxLength={6}
              {...otpForm.register("token")}
            />
          </div>
          {otpForm.formState.errors.token && (
            <p className="text-sm text-destructive">
              {otpForm.formState.errors.token.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {phone.replace("+82", "0")}로 발송된 인증번호를 입력하세요
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          인증하기
        </Button>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-muted-foreground hover:text-foreground"
          >
            전화번호 변경
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-primary hover:underline"
          >
            인증번호 재발송
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">휴대폰 번호</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="01012345678"
            className="pl-10"
            {...phoneForm.register("phone")}
          />
        </div>
        {phoneForm.formState.errors.phone && (
          <p className="text-sm text-destructive">
            {phoneForm.formState.errors.phone.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        인증번호 받기
      </Button>
    </form>
  );
}
