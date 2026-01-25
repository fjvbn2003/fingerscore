"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Zap,
  Users,
  Trophy,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Target,
  Medal,
  X,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MatchType = "singles" | "doubles" | "practice";
type GameFormat = "3" | "5" | "7";

interface QuickMatchModalProps {
  trigger?: React.ReactNode;
}

export function QuickMatchModal({ trigger }: QuickMatchModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [matchType, setMatchType] = useState<MatchType>("singles");
  const [gameFormat, setGameFormat] = useState<GameFormat>("3");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMatch = async () => {
    setIsSubmitting(true);

    // 시뮬레이션: 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("경기가 등록되었습니다! 🏓", {
      description: "상대방에게 알림이 전송되었습니다.",
    });

    setIsSubmitting(false);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setMatchType("singles");
    setGameFormat("3");
  };

  const matchTypes = [
    {
      id: "singles" as MatchType,
      icon: "🏓",
      label: "단식",
      description: "1:1 대결",
      color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    },
    {
      id: "doubles" as MatchType,
      icon: "👥",
      label: "복식",
      description: "2:2 대결",
      color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    },
    {
      id: "practice" as MatchType,
      icon: "🎯",
      label: "연습",
      description: "자유 연습",
      color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    },
  ];

  const gameFormats = [
    { value: "3" as GameFormat, label: "3판 2선승", description: "빠른 경기" },
    { value: "5" as GameFormat, label: "5판 3선승", description: "일반 경기" },
    { value: "7" as GameFormat, label: "7판 4선승", description: "정식 경기" },
  ];

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-emerald-500/25 gap-2"
          >
            <Zap className="h-5 w-5" />
            빠른 경기 등록
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>빠른 경기 등록</DialogTitle>
              <DialogDescription>
                3초 만에 경기를 시작하세요!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step >= s
                    ? "bg-gradient-to-br from-emerald-500 to-blue-600 text-white"
                    : "bg-white/5 text-muted-foreground"
                )}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "flex-1 h-1 rounded-full transition-all",
                  step > s ? "bg-emerald-500" : "bg-white/10"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          {/* Step 1: Match Type */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-center mb-4">어떤 경기를 할까요?</h3>
              <div className="grid gap-3">
                {matchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setMatchType(type.id);
                      setStep(2);
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all hover-lift",
                      matchType === type.id
                        ? `bg-gradient-to-r ${type.color}`
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="text-3xl">{type.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Game Format */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-center mb-4">몇 판제로 할까요?</h3>
              <div className="grid gap-3">
                {gameFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => {
                      setGameFormat(format.value);
                      setStep(3);
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all hover-lift",
                      gameFormat === format.value
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold">
                      {format.value}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{format.label}</div>
                      <div className="text-sm text-muted-foreground">{format.description}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
              >
                이전으로
              </Button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-semibold text-center mb-4">경기 준비 완료!</h3>

              <Card className="glass-card border-white/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">경기 유형</span>
                    <Badge variant="secondary">
                      {matchTypes.find(t => t.id === matchType)?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">게임 포맷</span>
                    <Badge variant="secondary">
                      {gameFormats.find(f => f.value === gameFormat)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-400">자동 알림 발송</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      경기 등록 시 근처 선수들에게 자동으로 알림이 발송됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-white/10"
                  onClick={() => setStep(2)}
                >
                  이전으로
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
                  onClick={handleCreateMatch}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      등록 중...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      경기 시작!
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
