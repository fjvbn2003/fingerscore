"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Calculator,
  Trophy,
  BarChart3,
  Gamepad2,
  Target,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingSimulator } from "@/components/fun/rating-simulator";
import { AchievementDisplay } from "@/components/fun/achievement-card";
import { StatsDashboard } from "@/components/fun/stats-dashboard";

// Mock data for demonstration
const mockUserAchievements = [
  { achievementId: "first_match", unlockedAt: "2024-01-01T10:00:00Z", progress: 100 },
  { achievementId: "matches_10", unlockedAt: "2024-01-10T15:00:00Z", progress: 100 },
  { achievementId: "first_tournament", unlockedAt: "2024-01-15T09:00:00Z", progress: 100 },
  { achievementId: "win_streak_3", unlockedAt: "2024-01-18T14:00:00Z", progress: 100 },
  { achievementId: "rating_1200", unlockedAt: "2024-01-20T11:00:00Z", progress: 100 },
  { achievementId: "first_post", unlockedAt: "2024-01-05T16:00:00Z", progress: 100 },
];

const mockStats = {
  // 기본 정보
  rating: 1580,
  ratingChange: 45,
  rank: 234,
  totalPlayers: 5420,

  // 경기 통계
  totalMatches: 87,
  wins: 52,
  losses: 35,
  winStreak: 4,
  bestWinStreak: 8,

  // 세트/점수 통계
  totalSetsWon: 168,
  totalSetsLost: 124,
  totalPointsWon: 4521,
  totalPointsLost: 3892,

  // 대회 통계
  tournamentsPlayed: 6,
  tournamentsWon: 1,
  bestTournamentResult: "우승",

  // 라이벌 정보
  topRivals: [
    {
      id: "r1",
      name: "김철수",
      matches: 12,
      myWins: 7,
      theirWins: 5,
      lastMatch: "2024-01-18",
    },
    {
      id: "r2",
      name: "박영희",
      matches: 8,
      myWins: 3,
      theirWins: 5,
      lastMatch: "2024-01-15",
    },
    {
      id: "r3",
      name: "이민수",
      matches: 6,
      myWins: 4,
      theirWins: 2,
      lastMatch: "2024-01-12",
    },
  ],

  // 최근 폼
  recentForm: ["W", "W", "L", "W", "W", "L", "W", "L", "W", "W"] as ("W" | "L")[],

  // 시간대별 승률
  peakHours: [
    { hour: 9, winRate: 55 },
    { hour: 10, winRate: 60 },
    { hour: 11, winRate: 58 },
    { hour: 12, winRate: 45 },
    { hour: 13, winRate: 50 },
    { hour: 14, winRate: 62 },
    { hour: 15, winRate: 68 },
    { hour: 16, winRate: 70 },
    { hour: 17, winRate: 65 },
    { hour: 18, winRate: 72 },
    { hour: 19, winRate: 75 },
    { hour: 20, winRate: 68 },
    { hour: 21, winRate: 60 },
    { hour: 22, winRate: 55 },
  ],
};

const achievementStats = {
  matchCount: 87,
  tournamentCount: 6,
  rating: 1580,
  winStreak: 4,
  postCount: 12,
};

export default function ToolsPage() {
  const t = useTranslations();

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Gamepad2 className="h-8 w-8" />
          탁구 도구
        </h1>
        <p className="mt-1 text-muted-foreground">
          레이팅 시뮬레이터, 통계 분석, 업적 시스템을 즐겨보세요
        </p>
      </div>

      <Tabs defaultValue="simulator" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="simulator" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">시뮬레이터</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">내 통계</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">업적</span>
          </TabsTrigger>
        </TabsList>

        {/* Rating Simulator Tab */}
        <TabsContent value="simulator">
          <RatingSimulator
            defaultMyRating={mockStats.rating}
            defaultOpponentRating={1500}
          />
        </TabsContent>

        {/* Stats Dashboard Tab */}
        <TabsContent value="stats">
          <StatsDashboard stats={mockStats} />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <AchievementDisplay
            userAchievements={mockUserAchievements}
            stats={achievementStats}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            탁구 꿀팁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                레이팅 올리기
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                자신보다 50~100점 높은 상대와 경기하면 승리 시 더 많은 점수를 얻을 수 있어요.
                하지만 연패 시 큰 손실이 있으니 주의하세요!
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                대회 참가
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                대회에 참가하면 경험치와 업적 포인트를 더 빠르게 얻을 수 있어요.
                4강 이상 진출하면 특별 업적도 획득!
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                통계 활용
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                시간대별 승률을 확인해서 가장 컨디션이 좋은 시간에 중요한 경기를 잡아보세요.
                라이벌 전적도 분석해보세요!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
