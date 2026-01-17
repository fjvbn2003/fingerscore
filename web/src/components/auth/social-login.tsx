"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Provider = "google" | "kakao";

const providerConfig = {
  google: {
    name: "Google",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    bgClass: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300",
  },
  kakao: {
    name: "카카오",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#000000"
          d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222v2.276a.472.472 0 1 0 .944 0v-1.357l.47-.453 1.529 2.2a.472.472 0 1 0 .771-.536l-1.656-2.131zM8.728 9.282a.472.472 0 1 0-.944 0v4.1l-1.848-4.363a.472.472 0 0 0-.872.369l2.127 5.024a.471.471 0 0 0 .865 0l2.127-5.024a.472.472 0 1 0-.872-.369l-1.528 3.612v-3.35zM4.006 9.282a.472.472 0 1 0-.944 0v5.055a.472.472 0 1 0 .944 0V9.282z"
        />
      </svg>
    ),
    bgClass: "bg-[#FEE500] hover:bg-[#FDD835] text-[#191919]",
  },
};

interface SocialLoginProps {
  redirectTo?: string;
}

export function SocialLogin({ redirectTo = "/dashboard" }: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const supabase = createClient();

  const handleSocialLogin = async (provider: Provider) => {
    setLoadingProvider(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (error) {
        toast.error("로그인 실패", {
          description: error.message,
        });
      }
    } catch {
      toast.error("로그인 실패", {
        description: "다시 시도해주세요.",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {(Object.keys(providerConfig) as Provider[]).map((provider) => {
        const config = providerConfig[provider];
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            variant="outline"
            className={`w-full ${config.bgClass}`}
            onClick={() => handleSocialLogin(provider)}
            disabled={loadingProvider !== null}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span className="mr-2">{config.icon}</span>
            )}
            {config.name}로 계속하기
          </Button>
        );
      })}
    </div>
  );
}
