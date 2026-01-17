"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Famous sports quotes with authors
const sportsQuotes = [
  // Table Tennis
  { quote: "탁구는 체스를 하면서 100m 달리기를 하는 것과 같다", author: "베르너 슐라거", sport: "TABLE_TENNIS" },
  { quote: "연습은 거짓말을 하지 않는다", author: "마롱", sport: "TABLE_TENNIS" },
  { quote: "작은 공 하나에 모든 것이 담겨있다", author: "장지커", sport: "TABLE_TENNIS" },
  { quote: "집중력이 승부를 가른다", author: "유승민", sport: "TABLE_TENNIS" },
  { quote: "탁구대 위에서는 나이가 숫자에 불과하다", author: "왕난", sport: "TABLE_TENNIS" },

  // Tennis
  { quote: "챔피언은 챔피언처럼 행동한다. 그 전에", author: "빌리 진 킹", sport: "TENNIS" },
  { quote: "최선을 다하지 않으면 '만약'이라는 후회가 남는다", author: "라파엘 나달", sport: "TENNIS" },
  { quote: "당신의 가장 큰 상대는 당신 자신이다", author: "로저 페더러", sport: "TENNIS" },
  { quote: "위대함은 하루아침에 오지 않는다", author: "노박 조코비치", sport: "TENNIS" },
  { quote: "승리는 준비된 자의 것이다", author: "세레나 윌리엄스", sport: "TENNIS" },

  // Badminton
  { quote: "셔틀콕은 거짓말을 하지 않는다", author: "린단", sport: "BADMINTON" },
  { quote: "한 점 한 점이 역사를 만든다", author: "케빈 사양", sport: "BADMINTON" },
  { quote: "포기하지 않으면 기회는 온다", author: "이용대", sport: "BADMINTON" },
  { quote: "경기장에서는 겸손하게, 연습에서는 치열하게", author: "타오피크 히다얏", sport: "BADMINTON" },
  { quote: "빠른 발은 빠른 생각에서 나온다", author: "성지현", sport: "BADMINTON" },

  // General Sports Motivation
  { quote: "오늘의 땀이 내일의 기록이 된다", author: "무명", sport: "GENERAL" },
  { quote: "지는 것이 두려우면 이길 수 없다", author: "무명", sport: "GENERAL" },
  { quote: "몸이 힘들 때 정신력이 시작된다", author: "무명", sport: "GENERAL" },
  { quote: "실패는 성공의 어머니가 아니라 스승이다", author: "무명", sport: "GENERAL" },
  { quote: "동호인이지만 프로처럼", author: "무명", sport: "GENERAL" },
  { quote: "오늘도 한 판 더!", author: "FingerScore", sport: "GENERAL" },
  { quote: "경기에서 지면 연습에서 이겨야 한다", author: "무명", sport: "GENERAL" },
  { quote: "좋은 상대가 나를 더 강하게 만든다", author: "무명", sport: "GENERAL" },
];

interface SportsQuotesTickerProps {
  className?: string;
  speed?: "slow" | "normal" | "fast";
  showIcon?: boolean;
  variant?: "default" | "minimal" | "gradient";
}

export function SportsQuotesTicker({
  className,
  speed = "normal",
  showIcon = true,
  variant = "default",
}: SportsQuotesTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Shuffle quotes on mount
  const [shuffledQuotes] = useState(() => {
    return [...sportsQuotes].sort(() => Math.random() - 0.5);
  });

  // Auto-advance quotes
  useEffect(() => {
    const duration = speed === "slow" ? 8000 : speed === "fast" ? 4000 : 6000;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % shuffledQuotes.length);
        setIsAnimating(false);
      }, 500);
    }, duration);

    return () => clearInterval(interval);
  }, [shuffledQuotes.length, speed]);

  const currentQuote = shuffledQuotes[currentIndex];

  const variantStyles = {
    default: "bg-gradient-to-r from-slate-800/80 via-slate-900/90 to-slate-800/80 border-y border-slate-700/50",
    minimal: "bg-transparent",
    gradient: "bg-gradient-to-r from-emerald-900/30 via-blue-900/30 to-purple-900/30 border-y border-white/10",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden py-2 px-4",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-3 transition-all duration-500",
          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        )}
      >
        {showIcon && (
          <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0 animate-pulse" />
        )}
        <p className="text-sm text-slate-300 truncate">
          <span className="italic">&ldquo;{currentQuote.quote}&rdquo;</span>
          <span className="text-slate-500 ml-2">— {currentQuote.author}</span>
        </p>
        {showIcon && (
          <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0 animate-pulse" />
        )}
      </div>
    </div>
  );
}

// Scrolling ticker variant (continuous horizontal scroll)
export function SportsQuotesScrollTicker({
  className,
  speed = "normal",
}: {
  className?: string;
  speed?: "slow" | "normal" | "fast";
}) {
  const scrollSpeed = speed === "slow" ? 40 : speed === "fast" ? 20 : 30;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-2 border-y border-slate-700/50",
        className
      )}
    >
      <div
        className="flex whitespace-nowrap animate-scroll"
        style={{
          animationDuration: `${scrollSpeed * sportsQuotes.length}s`,
        }}
      >
        {/* Double the content for seamless loop */}
        {[...sportsQuotes, ...sportsQuotes].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-4 px-8"
          >
            <Quote className="h-3 w-3 text-amber-400/60" />
            <span className="text-sm text-slate-400 italic">
              &ldquo;{item.quote}&rdquo;
            </span>
            <span className="text-xs text-slate-600">— {item.author}</span>
            <span className="text-slate-700">•</span>
          </div>
        ))}
      </div>

      {/* Gradient fades on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
}
