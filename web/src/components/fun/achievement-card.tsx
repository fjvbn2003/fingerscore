"use client";

import { useState } from "react";
import { Lock, Trophy, Star, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ACHIEVEMENTS,
  TIER_COLORS,
  type Achievement,
  type AchievementCategory,
  type UserAchievement,
  calculateProgress,
  getAchievementsByCategory,
  calculateTotalPoints,
} from "@/lib/achievements";

interface AchievementDisplayProps {
  userAchievements: UserAchievement[];
  stats: {
    matchCount: number;
    tournamentCount: number;
    rating: number;
    winStreak: number;
    postCount: number;
  };
}

const CATEGORY_INFO: Record<
  AchievementCategory,
  { label: string; icon: string }
> = {
  MATCHES: { label: "경기", icon: "🏓" },
  TOURNAMENTS: { label: "대회", icon: "🏆" },
  RATING: { label: "레이팅", icon: "📈" },
  STREAK: { label: "연속", icon: "🔥" },
  SOCIAL: { label: "소셜", icon: "💬" },
  SPECIAL: { label: "특별", icon: "✨" },
};

export function AchievementDisplay({
  userAchievements,
  stats,
}: AchievementDisplayProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<AchievementCategory>("MATCHES");

  const unlockedIds = userAchievements.map((ua) => ua.achievementId);
  const totalPoints = calculateTotalPoints(userAchievements);
  const unlockedCount = userAchievements.length;
  const totalCount = ACHIEVEMENTS.filter((a) => !a.secret).length;

  const getStatValue = (achievement: Achievement): number => {
    switch (achievement.category) {
      case "MATCHES":
        return stats.matchCount;
      case "TOURNAMENTS":
        return stats.tournamentCount;
      case "RATING":
        return stats.rating;
      case "STREAK":
        return stats.winStreak;
      case "SOCIAL":
        return stats.postCount;
      default:
        return 0;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              업적
            </CardTitle>
            <CardDescription>
              {unlockedCount}/{totalCount} 달성 완료
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-2xl font-bold">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              {totalPoints}
            </div>
            <p className="text-xs text-muted-foreground">총 포인트</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Progress
            value={(unlockedCount / totalCount) * 100}
            className="h-3"
          />
          <p className="mt-1 text-xs text-muted-foreground text-center">
            전체 진행률 {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as AchievementCategory)}
        >
          <TabsList className="grid w-full grid-cols-6">
            {Object.entries(CATEGORY_INFO).map(([category, info]) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                <span className="mr-1">{info.icon}</span>
                <span className="hidden sm:inline">{info.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(CATEGORY_INFO).map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="mt-4 space-y-3"
            >
              {getAchievementsByCategory(category as AchievementCategory).map(
                (achievement) => {
                  const isUnlocked = unlockedIds.includes(achievement.id);
                  const progress = calculateProgress(
                    achievement,
                    getStatValue(achievement)
                  );
                  const userAchievement = userAchievements.find(
                    (ua) => ua.achievementId === achievement.id
                  );

                  return (
                    <AchievementItem
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      progress={progress}
                      unlockedAt={userAchievement?.unlockedAt}
                    />
                  );
                }
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
  unlockedAt?: string;
}

function AchievementItem({
  achievement,
  isUnlocked,
  progress,
  unlockedAt,
}: AchievementItemProps) {
  const isSecret = achievement.secret && !isUnlocked;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4 transition-all",
              isUnlocked
                ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200"
                : "bg-muted/30 hover:bg-muted/50",
              isSecret && "opacity-60"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
                isUnlocked ? "bg-yellow-100" : "bg-muted"
              )}
            >
              {isSecret ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                achievement.icon
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={cn("font-medium", isSecret && "text-muted-foreground")}>
                  {isSecret ? "???" : achievement.name}
                </h4>
                <Badge
                  variant="outline"
                  className={cn("text-xs", TIER_COLORS[achievement.tier])}
                >
                  {achievement.tier}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {isSecret ? "숨겨진 업적" : achievement.description}
              </p>

              {/* Progress */}
              {!isUnlocked && !isSecret && (
                <div className="mt-2">
                  <Progress value={progress} className="h-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {progress}% 완료
                  </p>
                </div>
              )}
            </div>

            {/* Points & Status */}
            <div className="text-right shrink-0">
              {isUnlocked ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-bold">+{achievement.points}</span>
                  </div>
                  {unlockedAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(unlockedAt).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <Star className="h-5 w-5" />
                  <span className="text-xs">{achievement.points}p</span>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isUnlocked
            ? `${achievement.name} 달성! +${achievement.points}점`
            : isSecret
            ? "조건을 달성하면 공개됩니다"
            : `${achievement.requirement} 달성 시 획득`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// 최근 획득한 업적 표시용 컴포넌트
export function RecentAchievement({
  achievement,
}: {
  achievement: Achievement;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 p-3 animate-in slide-in-from-right">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-xl">
        {achievement.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
          🎉 업적 달성!
        </p>
        <p className="text-sm font-bold">{achievement.name}</p>
      </div>
      <div className="flex items-center gap-1 text-yellow-600 font-bold">
        <Star className="h-4 w-4 fill-yellow-500" />
        +{achievement.points}
      </div>
    </div>
  );
}
