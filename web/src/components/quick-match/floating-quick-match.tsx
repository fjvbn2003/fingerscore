"use client";

import { useState } from "react";
import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickMatchModal } from "./quick-match-modal";
import { cn } from "@/lib/utils";

export function FloatingQuickMatch() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {isExpanded && (
        <div className="animate-fade-in bg-card text-card-foreground rounded-lg shadow-xl p-3 mr-2 max-w-[200px]">
          <p className="text-sm font-medium">빠른 경기 등록</p>
          <p className="text-xs text-muted-foreground mt-1">
            3초만에 경기를 시작하세요!
          </p>
        </div>
      )}

      {/* Main Button */}
      <QuickMatchModal
        trigger={
          <Button
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-xl transition-all duration-300",
              "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700",
              "hover:scale-110 hover:shadow-emerald-500/25 hover:shadow-2xl",
              "animate-pulse-glow"
            )}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            <Zap className="h-6 w-6 text-white" />
          </Button>
        }
      />
    </div>
  );
}
